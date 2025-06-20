const db = require('../config/db')

const postPayment = async (req, res, next) => {
    const {
    event_id,
    participant_name,
    participant_number,
    amount,
    payment_method,
    transaction_id,
  } = req.body;

  try {
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
    res
      .status(201)
      .json({ message: "Payment successful!", paymentId: result.insertId });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to process payment.", details: error.message });
  }
}

module.exports = postPayment