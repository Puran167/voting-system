const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");


// Create transporter
const createTransporter = async () => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection for debugging
  await transporter.verify();
  console.log("SMTP server ready");

  return transporter;
};


// Generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};


// ======================
// SEND OTP
// ======================
exports.sendOtp = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    user.otpVerified = false;

    await user.save();

    const transporter = await createTransporter();

    console.log("Sending OTP to:", user.email);

    await transporter.sendMail({
      from: `"Smart Voting System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Smart Voting System</h2>
          <p>Hello <b>${user.name}</b></p>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:5px">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `
    });

    console.log("OTP email sent");

    res.json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("OTP send error:", error);

    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message
    });
  }
};



// ======================
// VERIFY OTP
// ======================
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
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (new Date() > user.otpExpiry) {

      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = true;

    await user.save();

    res.json({
      message: "OTP verified successfully"
    });

  } catch (error) {

    console.error("OTP verify error:", error);

    res.status(500).json({
      message: "OTP verification failed"
    });
  }
};
