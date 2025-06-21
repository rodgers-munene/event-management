const { allRegisteredUsers, cancelRegistration, registerForEvent, getUserRegisteredEvents } = require('../controllers/RegistrationController')
const router = require('express').Router()


// GET all users registered for a specific event
router.get('/:eventId/registrations', allRegisteredUsers);

// GET all events a specific user has registered for
router.get('/users/:userId/registrations', getUserRegisteredEvents);

// POST a new registration (user registers for an event)
router.post('/registrations/:userId/:eventId', registerForEvent);

// UPDATE (cancel) a registration by ID
router.put('/registrations/:userId/:eventId', cancelRegistration);


module.exports = router