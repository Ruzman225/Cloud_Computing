const express = require('express');
const mongoose = require('mongoose'); // Make sure this line is here
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- ADD THIS BLOCK BACK IN ---
const MONGO_URI = "mongodb://localhost:27017/teacherAppDB";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
// --------------------------------

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teachers', require('./routes/teachers')); // Ensure this filename is correct

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));