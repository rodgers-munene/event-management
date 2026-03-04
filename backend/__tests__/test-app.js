const request = require('supertest');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('../middleware/errorHandler');
const { generalLimiter } = require('../middleware/rateLimiter');

// Create test app without problematic dependencies
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Rate limiter (disabled in test env)
app.use(generalLimiter);

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use("/api/auth", require("../routes/AuthRoutes"));
app.use('/api/events', require("../routes/EventRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    title: "Not Found",
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
