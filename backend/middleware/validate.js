const { ZodError } = require('zod');

/**
 * Middleware to validate request data against Zod schemas
 * @param {ZodSchema} schema - The Zod schema to validate against
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Parse and validate the request data
    schema.parse({
      body: req.body || {},
      params: req.params || {},
      query: req.query || {}
    });

    // If validation passes, continue to next middleware
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Format validation errors into a readable format
      const errors = error.issues?.map(err => ({
        field: err.path?.join('.') || 'root',
        message: err.message,
        code: err.code
      })) || [];

      console.log('Validation errors:', errors);

      return res.status(400).json({
        success: false,
        title: 'Validation Error',
        errors
      });
    }
    next(error);
  }
};

module.exports = validate;
