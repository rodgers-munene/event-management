const { getAllEvents, getEvent, postEvent, updateEvent, deleteEvent, getMyEvents } = require('../controllers/EventController')
const validateToken = require('../middleware/validateToken')
const router = require('express').Router()

// get all events
//  GET /api/events
// public route
router.get('/', getAllEvents)

// get a users specific events
// GET /api/events
// private route
router.get('/:user_id/me', validateToken, getMyEvents)

// get specific event
// GET /api/events/id
// public route
router.get('/:id', getEvent)

// create a new event
// POST /api/events
// private route
router.post('/:id', validateToken, postEvent)

// update event
// PUT /api/events/id
// private route
router.put('/:id', validateToken, updateEvent)

// delete event
// DELETE /api/events/id
// private route
router.delete('/:id', validateToken, deleteEvent)


module.exports = router