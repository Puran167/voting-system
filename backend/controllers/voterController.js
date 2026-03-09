const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all voters (admin only)
exports.getAllVoters = async (req, res) => {
  try {
    const voters = await User.find({ role: 'voter' }).select('-password').sort({ createdAt: -1 });
    res.json(voters);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Admin pre-registers an eligible voter (only voterId + name)
exports.addVoter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, voterId } = req.body;

    // Check if voterId already exists
    const existingUser = await User.findOne({ voterId });
    if (existingUser) {
      return res.status(400).json({ message: 'A voter with this Voter ID already exists.' });
    }

    // Create pre-approved voter entry (not yet registered)
    const voter = new User({
      name,
      voterId,
      role: 'voter',
      registered: false
    });
    await voter.save();

    const voterData = voter.toObject();
    delete voterData.password;
    res.status(201).json(voterData);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Delete a voter (admin only)
exports.deleteVoter = async (req, res) => {
  try {
    const voter = await User.findByIdAndDelete(req.params.id);
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found.' });
    }
    res.json({ message: 'Voter deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Verify fingerprint ID
exports.verifyFingerprint = async (req, res) => {
  try {
    const { fingerprintId } = req.body;
    if (!fingerprintId) {
      return res.status(400).json({ message: 'Fingerprint ID is required.' });
    }

    // Check if fingerprint belongs to the logged-in user
    const user = await User.findOne({ _id: req.user._id, fingerprintId });
    if (!user) {
      return res.status(400).json({ message: 'Fingerprint ID does not match your records.' });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already voted. Duplicate voting is not allowed.' });
    }

    // Mark fingerprint as verified for this user
    user.fingerprintVerified = true;
    await user.save();

    res.json({ message: 'Fingerprint verified successfully.', verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
