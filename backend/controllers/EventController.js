const db = require("../config/db");

// get all events
const getAllEvents = async (req, res, next) => {
  const { limit, page,  } = req.query
  const dataLimit = limit? parseInt(limit) : 5
  const pageLimit = page? parseInt(page): 1
  const offset = (pageLimit - 1) * dataLimit
  
  try {

    const baseQuery = `SELECT * FROM events LIMIT ${dataLimit} OFFSET ${offset}`;


    const [rows] = await db.query(baseQuery);

    const [countRows] = await db.query("SELECT COUNT(*) as total FROM events")
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
          total: countRows[0].total,
          page: pageLimit,
          limit: dataLimit,
          totalPages: Math.ceil(countRows[0].total / dataLimit)
      }
    });
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
    if(String(req.user.id) !== String(user_id)){
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
    const eventId = req.params.id;
    const update = { ...req.body };
    delete update.user_id

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
      [eventId]
    );

    if (eventAvailable.length === 0) {
      res.status(404);
      throw new Error("Event not found");
    }

     // authorize user
    if(String(req.user.id) !== String(eventAvailable[0].user_id)){
      res.status(401)
      throw new Error("Unauthorized User")
    }

    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = ${eventId}`;

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
    
    // availability of the event
    const [event] = await db.query(`SELECT * FROM events WHERE id = ${id}`);
    if (event.length === 0) {
      res.status(404);
      throw new Error("Event not Found!");
    }
    if(String(req.user.id) !== String(event[0].user_id)){
      res.status(401)
      throw new Error("Unauthorized User")
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
