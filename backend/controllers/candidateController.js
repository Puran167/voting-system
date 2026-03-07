const Candidate = require('../models/Candidate');
const { validationResult } = require('express-validator');

// Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ name: 1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Add a new candidate (admin only)
exports.addCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, party } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : '';

    const candidate = new Candidate({ name, party, photo });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Delete a candidate (admin only)
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }
    res.json({ message: 'Candidate deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get election results
exports.getResults = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ votes: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
