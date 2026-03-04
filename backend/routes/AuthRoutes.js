const { registerUser, loginUser, updateUser } = require('../controllers/UserController');
const validateToken = require('../middleware/validateToken');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema, updateUserSchema } = require('../validators/userValidator');
const router = require('express').Router();

// REGISTER a user
// POST /api/auth/register
// Public route with rate limiting
router.post('/register', authLimiter, validate(registerSchema), registerUser);

// LOGIN a user
// POST /api/auth/login
// Public route with strict rate limiting
router.post('/login', authLimiter, validate(loginSchema), loginUser);

// UPDATE a user
// PUT /api/auth/update/:id
// Private route
router.put('/update/:id', validateToken, validate(updateUserSchema), updateUser);

module.exports = router;
