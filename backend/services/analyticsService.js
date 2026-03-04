const db = require('../config/db');
const { logger } = require('../config/logger');

class AnalyticsService {
  /**
   * Get comprehensive event analytics
   */
  async getEventAnalytics(eventId) {
    try {
      // Get event details
      const [events] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
      
      if (events.length === 0) {
        return { success: false, message: 'Event not found' };
      }

      const event = events[0];

      // Get registration statistics
      const [registrationStats] = await db.query(
        `SELECT 
          COUNT(*) as total_registrations,
          SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
          SUM(CASE WHEN status = 'waitlist' THEN 1 ELSE 0 END) as waitlist
         FROM registrations
         WHERE event_id = ?`,
        [eventId]
      );

      // Get payment statistics
      const [paymentStats] = await db.query(
        `SELECT 
          COUNT(*) as total_payments,
          SUM(amount) as total_revenue,
          AVG(amount) as avg_payment,
          payment_method,
          COUNT(*) as method_count
         FROM payments
         WHERE event_id = ?
         GROUP BY payment_method`,
        [eventId]
      );

      // Get total revenue
      const [revenue] = await db.query(
        'SELECT SUM(amount) as total_revenue FROM payments WHERE event_id = ?',
        [eventId]
      );

      // Get registration trend (last 7 days)
      const [trend] = await db.query(
        `SELECT
          DATE(registration_date) as date,
          COUNT(*) as registrations
         FROM registrations
         WHERE event_id = ? AND registration_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
         GROUP BY DATE(registration_date)
         ORDER BY date ASC`,
        [eventId]
      );

      // Calculate capacity percentage
      const capacityPercent = event.capacity 
        ? ((registrationStats[0].confirmed / event.capacity) * 100).toFixed(2)
        : null;

      return {
        success: true,
        data: {
          event: {
            id: event.id,
            title: event.event_title,
            start_date: event.event_start_date,
            location: event.event_location,
            capacity: event.capacity,
            price: event.event_price,
          },
          registrations: {
            total: registrationStats[0].total_registrations,
            confirmed: registrationStats[0].confirmed,
            pending: registrationStats[0].pending,
            cancelled: registrationStats[0].cancelled,
            waitlist: registrationStats[0].waitlist,
            capacity_percent: capacityPercent,
            available_spots: event.capacity ? event.capacity - registrationStats[0].confirmed : null,
          },
          revenue: {
            total: revenue[0].total_revenue || 0,
            by_payment_method: paymentStats,
          },
          trend: trend,
        },
      };
    } catch (error) {
      logger.error('Failed to get event analytics', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get organizer's overall analytics
   */
  async getOrganizerAnalytics(organizerId) {
    try {
      // Get total events
      const [events] = await db.query(
        'SELECT COUNT(*) as total_events FROM events WHERE user_id = ?',
        [organizerId]
      );

      // Get total revenue across all events
      const [revenue] = await db.query(
        `SELECT SUM(p.amount) as total_revenue
         FROM payments p
         JOIN events e ON p.event_id = e.id
         WHERE e.user_id = ?`,
        [organizerId]
      );

      // Get total registrations across all events
      const [registrations] = await db.query(
        `SELECT COUNT(*) as total_registrations
         FROM registrations r
         JOIN events e ON r.event_id = e.id
         WHERE e.user_id = ?`,
        [organizerId]
      );

      // Get upcoming events
      const [upcoming] = await db.query(
        `SELECT COUNT(*) as upcoming_events
         FROM events
         WHERE user_id = ? AND event_start_date > NOW()`,
        [organizerId]
      );

      // Get past events
      const [past] = await db.query(
        `SELECT COUNT(*) as past_events
         FROM events
         WHERE user_id = ? AND event_start_date <= NOW()`,
        [organizerId]
      );

      // Get average attendance rate
      const [attendanceRate] = await db.query(
        `SELECT 
          AVG(confirmed_count) as avg_attendance,
          AVG(capacity) as avg_capacity
         FROM (
           SELECT 
             e.id,
             e.capacity,
             COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as confirmed_count
           FROM events e
           LEFT JOIN registrations r ON e.id = r.event_id
           WHERE e.user_id = ?
           GROUP BY e.id
         ) as event_stats`,
        [organizerId]
      );

      // Get top performing events
      const [topEvents] = await db.query(
        `SELECT 
          e.id,
          e.event_title,
          e.event_start_date,
          COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as attendance,
          COALESCE(SUM(p.amount), 0) as revenue
         FROM events e
         LEFT JOIN registrations r ON e.id = r.event_id AND r.status = 'confirmed'
         LEFT JOIN payments p ON e.id = p.event_id
         WHERE e.user_id = ?
         GROUP BY e.id
         ORDER BY revenue DESC
         LIMIT 5`,
        [organizerId]
      );

      return {
        success: true,
        data: {
          overview: {
            total_events: events[0].total_events,
            upcoming_events: upcoming[0].upcoming_events,
            past_events: past[0].past_events,
            total_registrations: registrations[0].total_registrations,
            total_revenue: revenue[0].total_revenue || 0,
          },
          attendance: {
            average_attendance: attendanceRate[0].avg_attendance || 0,
            average_capacity: attendanceRate[0].avg_capacity || 0,
            attendance_rate: attendanceRate[0].avg_capacity 
              ? ((attendanceRate[0].avg_attendance / attendanceRate[0].avg_capacity) * 100).toFixed(2)
              : null,
          },
          top_events: topEvents,
        },
      };
    } catch (error) {
      logger.error('Failed to get organizer analytics', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get platform-wide analytics (admin only)
   */
  async getPlatformAnalytics() {
    try {
      // Total users
      const [users] = await db.query('SELECT COUNT(*) as total_users FROM users');

      // Total events
      const [events] = await db.query('SELECT COUNT(*) as total_events FROM events');

      // Total revenue (all time)
      const [revenue] = await db.query('SELECT SUM(amount) as total_revenue FROM payments');

      // Events by status
      const [eventsByStatus] = await db.query(
        'SELECT status, COUNT(*) as count FROM events GROUP BY status'
      );

      // Revenue trend (last 30 days)
      const [revenueTrend] = await db.query(
        `SELECT 
          DATE(payment_date) as date,
          SUM(amount) as revenue,
          COUNT(*) as transactions
         FROM payments
         WHERE payment_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY DATE(payment_date)
         ORDER BY date ASC`
      );

      // Most popular locations
      const [popularLocations] = await db.query(
        `SELECT event_location, COUNT(*) as event_count
         FROM events
         GROUP BY event_location
         ORDER BY event_count DESC
         LIMIT 10`
      );

      // Payment method distribution
      const [paymentMethods] = await db.query(
        `SELECT payment_method, COUNT(*) as count, SUM(amount) as total
         FROM payments
         GROUP BY payment_method`
      );

      return {
        success: true,
        data: {
          users: users[0].total_users,
          events: events[0].total_events,
          revenue: revenue[0].total_revenue || 0,
          events_by_status: eventsByStatus,
          revenue_trend: revenueTrend,
          popular_locations: popularLocations,
          payment_methods: paymentMethods,
        },
      };
    } catch (error) {
      logger.error('Failed to get platform analytics', { error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Get registration demographics for an event
   */
  async getEventDemographics(eventId) {
    try {
      const [demographics] = await db.query(
        `SELECT 
          COUNT(DISTINCT r.user_id) as unique_attendees,
          COUNT(DISTINCT u.organization) as organizations_represented
         FROM registrations r
         JOIN users u ON r.user_id = u.id
         WHERE r.event_id = ? AND r.status = 'confirmed'`,
        [eventId]
      );

      return {
        success: true,
        data: demographics[0],
      };
    } catch (error) {
      logger.error('Failed to get event demographics', { error: error.message });
      return { success: false, error: error.message };
    }
  }
}

// Singleton instance
const analyticsService = new AnalyticsService();

module.exports = analyticsService;
