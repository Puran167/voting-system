const Candidate = require('../models/Candidate');
const User = require('../models/User');
const VoteLog = require('../models/VoteLog');
const VotingSettings = require('../models/VotingSettings');
const fs = require('fs');
const path = require('path');

// Cast a vote
exports.castVote = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user._id;

    // Check if user has already voted
    const user = await User.findById(userId);
    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already voted.' });
    }

    // Check if fingerprint was verified before voting
    if (!user.fingerprintVerified) {
      return res.status(400).json({ message: 'Fingerprint verification is required before voting.' });
    }

    // Check if photo was captured before voting
    if (!user.capturedPhoto) {
      return res.status(400).json({ message: 'Photo capture is required before voting.' });
    }

    // Election time is enforced by electionTimeLock middleware

    // Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // Increment candidate vote count
    candidate.votes += 1;
    await candidate.save();

    // Mark user as voted
    user.hasVoted = true;
    await user.save();

    // Create vote log entry with captured photo
    const voteLog = new VoteLog({
      voterId: userId,
      candidateId,
      candidateName: candidate.name,
      partyName: candidate.party,
      photo: user.capturedPhoto,
      timestamp: new Date()
    });
    await voteLog.save();

    // Emit real-time update via Socket.IO (attached to req by server)
    if (req.io) {
      const allCandidates = await Candidate.find().sort({ votes: -1 });
      req.io.emit('voteUpdate', allCandidates);
    }

    // Return receipt data for PDF generation
    res.json({
      message: 'Vote cast successfully!',
      receipt: {
        voterId: user.voterId,
        voterName: user.name,
        candidateName: candidate.name,
        partyName: candidate.party,
        timestamp: voteLog.timestamp,
        verificationId: voteLog.verificationId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Capture voter photo (before voting, after fingerprint verification)
exports.capturePhoto = async (req, res) => {
  try {
    const { photo } = req.body;
    const userId = req.user._id;

    if (!photo) {
      return res.status(400).json({ message: 'Photo is required.' });
    }

    const user = await User.findById(userId);

    // Must have fingerprint verified first
    if (!user.fingerprintVerified) {
      return res.status(400).json({ message: 'Fingerprint verification is required before photo capture.' });
    }

    if (user.hasVoted) {
      return res.status(400).json({ message: 'You have already voted.' });
    }

    // Save voter photo (base64 image)
    const base64Data = photo.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `vote-${userId}-${Date.now()}.png`;
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    const photoPath = `/uploads/${filename}`;

    // Store photo path on user record
    user.capturedPhoto = photoPath;
    await user.save();

    res.json({
      message: 'Photo captured successfully.',
      photo: photoPath
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Check voting time status
exports.getVotingStatus = async (req, res) => {
  try {
    const settings = await VotingSettings.findOne().sort({ createdAt: -1 });
    if (!settings) {
      return res.json({ status: 'no-settings', message: 'Voting time not configured.' });
    }

    const now = new Date();
    if (now < new Date(settings.votingStartTime)) {
      return res.json({ status: 'not-started', message: 'Voting has not started yet.', settings });
    }
    if (now > new Date(settings.votingEndTime)) {
      return res.json({ status: 'closed', message: 'Voting has closed.', settings });
    }

    res.json({ status: 'active', message: 'Voting is active.', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Set voting time (admin only)
exports.setVotingTime = async (req, res) => {
  try {
    const { votingStartTime, votingEndTime } = req.body;

    if (!votingStartTime || !votingEndTime) {
      return res.status(400).json({ message: 'Start and end time are required.' });
    }

    if (new Date(votingStartTime) >= new Date(votingEndTime)) {
      return res.status(400).json({ message: 'Start time must be before end time.' });
    }

    // Upsert: update existing or create new
    const settings = await VotingSettings.findOneAndUpdate(
      {},
      { votingStartTime, votingEndTime },
      { new: true, upsert: true }
    );

    res.json({ message: 'Voting time updated successfully.', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get voting settings
exports.getVotingSettings = async (req, res) => {
  try {
    const settings = await VotingSettings.findOne().sort({ createdAt: -1 });
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get voting receipt for the logged-in voter
exports.getVotingReceipt = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.hasVoted) {
      return res.status(400).json({ message: 'No vote record found.' });
    }

    const voteLog = await VoteLog.findOne({ voterId: userId }).sort({ timestamp: -1 });
    if (!voteLog) {
      return res.status(404).json({ message: 'Vote record not found.' });
    }

    res.json({
      receipt: {
        voterId: user.voterId,
        voterName: user.name,
        candidateName: voteLog.candidateName,
        partyName: voteLog.partyName,
        timestamp: voteLog.timestamp,
        verificationId: voteLog.verificationId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get all vote logs (admin only)
exports.getVoteLogs = async (req, res) => {
  try {
    const logs = await VoteLog.find()
      .populate('voterId', 'name voterId email')
      .populate('candidateId', 'name party')
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
