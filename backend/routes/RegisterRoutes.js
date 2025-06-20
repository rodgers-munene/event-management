const { getAllEvents } = require('../controllers/EventController')
const { allRegistered, cancelRegistration, registerForEvent } = require('../controllers/RegistrationController')

const router = require('express').Router()


// GET all users registered for a specific event
router.get('/:eventId/registrations', allRegistered);

// GET all events a specific user has registered for
router.get('/users/:userId/registrations', getAllEvents);

// POST a new registration (user registers for an event)
router.post('/registrations', registerForEvent);

// DELETE (cancel) a registration by ID
router.delete('/registrations/:userId', cancelRegistration);


module.exports = router