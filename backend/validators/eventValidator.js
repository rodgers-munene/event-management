const { z } = require('zod');

// Schema for creating an event
const createEventSchema = z.object({
  body: z.object({
    user_id: z.union([z.string(), z.number()]).transform(val => Number(val)).refine(val => !isNaN(val), "user_id must be a valid number"),
    event_title: z.string().min(3, 'Event title must be at least 3 characters').max(200),
    event_description: z.string().max(5000).optional(),
    event_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Invalid start date format. Use YYYY-MM-DDTHH:MM:SS'),
    event_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Invalid end date format. Use YYYY-MM-DDTHH:MM:SS'),
    event_location: z.string().min(3, 'Location must be at least 3 characters').max(255),
    event_price: z.preprocess(
      (val) => Number(val),
      z.number().gte(0, 'Price cannot be negative')
    ),
    image_url: z.string().url('Invalid URL format').optional().or(z.literal('')).optional()
  })
}).refine((data) => {
  // data is the full parsed object, access body from it
  if (!data.body) return true;
  const startDate = new Date(data.body.event_start_date);
  const endDate = new Date(data.body.event_end_date);
  return endDate > startDate;
}, {
  message: 'End date must be after start date',
  path: ['body', 'event_end_date']
});

// Schema for updating an event
const updateEventSchema = z.object({
  params: z.object({
    id: z.coerce.number().refine(val => !isNaN(val), "ID must be a valid number")
  }),
  body: z.object({
    event_title: z.string().min(3).max(200).optional(),
    event_description: z.string().max(5000).optional(),
    event_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Invalid start date format. Use YYYY-MM-DDTHH:MM:SS').optional(),
    event_end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, 'Invalid end date format. Use YYYY-MM-DDTHH:MM:SS').optional(),
    event_location: z.string().min(3).max(255).optional(),
    event_price: z.preprocess(
      (val) => Number(val),
      z.number().gte(0)
    ).optional(),
    image_url: z.string().url().optional().or(z.literal('')).optional()
  }).refine((data) => {
    if (data.event_start_date && data.event_end_date) {
      return new Date(data.event_end_date) > new Date(data.event_start_date);
    }
    return true;
  }, {
    message: 'End date must be after start date',
    path: ['body', 'event_end_date']
  })
});

// Schema for getting an event
const getEventSchema = z.object({
  params: z.object({
    id: z.coerce.number().refine(val => !isNaN(val), "ID must be a valid number")
  })
});

// Schema for pagination query params
const paginationSchema = z.object({
  query: z.object({
    limit: z.preprocess(
      (val) => Number(val),
      z.number().gte(1).lte(100).refine(val => !isNaN(val), "limit must be a valid number")
    ).optional(),
    page: z.preprocess(
      (val) => Number(val),
      z.number().gte(1).refine(val => !isNaN(val), "page must be a valid number")
    ).optional()
  })
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  getEventSchema,
  paginationSchema
};
