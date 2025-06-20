const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register user logic
const registerUser = async (req, res) => {
  const { user_email, user_name, password } = req.body;

  if (!user_email || !user_name || !user_name || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }

  try {
    const [existingUser] = await db.query(
      "SELECT * from users where user_email = ?",
      [user_email]
    );

    if (existingUser.length > 0) {
      res.status(400);
      throw new Error("User already exists");
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [results] = await db.query(
      "INSERT INTO users (user_name, user_email, password) VALUES (?, ?, ?)",
      [user_name, user_email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
      userId: results.insertId,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Registration failed", error);
  }
};

// login user logic

const loginUser = async (req, res) => {
  const { user_email, password } = req.body;

  if (!user_email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  try {
    // check if user exist
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE user_email = ?",
      [user_email]
    );

    if (existingUser.length === 0) {
      res.status(400);
      throw new Error("Email Not Found! Try To Sign Up.");
    }

    const user = existingUser[0];

    //check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(400);
      throw new Error("User password invalid!");
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
          userName: user.user_name,
          userEmail: user.user_email,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    // console.error(error);
    res.status(500);
    throw new Error("Login failed", error);
  }
};

module.exports = { registerUser, loginUser };
