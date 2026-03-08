const Notice = require('../models/Notice');

// Get all notices (public for authenticated users)
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Create a notice (admin only)
exports.createNotice = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const notice = new Notice({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'Normal'
    });
    await notice.save();

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Delete a notice (admin only)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found.' });
    }
    res.json({ message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
