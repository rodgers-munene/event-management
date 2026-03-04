const db = require("../config/db");
const cacheService = require("../config/cache");
const { createEventSchema, updateEventSchema, getEventSchema, paginationSchema } = require("../validators/eventValidator");
const { logger } = require("../config/logger");

// get all events
const getAllEvents = async (req, res, next) => {
  try {
    // Validate pagination parameters
    const validatedData = paginationSchema.parse({ query: req.query });
    
    const dataLimit = validatedData.query.limit ?? 5;
    const pageLimit = validatedData.query.page ?? 1;
    const offset = (pageLimit - 1) * dataLimit;

    // Create cache key based on pagination
    const cacheKey = `events:all:limit:${dataLimit}:page:${pageLimit}`;

    // Try to get from cache first
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      logger.debug('Cache hit for events list', { cacheKey });
      return res.status(200).json(cachedData);
    }

    // Use parameterized queries to prevent SQL injection
    const [rows] = await db.query(
      "SELECT * FROM events LIMIT ? OFFSET ?",
      [dataLimit, offset]
    );

    const [countRows] = await db.query("SELECT COUNT(*) as total FROM events");
    
    const responseData = {
      success: true,
      data: rows,
      pagination: {
        total: countRows[0].total,
        page: pageLimit,
        limit: dataLimit,
        totalPages: Math.ceil(countRows[0].total / dataLimit)
      }
    };

    // Cache the response for 5 minutes
    await cacheService.set(cacheKey, responseData, 300);

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

// get specific event
const getEvent = async (req, res, next) => {
  try {
    const validatedData = getEventSchema.parse({ params: req.params });
    const eventId = validatedData.params.id;

    const [rows] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);

    if (rows.length === 0) {
      res.status(404);
      throw new Error("Event not found.");
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
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
      return res.status(200).json([])
    }

    res.status(200).json(results)

  } catch (error) {
    next(error)
  }
}

const postEvent = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = createEventSchema.parse({ body: req.body });
    
    const {
      user_id,
      event_title,
      event_description,
      event_start_date,
      event_end_date,
      event_location,
      event_price,
      image_url,
    } = validatedData.body;

    // Authorize user
    if (String(req.user.id) !== String(user_id)) {
      res.status(401);
      throw new Error("Unauthorized User");
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
        image_url || null,
      ]
    );
    
    // Invalidate events cache
    await cacheService.invalidatePattern('events:all:*');
    logger.info('Event created and cache invalidated', { eventId: result.insertId });
    
    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      eventId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const validatedData = updateEventSchema.parse({ params: req.params, body: req.body });
    const eventId = validatedData.params.id;
    const update = validatedData.body;

    // Check if event exists
    const [eventAvailable] = await db.query(
      "SELECT * FROM events WHERE id = ?",
      [eventId]
    );

    if (eventAvailable.length === 0) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Authorize user
    if (String(req.user.id) !== String(eventAvailable[0].user_id)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

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
      if (updatableFields.includes(key) && update[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(update[key]);
      }
    }

    if (fields.length === 0) {
      res.status(400);
      throw new Error("Fill at least one valid field to update!");
    }

    // Add event ID to values for WHERE clause
    values.push(eventId);

    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = ?`;

    const [result] = await db.query(query, values);

    // Invalidate event cache
    await cacheService.del(`events:id:${eventId}`);
    await cacheService.invalidatePattern('events:all:*');
    logger.info('Event updated and cache invalidated', { eventId });

    res.status(200).json({
      success: true,
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
    // Validate event ID parameter
    const validatedData = getEventSchema.parse({ params: req.params });
    const eventId = validatedData.params.id;

    // Check availability of the event
    const [event] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);
    
    if (event.length === 0) {
      res.status(404);
      throw new Error("Event not Found!");
    }
    
    // Authorize user
    if (String(req.user.id) !== String(event[0].user_id)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

    const [result] = await db.query("DELETE FROM events WHERE id = ?", [eventId]);

    // Invalidate event cache
    await cacheService.del(`events:id:${eventId}`);
    await cacheService.invalidatePattern('events:all:*');
    logger.info('Event deleted and cache invalidated', { eventId });

    res.status(200).json({
      success: true,
      message: "Event Deleted successfully",
      affectedRows: result.affectedRows
    });
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
