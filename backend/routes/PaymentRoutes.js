const postPayment = require('../controllers/paymentController');
const router = require('express').Router();

router.post('/', postPayment)


module.exports = router;