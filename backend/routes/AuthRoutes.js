const { registerUser, loginUser, updateUser } = require('../controllers/UserController')
const validateToken = require('../middleware/validateToken')

const router = require('express').Router()

// register a user
// POST /api/auth/register
// public route

router.post('/register', registerUser)

// login the user
// POST /api/auth/login
// public route

router.post('/login', loginUser)

// update the user
// PUT /api/auth/update/:id
// private route
router.put('/update/:id', validateToken, updateUser)

module.exports = router