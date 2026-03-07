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
  verificationId: {
    type: String,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Generate a unique verification ID before saving: VR-YYYY-XXXX
voteLogSchema.pre('save', function (next) {
  if (!this.verificationId) {
    const year = new Date().getFullYear();
    const hex = crypto.randomBytes(2).toString('hex').toUpperCase();
    this.verificationId = `VR-${year}-${hex}`;
  }
  next();
});

module.exports = mongoose.model('VoteLog', voteLogSchema);
