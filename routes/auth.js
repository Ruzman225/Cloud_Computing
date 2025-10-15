const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher'); // Import the Teacher model

const router = express.Router();

// ROUTE 1: Sign Up a new teacher at POST "/api/auth/signup"
router.post('/signup', async (req, res) => {
  try {
    // Check if a teacher with this email already exists
    let teacher = await Teacher.findOne({ email: req.body.email });
    if (teacher) {
      return res.status(400).json({ error: "Sorry, a user with this email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create and save the new teacher
    teacher = await Teacher.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, message: "Account created successfully!" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Log In a teacher at POST "/api/auth/login"
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the teacher by email
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // If credentials are correct, create a JWT token
        const payload = { teacher: { id: teacher.id } };
        const authToken = jwt.sign(payload, 'yourSecretJWTKey'); // Replace 'yourSecretJWTKey' with a secret string

        res.json({ success: true, authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;