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

// Add a new voter (admin only)
exports.addVoter = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, voterId, fingerprintId, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { voterId }, { fingerprintId }]
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email, voter ID, or fingerprint ID already exists.' });
    }

    const voter = new User({ name, email, voterId, fingerprintId, password, role: 'voter' });
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

    // Check if OTP was verified first
    const currentUser = await User.findById(req.user._id);
    if (!currentUser.otpVerified) {
      return res.status(400).json({ message: 'OTP email verification is required before fingerprint verification.' });
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
