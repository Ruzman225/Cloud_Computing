const express = require('express');
const Teacher = require('../models/Teacher');
const fetchTeacher = require('../middleware/fetchTeacher');
const router = express.Router();

// ROUTE 1: Sign in the logged-in teacher at POST "/api/teachers/signin" (Login required)
router.post('/signin', fetchTeacher, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Add a new session object with the current sign-in time
    teacher.sessions.push({ signIn: new Date() });
    await teacher.save();

    res.json({ success: true, message: 'Signed in successfully.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Sign out the logged-in teacher at POST "/api/teachers/signout" (Login required)
router.post('/signout', fetchTeacher, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    if (!teacher) {
        return res.status(404).json({ error: "Teacher not found" });
    }

    // Find the last session that has not yet been signed out
    let lastSession = teacher.sessions.find(session => !session.signOut);

    if (lastSession) {
      lastSession.signOut = new Date();
      // Calculate hours worked and fix to 2 decimal places
      const duration = (lastSession.signOut.getTime() - lastSession.signIn.getTime()) / (1000 * 60 * 60);
      lastSession.hoursWorked = parseFloat(duration.toFixed(2));
      
      await teacher.save();
      res.json({ success: true, message: 'Signed out successfully.' });
    } else {
      res.status(400).json({ error: "No active sign-in session found to sign out." });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 3: Get all teachers' data at GET "/api/teachers" (Login required)
router.get('/', fetchTeacher, async (req, res) => {
  try {
    // Fetch all teachers but exclude their passwords for security
    const teachers = await Teacher.find().select('-password');
    res.json(teachers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Update the logged-in teacher's grade at PUT "/api/teachers/self" (Login required)
router.put('/self', fetchTeacher, async (req, res) => {
    try {
      const { grade } = req.body;
      const updatedData = {};
  
      // Only prepare the fields that are being sent for update
      if (grade !== undefined) {
        updatedData.grade = grade;
      } else {
        return res.status(400).json({ error: "No grade provided for update." });
      }
  
      const teacher = await Teacher.findByIdAndUpdate(
        req.teacher.id,
        { $set: updatedData },
        { new: true } // This option returns the updated document
      ).select('-password');
  
      res.json({ success: true, message: "Grade updated successfully.", teacher });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
});

module.exports = router;