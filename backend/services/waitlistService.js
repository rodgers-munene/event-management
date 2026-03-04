const db = require('../config/db');
const emailService = require('./emailService');
const { logger } = require('../config/logger');

class WaitlistService {
  /**
   * Add user to waitlist for a sold-out event
   */
  async addToWaitlist(userId, eventId) {
    try {
      // Check if event exists and is sold out
      const [events] = await db.query(
        'SELECT * FROM events WHERE id = ?',
        [eventId]
      );

      if (events.length === 0) {
        return { success: false, message: 'Event not found' };
      }

      const event = events[0];

      // Check if event has capacity
      if (!event.capacity || event.capacity <= 0) {
        return { 
          success: false, 
          message: 'Event does not have capacity limit' 
        };
      }

      // Check current registrations
      const [registrations] = await db.query(
        'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status IN ("confirmed", "pending")',
        [eventId]
      );

      const currentCount = registrations[0].count;

      if (currentCount < event.capacity) {
        return { 
          success: false, 
          message: 'Event still has available spots. Please register directly.' 
        };
      }

      // Check if user already registered or on waitlist
      const [existing] = await db.query(
        'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
        [userId, eventId]
      );

      if (existing.length > 0) {
        return { 
          success: false, 
          message: 'User already registered or on waitlist for this event' 
        };
      }

      // Add to waitlist (using 'waitlist' status)
      const [result] = await db.query(
        'INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, "waitlist")',
        [userId, eventId]
      );

      logger.info('User added to waitlist', { userId, eventId, registrationId: result.insertId });

      return {
        success: true,
        message: 'Added to waitlist successfully',
        registrationId: result.insertId,
        position: await this.getWaitlistPosition(eventId, userId),
      };
    } catch (error) {
      logger.error('Failed to add to waitlist', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's position on waitlist
   */
  async getWaitlistPosition(eventId, userId) {
    try {
      const [registrations] = await db.query(
        `SELECT id, user_id, registration_date
         FROM registrations
         WHERE event_id = ? AND status = 'waitlist'
         ORDER BY registration_date ASC`,
        [eventId]
      );

      const position = registrations.findIndex(r => r.user_id === userId) + 1;
      return position > 0 ? position : null;
    } catch (error) {
      logger.error('Failed to get waitlist position', { error: error.message });
      return null;
    }
  }

  /**
   * Get all users on waitlist for an event
   */
  async getWaitlist(eventId) {
    try {
      const [registrations] = await db.query(
        `SELECT r.id, r.user_id, r.registration_date, u.user_name, u.user_email
         FROM registrations r
         JOIN users u ON r.user_id = u.id
         WHERE r.event_id = ? AND r.status = 'waitlist'
         ORDER BY r.registration_date ASC`,
        [eventId]
      );

      return registrations;
    } catch (error) {
      logger.error('Failed to get waitlist', { error: error.message });
      return [];
    }
  }

  /**
   * Promote user from waitlist to confirmed
   */
  async promoteFromWaitlist(registrationId) {
    try {
      // Get registration details
      const [registrations] = await db.query(
        `SELECT r.*, e.event_title, e.event_start_date, u.user_name, u.user_email
         FROM registrations r
         JOIN events e ON r.event_id = e.id
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [registrationId]
      );

      if (registrations.length === 0) {
        return { success: false, message: 'Registration not found' };
      }

      const registration = registrations[0];

      if (registration.status !== 'waitlist') {
        return { success: false, message: 'Registration is not on waitlist' };
      }

      // Update status to confirmed
      await db.query(
        'UPDATE registrations SET status = "confirmed" WHERE id = ?',
        [registrationId]
      );

      // Send promotion email
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 2); // 2 days to confirm

      await emailService.sendWaitlistPromotion(
        { user_name: registration.user_name, user_email: registration.user_email },
        { event_title: registration.event_title, event_start_date: registration.event_start_date },
        deadline.toISOString()
      );

      logger.info('User promoted from waitlist', { registrationId });

      return {
        success: true,
        message: 'Promoted from waitlist successfully',
      };
    } catch (error) {
      logger.error('Failed to promote from waitlist', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Auto-promote next user when spot opens
   */
  async autoPromoteNextUser(eventId) {
    try {
      // Get next user on waitlist
      const [nextOnWaitlist] = await db.query(
        `SELECT id, user_id, event_id
         FROM registrations
         WHERE event_id = ? AND status = 'waitlist'
         ORDER BY registration_date ASC
         LIMIT 1`,
        [eventId]
      );

      if (nextOnWaitlist.length > 0) {
        await this.promoteFromWaitlist(nextOnWaitlist[0].id);
        logger.info('Auto-promoted next user from waitlist', { eventId });
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Failed to auto-promote user', { error: error.message });
      return false;
    }
  }

  /**
   * Remove user from waitlist
   */
  async removeFromWaitlist(registrationId) {
    try {
      await db.query(
        'DELETE FROM registrations WHERE id = ? AND status = "waitlist"',
        [registrationId]
      );

      logger.info('User removed from waitlist', { registrationId });

      return { success: true, message: 'Removed from waitlist' };
    } catch (error) {
      logger.error('Failed to remove from waitlist', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get waitlist statistics for an event
   */
  async getWaitlistStats(eventId) {
    try {
      const [stats] = await db.query(
        `SELECT
          COUNT(*) as total_on_waitlist,
          MIN(registration_date) as oldest_request,
          MAX(registration_date) as newest_request
         FROM registrations
         WHERE event_id = ? AND status = 'waitlist'`,
        [eventId]
      );

      return stats[0];
    } catch (error) {
      logger.error('Failed to get waitlist stats', { error: error.message });
      return null;
    }
  }
}

// Singleton instance
const waitlistService = new WaitlistService();

module.exports = waitlistService;
