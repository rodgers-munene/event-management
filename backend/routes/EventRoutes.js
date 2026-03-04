const { getAllEvents, getEvent, postEvent, updateEvent, deleteEvent, getMyEvents } = require('../controllers/EventController');
const validateToken = require('../middleware/validateToken');
const validate = require('../middleware/validate');
const { eventLimiter } = require('../middleware/rateLimiter');
const { createEventSchema, updateEventSchema, getEventSchema, paginationSchema } = require('../validators/eventValidator');
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management endpoints
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events with pagination
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 100
 *         description: Number of events per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Bad request (invalid pagination parameters)
 */
router.get('/', validate(paginationSchema), getAllEvents);

/**
 * @swagger
 * /api/events/{user_id}/me:
 *   get:
 *     summary: Get events created by the authenticated user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's events
 *       401:
 *         description: Unauthorized
 */
router.get('/:user_id/me', validateToken, getMyEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get('/:id', validate(getEventSchema), getEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - event_title
 *               - event_start_date
 *               - event_end_date
 *               - event_location
 *             properties:
 *               user_id:
 *                 type: integer
 *               event_title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               event_description:
 *                 type: string
 *                 maxLength: 5000
 *               event_start_date:
 *                 type: string
 *                 format: date-time
 *               event_end_date:
 *                 type: string
 *                 format: date-time
 *               event_location:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               event_price:
 *                 type: number
 *                 minimum: 0
 *               image_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', validateToken, eventLimiter, validate(createEventSchema), postEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               event_description:
 *                 type: string
 *                 maxLength: 5000
 *               event_start_date:
 *                 type: string
 *                 format: date-time
 *               event_end_date:
 *                 type: string
 *                 format: date-time
 *               event_location:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               event_price:
 *                 type: number
 *                 minimum: 0
 *               image_url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.put('/:id', validateToken, validate(updateEventSchema), updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.delete('/:id', validateToken, validate(getEventSchema), deleteEvent);

module.exports = router;
