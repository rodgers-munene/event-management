const { allRegisteredUsers, cancelRegistration, registerForEvent, getUserRegisteredEvents } = require('../controllers/RegistrationController');
const validateToken = require('../middleware/validateToken');
const router = require('express').Router();

// GET all users registered for a specific event
// GET /api/event/:eventId/registrations
// Private route - only event organizer can view
router.get('/:eventId/registrations', validateToken, allRegisteredUsers);

// GET all events a specific user has registered for
// GET /api/event/users/:userId/registrations
// Private route
router.get('/users/:userId/registrations', validateToken, getUserRegisteredEvents);

// POST a new registration (user registers for an event)
// POST /api/event/registrations/:userId/:eventId
// Private route
router.post('/registrations/:userId/:eventId', validateToken, registerForEvent);

// UPDATE (cancel) a registration
// PUT /api/event/registrations/:userId/:eventId
// Private route
router.put('/registrations/:userId/:eventId', validateToken, cancelRegistration);

module.exports = router;
