const { z } = require('zod');

// Schema for payment processing
const paymentSchema = z.object({
  body: z.object({
    event_id: z.string().or(z.number()).transform(val => Number(val)),
    participant_name: z.string().min(3, 'Name must be at least 3 characters').max(100),
    participant_number: z.string().min(10, 'Invalid phone number').max(20),
    amount: z.preprocess(
      (val) => Number(val),
      z.number().gt(0, 'Amount must be greater than 0')
    ),
    payment_method: z.enum(['Credit Card', 'PayPal', 'M-Pesa', 'Bank Transfer'], {
      errorMap: () => ({ message: 'Invalid payment method' })
    }),
    transaction_id: z.string().min(5, 'Invalid transaction ID').max(100)
  })
});

module.exports = {
  paymentSchema
};
