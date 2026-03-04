const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management System API',
      version: '1.0.0',
      description: `
# Event Management System Backend API

A comprehensive RESTful API for managing events, users, registrations, and payments.

## Features
- 🔐 User Authentication (JWT)
- 📅 Event Management (CRUD)
- 🎫 Event Registration
- 💳 Payment Processing
- 🔍 Search & Filter
- 📊 Pagination Support

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`

## Response Format
All responses follow a consistent format:
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
\`\`\`

## Error Format
\`\`\`json
{
  "success": false,
  "title": "Error Title",
  "message": "Error description",
  "errors": []
}
\`\`\`
      `,
      contact: {
        name: 'API Support',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Alternative development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['user_name', 'user_email', 'password'],
          properties: {
            id: { type: 'integer', description: 'User ID' },
            user_name: { type: 'string', description: 'Username' },
            user_email: { type: 'string', format: 'email', description: 'User email' },
            phone: { type: 'string', description: 'Phone number' },
            organization: { type: 'string', description: 'Organization name' },
            date_created: { type: 'string', format: 'date-time', description: 'Registration date' },
          },
        },
        Event: {
          type: 'object',
          required: ['user_id', 'event_title', 'event_start_date', 'event_end_date', 'event_location'],
          properties: {
            id: { type: 'integer', description: 'Event ID' },
            user_id: { type: 'integer', description: 'Organizer user ID' },
            event_title: { type: 'string', description: 'Event title' },
            event_description: { type: 'string', description: 'Event description' },
            event_start_date: { type: 'string', format: 'date-time', description: 'Start date and time' },
            event_end_date: { type: 'string', format: 'date-time', description: 'End date and time' },
            event_location: { type: 'string', description: 'Event location' },
            event_price: { type: 'number', format: 'float', description: 'Event price' },
            image_url: { type: 'string', format: 'uri', description: 'Event image URL' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
            updated_at: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
          },
        },
        Payment: {
          type: 'object',
          required: ['event_id', 'participant_name', 'participant_number', 'amount', 'payment_method', 'transaction_id'],
          properties: {
            id: { type: 'integer', description: 'Payment ID' },
            event_id: { type: 'integer', description: 'Event ID' },
            participant_name: { type: 'string', description: 'Participant name' },
            participant_number: { type: 'string', description: 'Participant phone number' },
            amount: { type: 'number', format: 'float', description: 'Payment amount' },
            payment_date: { type: 'string', format: 'date-time', description: 'Payment timestamp' },
            payment_method: { 
              type: 'string', 
              enum: ['Credit Card', 'PayPal', 'M-Pesa', 'Bank Transfer'],
              description: 'Payment method' 
            },
            transaction_id: { type: 'string', description: 'Unique transaction ID' },
          },
        },
        Registration: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Registration ID' },
            user_id: { type: 'integer', description: 'User ID' },
            event_id: { type: 'integer', description: 'Event ID' },
            status: { 
              type: 'string', 
              enum: ['pending', 'confirmed', 'cancelled'],
              description: 'Registration status' 
            },
            created_at: { type: 'string', format: 'date-time', description: 'Registration timestamp' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            title: { type: 'string', example: 'Error Title' },
            message: { type: 'string', example: 'Error description' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Authentication', description: 'User registration, login, and profile management' },
      { name: 'Events', description: 'Event CRUD operations' },
      { name: 'Registrations', description: 'Event registration management' },
      { name: 'Payments', description: 'Payment processing' },
    ],
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
