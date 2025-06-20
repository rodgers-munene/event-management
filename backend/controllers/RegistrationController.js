const db = require("../config/db");

const getUserRegisteredEvents = async (req, res, next) => {
    const userId = req.params.user_id
    const { status } = req.query
    try {
        const [userEvents] = await db.query('SELECT * FROM registrations WHERE user_id = ? ', [userId])
        if(userEvents.length === 0){
            return res.status(200).json({message: "You have not registered for any event"})
        }

        // if registered join the registration table and events table
        let sql = `
        SELECT events.*, registrations.status
        FROM registrations
        JOIN events ON registrations.event_id = events.id
        WHERE registrations.user_id = ?`

        const values = [userId]

        if(status){
            sql += ' AND registrations.status = ?'
            values.push(status)
        }

        const [registeredEvents] = await db.query(sql, values)

        res.status(200).json(registeredEvents)

    } catch (error) {
        next(error)
    }
};

// get all registered users for an event
const allRegisteredUsers = async (req, res, next) => {
  const eventId = req.params.eventId;
  const { status } = req.query

  try {
    // first check if event exist
    const [eventAvailable] = await db.query(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );
    if (eventAvailable.length === 0) {
      res.status(404);
      throw new Error("Event not Found");
    }

    // query the registration data db to check all users registered for the specific event
    // use join to combine the registration table and users table

    let sql = `
      SELECT users.id, users.user_name, registrations.status
      FROM registrations
      JOIN users ON registrations.user_id = users.id
      WHERE registrations.event_id = ?
    `;
    const values = [eventId]

    // filter by status it's provided
    if(status){
        sql += ' AND registrations.status = ?'
        values.push(status)
    }

    // execute the query
    const [registeredUsers] = await db.query(sql, values);
    
    if(registeredUsers.length === 0){
        return res.status(200).json({message: "No users registered for the event."})
    }
    res.status(200).json(registeredUsers);
  } catch (error) {
    next(error);
  }
};

const registerForEvent = async (req, res, next) => {};

const cancelRegistration = async (req, res, next) => {};

module.exports = {
  getUserRegisteredEvents,
  allRegisteredUsers,
  registerForEvent,
  cancelRegistration,
};
