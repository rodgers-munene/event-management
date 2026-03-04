const analyticsService = require('../services/analyticsService');
const ticketService = require('../services/ticketService');
const waitlistService = require('../services/waitlistService');
const emailService = require('../services/emailService');
const db = require('../config/db');
const { logger } = require('../config/logger');

/**
 * Get event analytics
 * GET /api/analytics/events/:eventId
 */
const getEventAnalytics = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    
    const result = await analyticsService.getEventAnalytics(eventId);
    
    if (!result.success) {
      res.status(404);
      throw new Error(result.message);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get organizer analytics
 * GET /api/analytics/organizer/:organizerId
 */
const getOrganizerAnalytics = async (req, res, next) => {
  try {
    const { organizerId } = req.params;
    
    // Authorize user
    if (String(req.user.id) !== String(organizerId)) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const result = await analyticsService.getOrganizerAnalytics(organizerId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get platform analytics (admin only)
 * GET /api/analytics/platform
 */
const getPlatformAnalytics = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Forbidden - Admin access required');
    }

    const result = await analyticsService.getPlatformAnalytics();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Generate ticket for registration
 * GET /api/tickets/:registrationId
 */
const generateTicket = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    // Get registration details
    const [registrations] = await db.query(
      `SELECT r.*, e.event_title, e.event_start_date, e.event_location, e.event_price,
              u.user_name, u.user_email
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [registrationId]
    );

    if (registrations.length === 0) {
      res.status(404);
      throw new Error('Registration not found');
    }

    const registration = registrations[0];

    // Authorize user
    if (String(req.user.id) !== String(registration.user_id)) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    // Generate ticket
    const ticketResult = await ticketService.generateTicketQRCode(
      registration,
      registration,
      registration
    );

    if (!ticketResult.success) {
      res.status(500);
      throw new Error(ticketResult.error);
    }

    res.status(200).json({
      success: true,
      ticket: ticketResult.ticket,
      qrCode: ticketResult.qrCodeDataUrl,
      downloadUrl: ticketResult.downloadUrl,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download ticket as HTML
 * GET /api/tickets/download/:registrationId
 */
const downloadTicket = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    // Get registration and event details
    const [registrations] = await db.query(
      `SELECT r.*, e.event_title, e.event_start_date, e.event_end_date, e.event_location,
              u.user_name, u.user_email
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       JOIN users u ON r.user_id = u.id
       WHERE r.id = ?`,
      [registrationId]
    );

    if (registrations.length === 0) {
      res.status(404);
      throw new Error('Registration not found');
    }

    const registration = registrations[0];

    // Generate ticket QR code
    const ticketResult = await ticketService.generateTicketQRCode(
      registration,
      registration,
      registration
    );

    if (!ticketResult.success) {
      res.status(500);
      throw new Error(ticketResult.error);
    }

    // Generate HTML
    const ticketHtml = ticketService.generateTicketHTML(
      ticketResult.ticket,
      registration,
      ticketResult.qrCodeDataUrl
    );

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="ticket-${registrationId}.html"`);
    res.send(ticketHtml);
  } catch (error) {
    next(error);
  }
};

/**
 * Add to waitlist
 * POST /api/waitlist/:eventId
 */
const addToWaitlist = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const result = await waitlistService.addToWaitlist(userId, eventId);

    if (!result.success) {
      res.status(400);
      throw new Error(result.message);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get waitlist for event
 * GET /api/waitlist/:eventId
 */
const getWaitlist = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Verify user is event organizer
    const [events] = await db.query('SELECT user_id FROM events WHERE id = ?', [eventId]);
    
    if (events.length === 0) {
      res.status(404);
      throw new Error('Event not found');
    }

    if (String(req.user.id) !== String(events[0].user_id)) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    const waitlist = await waitlistService.getWaitlist(eventId);
    const stats = await waitlistService.getWaitlistStats(eventId);

    res.status(200).json({
      success: true,
      waitlist,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Promote user from waitlist
 * POST /api/waitlist/promote/:registrationId
 */
const promoteFromWaitlist = async (req, res, next) => {
  try {
    const { registrationId } = req.params;

    const result = await waitlistService.promoteFromWaitlist(registrationId);

    if (!result.success) {
      res.status(400);
      throw new Error(result.message);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Send event reminder emails
 * POST /api/events/:eventId/remind
 */
const sendEventReminders = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Verify user is event organizer
    const [events] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    
    if (events.length === 0) {
      res.status(404);
      throw new Error('Event not found');
    }

    if (String(req.user.id) !== String(events[0].user_id)) {
      res.status(401);
      throw new Error('Unauthorized');
    }

    // Get all confirmed registrations
    const [registrations] = await db.query(
      `SELECT r.*, u.user_name, u.user_email
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ? AND r.status = 'confirmed'`,
      [eventId]
    );

    let sentCount = 0;
    let failedCount = 0;

    for (const registration of registrations) {
      const result = await emailService.sendEventReminder(
        { user_name: registration.user_name, user_email: registration.user_email },
        events[0]
      );

      if (result.success) {
        sentCount++;
      } else {
        failedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Reminders sent',
      sent: sentCount,
      failed: failedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEventAnalytics,
  getOrganizerAnalytics,
  getPlatformAnalytics,
  generateTicket,
  downloadTicket,
  addToWaitlist,
  getWaitlist,
  promoteFromWaitlist,
  sendEventReminders,
};
