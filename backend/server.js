const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require('swagger-ui-express');
const expressRequestId = require('express-request-id').default;
const errorHandler = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");
const { logger, stream } = require("./config/logger");
const swaggerSpec = require("./config/swagger");
const cacheService = require("./config/cache");
require("dotenv").config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5001;

// Request ID tracking (adds X-Request-ID header to all requests/responses)
app.use(expressRequestId({
  headerName: 'X-Request-ID',
  setHeader: true,
}));

// Log incoming requests with request ID
app.use((req, res, next) => {
  logger.info('Incoming request', {
    requestId: req.get('X-Request-ID'),
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Security middleware - sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: false, // Disable if you need inline scripts
  crossOriginEmbedderPolicy: false,
}));

// Request logging middleware with Winston stream
app.use(morgan('combined', { stream }));

// General rate limiter for all routes
app.use(generalLimiter);

// CORS middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit payload size to prevent DoS
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Documentation (Swagger UI)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Event Management API Docs',
}));

// Serve Swagger JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use('/api/events', require("./routes/EventRoutes"));
app.use('/api/event', require('./routes/RegisterRoutes'));
app.use('/api/payments', require('./routes/PaymentRoutes'));
app.use('/api', require('./routes/AnalyticsRoutes')); // Analytics, tickets, waitlist

// 404 handler for unknown routes
app.use((req, res) => {
  const requestId = req.get('X-Request-ID');
  logger.warn('Route not found', {
    requestId,
    method: req.method,
    path: req.path,
  });
  
  res.status(404).json({
    success: false,
    title: "Not Found",
    message: `Route ${req.method} ${req.path} not found`,
    requestId,
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} signal received: starting graceful shutdown`);
  
  // Close cache connection
  await cacheService.disconnect();
  
  logger.info('Graceful shutdown completed');
  process.exit(0);
};

// Start the server
const server = app.listen(PORT, () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid,
  });
  
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ✅ Event Management API Server                          ║
║                                                           ║
║   📍 Local:   http://localhost:${PORT}                     ║
║   📚 Docs:    http://localhost:${PORT}/api-docs            ║
║   💚 Health:  http://localhost:${PORT}/health              ║
║                                                           ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   📝 Log Level: ${process.env.LOG_LEVEL || 'info'}                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason?.message || reason,
    stack: reason?.stack,
  });
  server.close(() => process.exit(1));
});

// Initialize cache on startup
cacheService.connect().catch(err => {
  logger.error('Failed to initialize cache', { error: err.message });
});

module.exports = app;
