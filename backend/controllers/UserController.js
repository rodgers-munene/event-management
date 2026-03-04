const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema, updateUserSchema } = require("../validators/userValidator");

//register user logic
const registerUser = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse({ body: req.body });
    const { user_email, user_name, password } = validatedData.body;

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
      success: true,
      message: "User registered successfully",
      userId: results.insertId,
    });
  } catch (error) {
    next(error);
  }
};

// login user logic

const loginUser = async (req, res, next) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse({ body: req.body });
    const { user_email, password } = validatedData.body;

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
    
    const userDetails = {
      id: user.id,
      user_name: user.user_name,
      user_email: user.user_email,
      phone: user.phone,
      organization: user.organization,
      createdAt: user.date_created,
    };

    const token = jwt.sign({ userDetails }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    res.status(200).json({ 
      success: true,
      token, 
      userDetails 
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    // Validate request parameters and body
    const validatedData = updateUserSchema.parse({ params: req.params, body: req.body });
    const id = validatedData.params.id;
    const newUser = validatedData.body;

    // Authorization check
    if (String(req.user.id) !== String(id)) {
      res.status(401);
      throw new Error("Unauthorized User");
    }

    const updatableFields = ["user_name", "user_email", "phone", "organization"];
    const fields = [];
    const values = [];

    for (const key in newUser) {
      if (updatableFields.includes(key) && newUser[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(newUser[key]);
      }
    }

    if (fields.length === 0) {
      res.status(400);
      throw new Error("Fill at least one valid field to update!");
    }

    const [userAvailable] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (userAvailable.length === 0) {
      res.status(404);
      throw new Error("User not found");
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    const [result] = await db.query(query, values);

    const [updatedUser] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      affectedRows: result.affectedRows,
      data: updatedUser[0]
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { registerUser, loginUser, updateUser };
