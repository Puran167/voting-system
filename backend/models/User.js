const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    default: null,
    lowercase: true,
    trim: true
  },
  voterId: {
    type: String,
    required: [true, 'Voter ID is required'],
    unique: true,
    trim: true
  },
  fingerprintId: {
    type: String,
    default: null,
    trim: true
  },
  password: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'voter'],
    default: 'voter'
  },
  registered: {
    type: Boolean,
    default: false
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  fingerprintVerified: {
    type: Boolean,
    default: false
  },
  capturedPhoto: {
    type: String,
    default: ''
  },
  profilePhoto: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Sparse unique indexes: allow multiple nulls but enforce uniqueness for non-null values
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ fingerprintId: 1 }, { unique: true, sparse: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
