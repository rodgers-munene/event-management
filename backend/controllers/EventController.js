const db = require("../config/db");

// get all events
const getAllEvents = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM events");
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

// get specific event
const getEvent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [id]);

    if (rows.length === 0) {
      res.status(404);
      throw new Error("Event not found.");
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// get specific users events

const getMyEvents = async (req, res, next) => {
  const id = req.params.user_id
  try {
    // authorize user
    if(String(req.user.id) !== String(id)){
      res.status(401)
      throw new Error("Unauthorized User")
    }
    const [results] = await db.query('SELECT * FROM events where user_id = ?', [id])
    if(results.length === 0){
      return res.status(200).json({
        message: "User has not created any events"
      })
    }

    res.status(200).json(results)

  } catch (error) {
    next(error)
  }
}

const postEvent = async (req, res, next) => {
  const id = req.params.id
  const {
    user_id,
    event_title,
    event_description,
    event_start_date,
    event_end_date,
    event_location,
    event_price,
    image_url,
  } = req.body;

  try {
 // authorize user
    if(String(req.user.id) !== String(id)){
      res.status(401)
      throw new Error("Unauthorized User")
    }

    const [result] = await db.query(
      "INSERT INTO events (user_id, event_title, event_description, event_start_date, event_end_date, event_location, event_price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        event_title,
        event_description,
        event_start_date,
        event_end_date,
        event_location,
        event_price,
        image_url,
      ]
    );
    res.status(201).json({
      message: "Event created successfully!",
      eventId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const updatableFields = [
      "event_title",
      "event_description",
      "event_start_date",
      "event_end_date",
      "event_location",
      "event_price",
      "image_url",
    ];

    const fields = [];
    const values = [];

     // authorize user
    if(String(req.user.id) !== String(id)){
      res.status(401)
      throw new Error("Unauthorized User")
    }

    for (const key in update) {
      if (updatableFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(update[key]);
      } else {
        res.status(400);
        throw new Error(`Invalid field: ${key}`);
      }
    }

    if (fields.length === 0) {
      res.status(400);
      throw new Error("Fill at least one valid field to update!");
    }

    const [eventAvailable] = await db.query(
      "SELECT * FROM events WHERE id = ?",
      [id]
    );

    if (eventAvailable.length === 0) {
      res.status(404);
      throw new Error("Event not found");
    }

    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = ${id}`;

    const [result] = await db.query(query, values);

    res.status(200).json({
      message: "Event updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    next(error);
  }
};

// delete event

const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.id;

     // authorize user
    if(String(req.user.id) !== String(id)){
      res.status(401)
      throw new Error("Unauthorized User")
    }
    
    // availability of the event
    const [event] = await db.query(`SELECT * FROM events WHERE id = ${id}`);
    if (event.length === 0) {
      res.status(404);
      throw new Error("Event not Found!");
    }

    const [result] = await db.query(`DELETE FROM events WHERE id = ${id}`)

    res.status(200).json({
      message: "Event Deleted successfully",
      affectedRows: result.affectedRows
    })
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEvents,
  getEvent,
  postEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
};
