const User = require('../models/User');


// GET all voters
exports.getAllVoters = async (req, res) => {
  try {
    const voters = await User.find({ role: 'voter' });
    res.json(voters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch voters" });
  }
};


// ADD voter
exports.addVoter = async (req, res) => {
  try {

    const { name, email, voterId, fingerprintId, password } = req.body;

    const voter = new User({
      name,
      email,
      voterId,
      fingerprintId,
      password,
      role: "voter"
    });

    await voter.save();

    res.json({ message: "Voter added successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add voter" });
  }
};


// DELETE voter
exports.deleteVoter = async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Voter deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete voter" });
  }
};


// VERIFY fingerprint
exports.verifyFingerprint = async (req, res) => {
  try {

    const { fingerprintId } = req.body;

    const voter = await User.findOne({ fingerprintId });

    if (!voter) {
      return res.status(400).json({ message: "Fingerprint not recognized" });
    }

    res.json({ message: "Fingerprint verified" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fingerprint verification failed" });
  }
};
