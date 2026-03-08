const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/notices — fetch all notices (authenticated)
router.get('/', auth, noticeController.getAllNotices);

// POST /api/notices — admin adds notice
router.post('/', auth, adminOnly, noticeController.createNotice);

// DELETE /api/notices/:id — admin deletes notice
router.delete('/:id', auth, adminOnly, noticeController.deleteNotice);

module.exports = router;
