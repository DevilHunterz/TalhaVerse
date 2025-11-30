const rateLimit = require('express-rate-limit');

// Auth rate limiter - 5 requests per 15 minutes
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Download rate limiter - 20 downloads per hour
exports.downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Download limit exceeded, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// General API rate limiter - 100 requests per 15 minutes
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});
