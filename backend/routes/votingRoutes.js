const express = require('express');
const router = express.Router();
const votingController = require('../controllers/votingController');
const { auth, adminOnly, voterOnly } = require('../middleware/auth');
const { electionTimeLock } = require('../middleware/electionTimeLock');

// POST /api/voting/cast - Cast a vote (voter only, election time enforced)
router.post('/cast', auth, voterOnly, electionTimeLock, votingController.castVote);

// POST /api/voting/capture-photo - Capture voter photo before voting (voter only)
router.post('/capture-photo', auth, voterOnly, votingController.capturePhoto);

// GET /api/voting/voter-status - Get voter verification status (voter only)
router.get('/voter-status', auth, voterOnly, votingController.getVoterStatus);

// GET /api/voting/receipt - Get voting receipt (voter only)
router.get('/receipt', auth, voterOnly, votingController.getVotingReceipt);

// GET /api/voting/status - Check voting time status
router.get('/status', auth, votingController.getVotingStatus);

// POST /api/voting/settings - Set voting time (admin only)
router.post('/settings', auth, adminOnly, votingController.setVotingTime);

// GET /api/voting/settings - Get voting settings
router.get('/settings', auth, votingController.getVotingSettings);

// GET /api/voting/logs - Get vote logs (admin only)
router.get('/logs', auth, adminOnly, votingController.getVoteLogs);

// DELETE /api/voting/logs/:id - Delete a single vote log (admin only)
router.delete('/logs/:id', auth, adminOnly, votingController.deleteVoteLog);

// DELETE /api/voting/logs - Clear all vote logs (admin only)
router.delete('/logs', auth, adminOnly, votingController.clearAllVoteLogs);

// GET /api/voting/verify/:verificationId - Verify a vote (public, no candidate reveal)
router.get('/verify/:verificationId', votingController.verifyVote);

// GET /api/voting/location-stats - Get vote counts by location (admin only)
router.get('/location-stats', auth, adminOnly, votingController.getLocationStats);

module.exports = router;
