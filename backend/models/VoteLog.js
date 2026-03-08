const mongoose = require('mongoose');
const crypto = require('crypto');

const voteLogSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  candidateName: {
    type: String,
    default: ''
  },
  partyName: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  verificationId: {
    type: String,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique verification ID before saving: VOTE-XXXXX
voteLogSchema.pre('save', function (next) {
  if (!this.verificationId) {
    const hex = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
    this.verificationId = `VOTE-${hex}`;
  }
  next();
});

module.exports = mongoose.model('VoteLog', voteLogSchema);
