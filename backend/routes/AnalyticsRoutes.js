const {
  getEventAnalytics,
  getOrganizerAnalytics,
  getPlatformAnalytics,
  generateTicket,
  downloadTicket,
  addToWaitlist,
  getWaitlist,
  promoteFromWaitlist,
  sendEventReminders,
} = require('../controllers/AnalyticsController');
const validateToken = require('../middleware/validateToken');
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Event analytics and reporting endpoints
 */

/**
 * @swagger
 * /api/analytics/events/{eventId}:
 *   get:
 *     summary: Get analytics for a specific event
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event analytics data
 *       404:
 *         description: Event not found
 */
router.get('/analytics/events/:eventId', validateToken, getEventAnalytics);

/**
 * @swagger
 * /api/analytics/organizer/{organizerId}:
 *   get:
 *     summary: Get analytics for an organizer
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organizer user ID
 *     responses:
 *       200:
 *         description: Organizer analytics data
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics/organizer/:organizerId', validateToken, getOrganizerAnalytics);

/**
 * @swagger
 * /api/analytics/platform:
 *   get:
 *     summary: Get platform-wide analytics (admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics data
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/analytics/platform', validateToken, getPlatformAnalytics);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket generation and management
 */

/**
 * @swagger
 * /api/tickets/{registrationId}:
 *   get:
 *     summary: Generate ticket with QR code for a registration
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Ticket with QR code generated
 *       404:
 *         description: Registration not found
 */
router.get('/tickets/:registrationId', validateToken, generateTicket);

/**
 * @swagger
 * /api/tickets/download/{registrationId}:
 *   get:
 *     summary: Download ticket as HTML
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: HTML ticket file
 *       404:
 *         description: Registration not found
 */
router.get('/tickets/download/:registrationId', validateToken, downloadTicket);

/**
 * @swagger
 * tags:
 *   name: Waitlist
 *   description: Waitlist management for sold-out events
 */

/**
 * @swagger
 * /api/waitlist/{eventId}:
 *   post:
 *     summary: Add current user to waitlist for an event
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Added to waitlist successfully
 *       400:
 *         description: Cannot add to waitlist
 */
router.post('/waitlist/:eventId', validateToken, addToWaitlist);

/**
 * @swagger
 * /api/waitlist/{eventId}:
 *   get:
 *     summary: Get waitlist for an event (organizer only)
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Waitlist data
 *       401:
 *         description: Unauthorized
 */
router.get('/waitlist/:eventId', validateToken, getWaitlist);

/**
 * @swagger
 * /api/waitlist/promote/{registrationId}:
 *   post:
 *     summary: Promote user from waitlist to confirmed
 *     tags: [Waitlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: registrationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Promoted successfully
 *       400:
 *         description: Cannot promote
 */
router.post('/waitlist/promote/:registrationId', validateToken, promoteFromWaitlist);

/**
 * @swagger
 * /api/events/{eventId}/remind:
 *   post:
 *     summary: Send reminder emails to all registered attendees
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Reminders sent successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/events/:eventId/remind', validateToken, sendEventReminders);

module.exports = router;
