const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  try {
    let token;
    const bearerHeader = req.headers.Authorization || req.headers.authorization;

    if (bearerHeader && bearerHeader.startsWith("Bearer")) {
      token = bearerHeader.split(" ")[1];

      // verify the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Invalid Token", error: err });
        }

        req.user = decoded.userDetails;
        next();
      });
    } else {
      return res.status(401).json({ message: "Missing Token" }); // Handle missing token
    }
  } catch (error) {
    next(error);
  }
};

module.exports = validateToken;
