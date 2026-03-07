const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// GET /api/candidates - Get all candidates
router.get('/', auth, candidateController.getAllCandidates);

// POST /api/candidates - Add candidate (admin only)
router.post('/', auth, adminOnly, upload.single('photo'), [
  body('name').trim().notEmpty().withMessage('Candidate name is required'),
  body('party').trim().notEmpty().withMessage('Party name is required')
], candidateController.addCandidate);

// DELETE /api/candidates/:id - Delete candidate (admin only)
router.delete('/:id', auth, adminOnly, candidateController.deleteCandidate);

// GET /api/candidates/results - Get election results
router.get('/results', auth, candidateController.getResults);

module.exports = router;
