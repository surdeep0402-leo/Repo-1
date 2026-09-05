require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);

// Route for dedicated Dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Catch-all route to serve the frontend home/login page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB & start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('----------------------------------------------------');
    console.log(' MongoDB connected successfully!');
    console.log(` Database URI: ${MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@')}`);
    console.log('----------------------------------------------------');
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
      console.log(' Open your browser to test the Authentication application.');
      console.log('----------------------------------------------------');
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
    console.log('\nTIP: Ensure MongoDB is running locally (e.g., mongod service),');
    console.log('or configure your MongoDB Atlas connection string in the .env file.\n');
    
    // Start the server anyway so the frontend and error diagnostics can be viewed
    app.listen(PORT, () => {
      console.log(` Server started in fallback mode on http://localhost:${PORT}`);
      console.log(' (Database operations will fail until MongoDB is connected)');
      console.log('----------------------------------------------------');
    });
  });
