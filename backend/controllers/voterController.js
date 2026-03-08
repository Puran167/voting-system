const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");


// Create Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};


// Generate 6 digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};


// ============================
// SEND OTP
// ============================
exports.sendOtp = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpVerified = false;

    await user.save();

    const transporter = createTransporter();

    console.log("Sending OTP to:", user.email);

    await transporter.sendMail({
      from: `"Smart Voting System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP for Smart Voting System",
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2>Smart Voting System</h2>
          <p>Hello <b>${user.name}</b></p>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `
    });

    console.log("OTP email sent successfully");

    const emailParts = user.email.split("@");
    const maskedEmail =
      emailParts[0].substring(0, 2) + "***@" + emailParts[1];

    res.json({
      message: "OTP sent successfully",
      email: maskedEmail
    });

  } catch (error) {

    console.error("Send OTP error:", error);

    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message
    });
  }
};



// ============================
// VERIFY OTP
// ============================
exports.verifyOtp = async (req, res) => {
  try {

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        message: "OTP not requested"
      });
    }

    if (new Date() > user.otpExpiry) {

      user.otp = null;
      user.otpExpiry = null;

      await user.save();

      return res.status(400).json({
        message: "OTP expired"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = true;

    await user.save();

    res.json({
      message: "OTP verified successfully"
    });

  } catch (error) {

    console.error("Verify OTP error:", error);

    res.status(500).json({
      message: "OTP verification failed"
    });
  }
};
