const rateLimit = require('express-rate-limit');

// Check if running in test environment
const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;

/**
 * General rate limiter for all routes
 * Limits each IP to 100 requests per 15 minutes
 * Disabled in test environment
 */
const generalLimiter = isTest ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    title: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Strict rate limiter for authentication routes
 * Limits each IP to 5 requests per minute
 * Disabled in test environment
 */
const authLimiter = isTest ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    title: 'Too Many Requests',
    message: 'Too many login/register attempts, please try again after 1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for payment routes
 * Limits each IP to 10 requests per minute
 * Disabled in test environment
 */
const paymentLimiter = isTest ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    title: 'Too Many Requests',
    message: 'Too many payment requests, please try again after 1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for event creation
 * Limits each IP to 20 requests per minute
 * Disabled in test environment
 */
const eventLimiter = isTest ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    success: false,
    title: 'Too Many Requests',
    message: 'Too many event creation requests, please try again after 1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  paymentLimiter,
  eventLimiter
};
