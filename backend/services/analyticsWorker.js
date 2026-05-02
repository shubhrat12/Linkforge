// --- services/analyticsWorker.js ---
const { Worker } = require('bullmq');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');
const crypto = require('crypto');
const db = require('../models/db');
const redis = require('./redis');

const worker = new Worker('clicks', async job => {
    const { urlId, ip, userAgent, timestamp } = job.data;
    const geo = geoip.lookup(ip);
    const country = geo ? geo.country : 'Unknown';
    const city = geo ? geo.city : 'Unknown';
    
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    const deviceType = parser.getDevice().type || 'Desktop';
    
    const visitorId = crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');

    await db.query(
        `INSERT INTO clicks (url_id, ip_address, country, city, device_type, browser, os, visitor_id, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [urlId, ip, country, city, deviceType, browser, os, visitorId, timestamp]
    );
}, { connection: redis });