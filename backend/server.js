const express = require("express");
const bcrypt = require("bcryptjs"); // To hash passwords
const jwt = require("jsonwebtoken"); // For generating JWT tokens
// const bodyParser = require('body-parser');
const cors = require("cors");
const db = require("./config/db"); // Import the database connection
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config(); // Load environment variables

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to ensure server is running
app.get("/", (req, res) => {
  res.send("Event Management API is running!");
});

// new authentication routes
app.use("/api/auth", require("./routes/AuthRoutes"));

// User login
app.post("/api/users/login", async (req, res) => {
  const { user_email, password } = req.body;

  try {
    // Check if the user exists
    const [rows] = await db.query("SELECT * FROM users WHERE user_email = ?", [
      user_email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "5h", // Token expiration time
    });

    // Send a successful response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.user_name,
        email: user.user_email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to log in", details: error.message });
  }
});

// Fetch all events
app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    res.status(200).json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch events.", details: error.message });
  }
});

// Fetch events details
app.get("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch event details.",
        details: error.message,
      });
  }
});

// Create new event
app.post("/api/events", async (req, res) => {
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
      [
        user_id,
        event_title,
        event_description,
        event_start_date,
        event_end_date,
        event_location,
        event_price,
        image_url,
      ]
    );
    res
      .status(201)
      .json({
        message: "Event created successfully!",
        eventId: result.insertId,
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create event.", details: error.message });
  }
});

// Event registration and payment
app.post("/api/payments", async (req, res) => {
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
});

// error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
