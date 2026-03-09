const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register a voter (voter must be pre-approved by admin)
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { voterId, name, email, fingerprintId, password } = req.body;

    // Check if voterId + name exists in database (pre-approved by admin)
    const voter = await User.findOne({ voterId, name });
    if (!voter) {
      return res.status(400).json({ message: 'You are not in the voter database. Contact the admin.' });
    }

    // Check if already registered
    if (voter.registered) {
      return res.status(400).json({ message: 'Voter already registered.' });
    }

    // Check if email is already used by another voter
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: voter._id } });
      if (emailExists) {
        return res.status(400).json({ message: 'This email is already in use.' });
      }
    }

    // Check if fingerprintId is already used by another voter
    if (fingerprintId) {
      const fpExists = await User.findOne({ fingerprintId, _id: { $ne: voter._id } });
      if (fpExists) {
        return res.status(400).json({ message: 'This fingerprint ID is already in use.' });
      }
    }

    // Update voter record with registration details
    voter.email = email;
    voter.fingerprintId = fingerprintId;
    voter.password = password;
    voter.registered = true;
    await voter.save();

    const token = generateToken(voter);
    res.status(201).json({
      token,
      user: { id: voter._id, name: voter.name, email: voter.email, voterId: voter.voterId, role: voter.role, hasVoted: voter.hasVoted, registered: voter.registered }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// Login user (supports voterId or email)
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { voterId, password } = req.body;

    // Support login by voterId or email
    const user = await User.findOne({
      $or: [{ voterId }, { email: voterId }]
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Only allow login if registered
    if (!user.registered && user.role !== 'admin') {
      return res.status(400).json({ message: 'Please complete registration before logging in.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, voterId: user.voterId, role: user.role, hasVoted: user.hasVoted, registered: user.registered }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided.' });
    }

    const photoPath = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { profilePhoto: photoPath });

    res.json({ message: 'Profile photo updated successfully.', profilePhoto: photoPath });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
