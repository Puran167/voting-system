const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const otpController = require('../controllers/otpController');
const { auth, voterOnly } = require('../middleware/auth');

// POST /api/otp/send — Send OTP to voter's email
router.post('/send', auth, voterOnly, otpController.sendOtp);

// POST /api/otp/verify — Verify OTP
router.post('/verify', auth, voterOnly, [
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
], otpController.verifyOtp);

module.exports = router;
