const db = require('../config/db');
const { paymentSchema } = require('../validators/paymentValidator');

const postPayment = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = paymentSchema.parse({ body: req.body });
    const {
      event_id,
      participant_name,
      participant_number,
      amount,
      payment_method,
      transaction_id,
    } = validatedData.body;

    // Check if event exists
    const [event] = await db.query("SELECT * FROM events WHERE id = ?", [event_id]);
    if (event.length === 0) {
      res.status(404);
      throw new Error("Event not found");
    }

    const [result] = await db.query(
      `INSERT INTO payments (event_id, participant_name, participant_number, amount, payment_method, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [
        event_id,
        participant_name,
        participant_number,
        amount,
        payment_method,
        transaction_id,
      ]
    );
    
    res.status(201).json({ 
      success: true,
      message: "Payment successful!", 
      paymentId: result.insertId 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postPayment;
