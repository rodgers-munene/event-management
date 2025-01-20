  const express = require('express');
  const bcrypt = require('bcryptjs'); // To hash passwords
  const jwt = require('jsonwebtoken'); // For generating JWT tokens
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const db = require('./db'); // Import the database connection
  require('dotenv').config(); // Load environment variables
  
  // Initialize express
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Test route to ensure server is running
  app.get('/', (req, res) => {
    res.send('Event Management API is running!');
  });
  
  // User registration
  app.post('/api/users/register', async (req, res) => {
    const { user_name, user_email, password } = req.body;
  
    try {
      const [result] = await db.query(
        'INSERT INTO users (user_name, user_email, password) VALUES (?, ?, ?)',
        [user_name, user_email, password]
      );
      res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user.', details: error.message });
    }
  });

  // User Login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to find the user by email
    const [rows] = await db.query('SELECT * FROM users WHERE user_email = ?', [email]);

    // Check if the user exists
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare the plain-text password directly
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Set token expiration time
    });

    // Respond with the token and user information
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.user_id, name: user.user_name, email: user.user_email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in', details: error.message });
  }
}); 


  // Fetch all events
  app.get('/api/events', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM events');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch events.', details: error.message });
    }
  });
  
  // Create new event
  app.post('/api/events', async (req, res) => {
    const {
      user_id,
      event_title,
      event_description,
      event_start_date,
      event_end_date,
      event_location,
      event_price,
      image_url,
    } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO events (user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url]
      );
      res.status(201).json({ message: 'Event created successfully!', eventId: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create event.', details: error.message });
    }
  });
  
  // Event registration and payment
  app.post('/api/payments', async (req, res) => {
    const { event_id, participant_name, participant_number, amount, payment_method, transaction_id } = req.body;
  
    try {
      const [result] = await db.query(
        `INSERT INTO payments (event_id, participant_name, participant_number, amount, payment_method, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [event_id, participant_name, participant_number, amount, payment_method, transaction_id]
      );
      res.status(201).json({ message: 'Payment successful!', paymentId: result.insertId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process payment.', details: error.message });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  