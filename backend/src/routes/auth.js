const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { googleStrategy, facebookStrategy } = require('../config/passport');

// Local signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message });
  }
});

// Local login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Google authentication
if (googleStrategy) {
  passport.use(googleStrategy);
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  });
} else {
  router.get('/google', (req, res) => res.status(501).json({ message: 'Google authentication not configured' }));
  router.get('/google/callback', (req, res) => res.status(501).json({ message: 'Google authentication not configured' }));
}

// Facebook authentication
if (facebookStrategy) {
  passport.use(facebookStrategy);
  router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
  router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  });
} else {
  router.get('/facebook', (req, res) => res.status(501).json({ message: 'Facebook authentication not configured' }));
  router.get('/facebook/callback', (req, res) => res.status(501).json({ message: 'Facebook authentication not configured' }));
}

module.exports = router;