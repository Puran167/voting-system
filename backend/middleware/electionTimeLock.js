const VotingSettings = require('../models/VotingSettings');

// Middleware: Check if current time is within the election time window
const electionTimeLock = async (req, res, next) => {
  try {
    const settings = await VotingSettings.findOne().sort({ createdAt: -1 });

    if (!settings) {
      return res.status(403).json({ message: 'Election time has not been configured yet.' });
    }

    const now = new Date();
    const start = new Date(settings.votingStartTime);
    const end = new Date(settings.votingEndTime);

    if (now < start) {
      return res.status(403).json({
        message: 'Voting has not started yet.',
        electionStart: settings.votingStartTime,
        electionEnd: settings.votingEndTime
      });
    }

    if (now > end) {
      return res.status(403).json({
        message: 'Voting has ended.',
        electionStart: settings.votingStartTime,
        electionEnd: settings.votingEndTime
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error checking election time.', error: error.message });
  }
};

module.exports = { electionTimeLock };
