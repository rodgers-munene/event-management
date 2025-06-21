const postPayment = require('../controllers/paymentController');
const router = require('express').Router();
const validateToken = require('../middleware/validateToken')

router.post('/', validateToken, postPayment)


module.exports = router;