const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // No two teachers can have the same email
  },
  password: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    default: 'Not Assigned'
  },
  sessions: [{
    signIn: { type: Date },
    signOut: { type: Date },
    hoursWorked: { type: Number, default: 0 }
  }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Teacher', TeacherSchema);