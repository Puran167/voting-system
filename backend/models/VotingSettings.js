const mongoose = require('mongoose');

const votingSettingsSchema = new mongoose.Schema({
  votingStartTime: {
    type: Date,
    required: [true, 'Voting start time is required']
  },
  votingEndTime: {
    type: Date,
    required: [true, 'Voting end time is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('VotingSettings', votingSettingsSchema);
