const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yourSecretJWTKey'; // Use the SAME secret key from your login route

const fetchTeacher = (req, res, next) => {
  // Get the token from the header
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token and extract the user's ID
    const data = jwt.verify(token, JWT_SECRET);
    req.teacher = data.teacher;
    next(); // If token is valid, proceed to the next function (the route handler)
  } catch (error) {
    res.status(401).send({ error: "Access denied. Invalid token." });
  }
};

module.exports = fetchTeacher;