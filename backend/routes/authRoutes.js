const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// POST /api/auth/register - Register new user
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('voterId').trim().notEmpty().withMessage('Voter ID is required'),
  body('fingerprintId').trim().notEmpty().withMessage('Fingerprint ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.register);

// POST /api/auth/login - Login user
router.post('/login', [
  body('voterId').trim().notEmpty().withMessage('Voter ID is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

// GET /api/auth/profile - Get current user profile
router.get('/profile', auth, authController.getProfile);

module.exports = router;
