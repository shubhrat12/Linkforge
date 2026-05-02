// --- middleware/rateLimiter.js ---
const rateLimit = require('express-rate-limit');

exports.createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50,
  message: { error: 'Too many URLs created, try again later.' }
});