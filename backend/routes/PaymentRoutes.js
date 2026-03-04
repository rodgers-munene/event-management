const postPayment = require('../controllers/paymentController');
const validateToken = require('../middleware/validateToken');
const validate = require('../middleware/validate');
const { paymentLimiter } = require('../middleware/rateLimiter');
const { paymentSchema } = require('../validators/paymentValidator');
const router = require('express').Router();

// POST payment
// POST /api/payments
// Private route with rate limiting and validation
router.post('/', validateToken, paymentLimiter, validate(paymentSchema), postPayment);

module.exports = router;
