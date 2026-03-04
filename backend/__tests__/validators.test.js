const { z } = require('zod');
const {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  paginationSchema,
} = require('../validators/eventValidator');

const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('../validators/userValidator');

const { paymentSchema } = require('../validators/paymentValidator');

describe('Event Validators', () => {
  describe('createEventSchema', () => {
    it('should validate valid event data', () => {
      const validEvent = {
        body: {
          user_id: 1,
          event_title: 'Tech Conference 2026',
          event_description: 'A great conference',
          event_start_date: '2026-06-15T09:00:00.000Z',
          event_end_date: '2026-06-15T17:00:00.000Z',
          event_location: 'San Francisco',
          event_price: 99.99,
          image_url: 'https://example.com/image.jpg',
        },
      };

      const result = createEventSchema.parse(validEvent);
      expect(result.body.event_title).toBe('Tech Conference 2026');
      expect(result.body.user_id).toBe(1);
    });

    it('should reject short event title', () => {
      const invalidEvent = {
        body: {
          user_id: 1,
          event_title: 'AB',
          event_start_date: '2026-06-15T09:00:00.000Z',
          event_end_date: '2026-06-15T17:00:00.000Z',
          event_location: 'San Francisco',
          event_price: 0,
        },
      };

      expect(() => createEventSchema.parse(invalidEvent)).toThrow(z.ZodError);
    });

    it('should reject negative price', () => {
      const invalidEvent = {
        body: {
          user_id: 1,
          event_title: 'Valid Title',
          event_start_date: '2026-06-15T09:00:00.000Z',
          event_end_date: '2026-06-15T17:00:00.000Z',
          event_location: 'San Francisco',
          event_price: -100,
        },
      };

      expect(() => createEventSchema.parse(invalidEvent)).toThrow(z.ZodError);
    });

    it('should reject end date before start date', () => {
      const invalidEvent = {
        body: {
          user_id: 1,
          event_title: 'Valid Title',
          event_start_date: '2026-06-15T09:00:00.000Z',
          event_end_date: '2026-06-14T09:00:00.000Z',
          event_location: 'San Francisco',
          event_price: 0,
        },
      };

      expect(() => createEventSchema.parse(invalidEvent)).toThrow(z.ZodError);
    });

    it('should accept free events (price = 0)', () => {
      const freeEvent = {
        body: {
          user_id: 1,
          event_title: 'Free Workshop',
          event_start_date: '2026-06-15T09:00:00.000Z',
          event_end_date: '2026-06-15T17:00:00.000Z',
          event_location: 'Online',
          event_price: 0,
        },
      };

      expect(() => createEventSchema.parse(freeEvent)).not.toThrow();
    });
  });

  describe('paginationSchema', () => {
    it('should validate valid pagination', () => {
      const validPagination = {
        query: {
          limit: 10,
          page: 2,
        },
      };

      const result = paginationSchema.parse(validPagination);
      expect(result.query.limit).toBe(10);
      expect(result.query.page).toBe(2);
    });

    it('should accept default values', () => {
      const emptyPagination = { query: {} };
      const result = paginationSchema.parse(emptyPagination);
      
      // Should not throw, defaults handled in controller
      expect(result).toBeDefined();
    });

    it('should reject negative limit', () => {
      const invalidPagination = {
        query: { limit: -1, page: 1 },
      };

      expect(() => paginationSchema.parse(invalidPagination)).toThrow(z.ZodError);
    });

    it('should reject limit over 100', () => {
      const invalidPagination = {
        query: { limit: 101, page: 1 },
      };

      expect(() => paginationSchema.parse(invalidPagination)).toThrow(z.ZodError);
    });
  });

  describe('getEventSchema', () => {
    it('should validate event ID', () => {
      const validId = { params: { id: 123 } };
      const result = getEventSchema.parse(validId);
      expect(result.params.id).toBe(123);
    });

    it('should accept string ID and convert to number', () => {
      const stringId = { params: { id: '123' } };
      const result = getEventSchema.parse(stringId);
      expect(result.params.id).toBe(123);
    });
  });
});

describe('User Validators', () => {
  describe('registerSchema', () => {
    it('should validate valid user registration', () => {
      const validUser = {
        body: {
          user_name: 'John Doe',
          user_email: 'john@example.com',
          password: 'SecurePass123!',
        },
      };

      const result = registerSchema.parse(validUser);
      expect(result.body.user_name).toBe('John Doe');
      expect(result.body.user_email).toBe('john@example.com');
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        body: {
          user_name: 'John Doe',
          user_email: 'invalid-email',
          password: 'SecurePass123!',
        },
      };

      expect(() => registerSchema.parse(invalidUser)).toThrow(z.ZodError);
    });

    it('should reject weak password (no uppercase)', () => {
      const weakUser = {
        body: {
          user_name: 'John Doe',
          user_email: 'john@example.com',
          password: 'weakpassword123',
        },
      };

      expect(() => registerSchema.parse(weakUser)).toThrow(z.ZodError);
    });

    it('should reject short password', () => {
      const shortUser = {
        body: {
          user_name: 'John Doe',
          user_email: 'john@example.com',
          password: 'Short1!',
        },
      };

      expect(() => registerSchema.parse(shortUser)).toThrow(z.ZodError);
    });

    it('should reject short username', () => {
      const shortUser = {
        body: {
          user_name: 'AB',
          user_email: 'john@example.com',
          password: 'SecurePass123!',
        },
      };

      expect(() => registerSchema.parse(shortUser)).toThrow(z.ZodError);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login', () => {
      const validLogin = {
        body: {
          user_email: 'john@example.com',
          password: 'SecurePass123!',
        },
      };

      const result = loginSchema.parse(validLogin);
      expect(result.body.user_email).toBe('john@example.com');
    });

    it('should reject missing email', () => {
      const invalidLogin = {
        body: {
          password: 'SecurePass123!',
        },
      };

      expect(() => loginSchema.parse(invalidLogin)).toThrow(z.ZodError);
    });

    it('should reject missing password', () => {
      const invalidLogin = {
        body: {
          user_email: 'john@example.com',
        },
      };

      expect(() => loginSchema.parse(invalidLogin)).toThrow(z.ZodError);
    });
  });
});

describe('Payment Validators', () => {
  describe('paymentSchema', () => {
    it('should validate valid payment', () => {
      const validPayment = {
        body: {
          event_id: 1,
          participant_name: 'John Doe',
          participant_number: '+1234567890',
          amount: 99.99,
          payment_method: 'Credit Card',
          transaction_id: 'TXN123456789',
        },
      };

      const result = paymentSchema.parse(validPayment);
      expect(result.body.amount).toBe(99.99);
      expect(result.body.payment_method).toBe('Credit Card');
    });

    it('should reject invalid payment method', () => {
      const invalidPayment = {
        body: {
          event_id: 1,
          participant_name: 'John Doe',
          participant_number: '+1234567890',
          amount: 99.99,
          payment_method: 'Invalid Method',
          transaction_id: 'TXN123456789',
        },
      };

      expect(() => paymentSchema.parse(invalidPayment)).toThrow(z.ZodError);
    });

    it('should reject zero or negative amount', () => {
      const invalidPayment = {
        body: {
          event_id: 1,
          participant_name: 'John Doe',
          participant_number: '+1234567890',
          amount: 0,
          payment_method: 'Credit Card',
          transaction_id: 'TXN123456789',
        },
      };

      expect(() => paymentSchema.parse(invalidPayment)).toThrow(z.ZodError);
    });

    it('should accept all valid payment methods', () => {
      const methods = ['Credit Card', 'PayPal', 'M-Pesa', 'Bank Transfer'];
      
      methods.forEach(method => {
        const payment = {
          body: {
            event_id: 1,
            participant_name: 'John Doe',
            participant_number: '+1234567890',
            amount: 99.99,
            payment_method: method,
            transaction_id: 'TXN123456789',
          },
        };
        
        expect(() => paymentSchema.parse(payment)).not.toThrow();
      });
    });
  });
});
