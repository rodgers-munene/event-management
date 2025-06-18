const { registerUser, loginUser } = require('../controllers/UserController')

const router = require('express').Router()

// register a user
// POST /api/auth/register
// public route

router.post('/register', registerUser)

// login the user
// POST /api/auth/login
// public route

router.post('/login', loginUser)

module.exports = router