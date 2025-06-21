const { allRegisteredUsers, cancelRegistration, registerForEvent, getUserRegisteredEvents } = require('../controllers/RegistrationController')
const router = require('express').Router()
const validateToken = require('../middleware/validateToken')


// GET all users registered for a specific event
router.get('/:eventId/registrations', validateToken, allRegisteredUsers);

// GET all events a specific user has registered for
router.get('/users/:userId/registrations', validateToken, getUserRegisteredEvents);

// POST a new registration (user registers for an event)
router.post('/registrations/:userId/:eventId', validateToken, registerForEvent);

// UPDATE (cancel) a registration by ID
router.put('/registrations/:userId/:eventId', validateToken, cancelRegistration);


module.exports = router