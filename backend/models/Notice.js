const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  priority: {
    type: String,
    enum: ['Normal', 'Important'],
    default: 'Normal'
  }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
