const express = require("express");
const cors = require("cors");
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

// new authentication routes
app.use("/api/auth", require("./routes/AuthRoutes"));

// event routes
app.use('/api/events', require("./routes/EventRoutes"))

// registration management
app.use('/api/event', require('./routes/RegisterRoutes'))

// payment routes
app.use('/api/payments', require('./routes/PaymentRoutes'))


// error handler middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
