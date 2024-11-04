// auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const router = express.Router();

// Login route for basic HTTP authentication and JWT generation
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.status(200).json({ message: 'Login successful', token: 'Bearer ' + token });
  })(req, res, next);
});

module.exports = router;
