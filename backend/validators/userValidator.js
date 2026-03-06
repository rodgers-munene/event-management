const { z } = require('zod');

// Schema for user registration
const registerSchema = z.object({
  body: z.object({
    user_name: z.string().min(3, 'Username must be at least 3 characters').max(100),
    user_email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100)
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
  })
});

// Schema for user login
const loginSchema = z.object({
  body: z.object({
    user_email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

// Schema for updating user
const updateUserSchema = z.object({
  params: z.object({
    id: z.union([z.string(), z.number()]).transform(val => Number(val)).refine(val => !isNaN(val), "ID must be a valid number")
  }),
  body: z.object({
    user_name: z.string().min(3).max(100).optional(),
    user_email: z.string().email().optional(),
    phone: z.string().optional(),
    organization: z.string().optional()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema
};
