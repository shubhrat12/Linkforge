// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUrlAnalytics } = require('../controllers/analyticsController');

// Middleware to completely disable caching for all routes on this router
router.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

// Your endpoint (Now protected by auth AND prevented from caching)
router.get('/:urlId', auth, getUrlAnalytics);

module.exports = router;