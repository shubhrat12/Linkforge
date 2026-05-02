const { customAlphabet } = require('nanoid');
const db = require('../models/db'); 
const redis = require('../services/redis');
const { enqueueClickEvent } = require('../services/analyticsQueue');

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7);

exports.createShortUrl = async (req, res) => {
    try {
        const { longUrl, customAlias, expiresAt } = req.body;
        const userId = req.user.id;

        let shortCode = customAlias || nanoid();

        if (customAlias) {
            const existing = await db.query('SELECT id FROM urls WHERE short_code = $1', [shortCode]);
            if (existing.rows.length > 0) return res.status(400).json({ error: 'Alias already in use' });
        }

        const newUrl = await db.query(
            'INSERT INTO urls (user_id, long_url, short_code, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, longUrl, shortCode, expiresAt]
        );

        const urlRecord = newUrl.rows[0];

        // FIX: Cache BOTH the longUrl and the database UUID as a stringified JSON object
        const cacheData = JSON.stringify({ longUrl: urlRecord.long_url, id: urlRecord.id });
        await redis.set(`url:${shortCode}`, cacheData, 'EX', 86400); 

        res.status(201).json(urlRecord);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        let longUrl;
        let urlId;

        // 1. Check Cache
        const cachedData = await redis.get(`url:${shortCode}`);

        if (cachedData) {
            // FIX: Parse the JSON to extract both values on a cache hit
            const parsedData = JSON.parse(cachedData);
            longUrl = parsedData.longUrl;
            urlId = parsedData.id;
        } else {
            // 2. Check DB if not in cache
            const urlData = await db.query('SELECT id, long_url, expires_at FROM urls WHERE short_code = $1', [shortCode]);
            if (urlData.rows.length === 0) return res.status(404).send('URL not found');

            const url = urlData.rows[0];
            
            if (url.expires_at && new Date() > new Date(url.expires_at)) {
                return res.status(410).send('URL expired');
            }

            longUrl = url.long_url;
            urlId = url.id;
            
            // FIX: Update cache with stringified JSON
            const cacheDataToSet = JSON.stringify({ longUrl: longUrl, id: urlId });
            await redis.set(`url:${shortCode}`, cacheDataToSet, 'EX', 86400);
        }

        // 3. Fire and forget analytics event (now guaranteed to have the correct UUID)
        enqueueClickEvent({
            urlId: urlId, // Will always be the exact DB UUID now
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            timestamp: new Date()
        });

        // 4. Redirect
        res.redirect(302, longUrl);

    } catch (error) {
        console.error(error); // Good practice to log this so you can see if the queue fails
        res.status(500).send('Server Error');
    }
};
