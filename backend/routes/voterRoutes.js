const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const voterController = require('../controllers/voterController');
const { auth, adminOnly, voterOnly } = require('../middleware/auth');

// GET /api/voters - Get all voters (admin only)
router.get('/', auth, adminOnly, voterController.getAllVoters);

// POST /api/voters - Add a new voter (admin only)
router.post('/', auth, adminOnly, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('voterId').trim().notEmpty().withMessage('Voter ID is required'),
  body('fingerprintId').trim().notEmpty().withMessage('Fingerprint ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], voterController.addVoter);

// DELETE /api/voters/:id - Delete a voter (admin only)
router.delete('/:id', auth, adminOnly, voterController.deleteVoter);

// POST /api/voters/verify-fingerprint - Verify fingerprint (voter only)
router.post('/verify-fingerprint', auth, voterOnly, voterController.verifyFingerprint);

module.exports = router;
