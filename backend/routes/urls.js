// --- routes/urls.js ---
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createUrlLimiter } = require('../middleware/rateLimiter');
const { createShortUrl } = require('../controllers/urlController');
const db = require('../models/db'); // for the GET route

router.post('/', auth, createUrlLimiter, createShortUrl);
router.get('/', auth, async (req, res) => {
  const urls = await db.query('SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
  res.json(urls.rows);
});
module.exports = router;