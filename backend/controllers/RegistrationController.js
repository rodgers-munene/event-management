const db = require("../config/db");
const emailService = require("../services/emailService");
const ticketService = require("../services/ticketService");
const waitlistService = require("../services/waitlistService");
const { logger } = require("../config/logger");

const getUserRegisteredEvents = async (req, res, next) => {
  const userId = req.params.userId;
  const { status } = req.query;
  
  try {
    // Authorize user
    if (String(req.user.id) !== String(userId)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

    const [userEvents] = await db.query(
      "SELECT * FROM registrations WHERE user_id = ?",
      [userId]
    );
    
    if (userEvents.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "You have not registered for any event",
        data: []
      });
    }

    // Join the registration table and events table
    let sql = `
        SELECT events.*, registrations.status
        FROM registrations
        JOIN events ON registrations.event_id = events.id
        WHERE registrations.user_id = ?`;

    const values = [userId];

    if (status) {
      sql += " AND registrations.status = ?";
      values.push(status);
    }

    const [registeredEvents] = await db.query(sql, values);

    res.status(200).json({
      success: true,
      data: registeredEvents
    });
  } catch (error) {
    next(error);
  }
};

// get all registered users for an event
const allRegisteredUsers = async (req, res, next) => {
  const eventId = req.params.eventId;
  const { status } = req.query;

  try {
    // First check if event exists
    const [eventAvailable] = await db.query(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );
    
    if (eventAvailable.length === 0) {
      res.status(404);
      throw new Error("Event not Found");
    }

    // Authorize user - only event organizer can view registrations
    if (String(req.user.id) !== String(eventAvailable[0].user_id)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

    // Query the registration database to get all users registered for the specific event
    let sql = `
      SELECT users.id, users.user_name, registrations.status
      FROM registrations
      JOIN users ON registrations.user_id = users.id
      WHERE registrations.event_id = ?
    `;
    const values = [eventId];

    // Filter by status if provided
    if (status) {
      sql += " AND registrations.status = ?";
      values.push(status);
    }
    // Return confirmed and pending registrations if status not provided
    else {
      sql += " AND (registrations.status = 'pending' OR registrations.status = 'confirmed')";
    }

    // Execute the query
    const [registeredUsers] = await db.query(sql, values);

    if (registeredUsers.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: "No users registered for the event.",
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: registeredUsers
    });
  } catch (error) {
    next(error);
  }
};

const registerForEvent = async (req, res, next) => {
  const userId = req.params.userId;
  const eventId = req.params.eventId;
  
  try {
    // Authorize user
    if (String(req.user.id) !== String(userId)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

    const [userRegistered] = await db.query(
      "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?",
      [userId, eventId]
    );
    
    if (userRegistered.length > 0) {
      return res.status(200).json({ 
        success: false,
        message: "You have already registered for this event" 
      });
    }

    // Check if event has capacity
    const [eventData] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);
    const event = eventData[0];

    if (event.capacity && event.capacity > 0) {
      // Check current confirmed registrations
      const [registrations] = await db.query(
        'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status IN ("confirmed", "pending")',
        [eventId]
      );

      if (registrations[0].count >= event.capacity) {
        // Event is full - add to waitlist
        const waitlistResult = await waitlistService.addToWaitlist(userId, eventId);
        
        if (waitlistResult.success) {
          return res.status(200).json({
            success: true,
            message: "Event is full. You have been added to the waitlist.",
            waitlist: true,
            position: waitlistResult.position,
          });
        }
      }
    }
    
    const [newEvent] = await db.query(
      "INSERT INTO registrations (user_id, event_id, status) VALUES (?, ?, ?)",
      [userId, eventId, "pending"]
    );

    // Get user and event details for email
    const [userDetails] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    const [eventDetails] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);

    if (userDetails.length > 0 && eventDetails.length > 0) {
      // Generate ticket
      const ticketResult = await ticketService.generateTicketQRCode(
        { id: newEvent.insertId },
        eventDetails[0],
        userDetails[0]
      );

      // Send confirmation email
      if (ticketResult.success) {
        await emailService.sendRegistrationConfirmation(
          userDetails[0],
          eventDetails[0],
          ticketResult.downloadUrl
        );
      }
    }

    res.status(200).json({ 
      success: true,
      message: "You have successfully registered for the event", 
      registrationId: newEvent.insertId,
      ticket: ticketResult ? ticketResult.downloadUrl : null,
    });
  } catch (error) {
    next(error);
  }
};

const cancelRegistration = async (req, res, next) => {
  const userId = req.params.userId;
  const eventId = req.params.eventId;

  try {
    // Authorize user
    if (String(req.user.id) !== String(userId)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

    const [registeredEvents] = await db.query(
      'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
    );
    
    if (registeredEvents.length === 0) {
      res.status(404);
      throw new Error("You haven't registered for this event");
    }

    const [updatedStatus] = await db.query(
      "UPDATE registrations SET status = 'cancelled' WHERE user_id = ? AND event_id = ?",
      [userId, eventId]
    );

    // If there's a waitlist, promote the next person
    const [eventData] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);
    if (eventData.length > 0 && eventData[0].capacity) {
      await waitlistService.autoPromoteNextUser(eventId);
    }

    res.status(200).json({
      success: true,
      message: "Registration Cancelled Successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserRegisteredEvents,
  allRegisteredUsers,
  registerForEvent,
  cancelRegistration,
};
