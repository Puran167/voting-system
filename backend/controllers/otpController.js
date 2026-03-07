const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Create Nodemailer transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// POST /api/otp/send — Send OTP to user's email
exports.sendOtp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.otpVerified = false;
    await user.save();

    // Send OTP email
    const transporter = createTransporter();
    console.log('Sending OTP email to:', user.email, 'from:', process.env.EMAIL_USER);
    await transporter.sendMail({
      from: `"Smart Voting System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your OTP for Smart Voting System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Smart Voting System</h2>
          <p style="color: #334155;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #334155;">Your One-Time Password (OTP) for identity verification is:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; background: #eef2ff; padding: 16px 32px; border-radius: 12px; border: 2px dashed #818cf8;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">If you did not request this OTP, please ignore this email.</p>
        </div>
      `
    });

    // Mask email for response
    const emailParts = user.email.split('@');
    const maskedEmail = emailParts[0].substring(0, 2) + '***@' + emailParts[1];

    res.json({ message: 'OTP sent successfully.', email: maskedEmail });
  } catch (error) {
    console.error('Send OTP error:', error.message);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// POST /api/otp/verify — Verify user's OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: 'OTP is required.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP was requested. Please request a new OTP.' });
    }

    if (new Date() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP verified successfully
    user.otp = null;
    user.otpExpiry = null;
    user.otpVerified = true;
    await user.save();

    res.json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Verify OTP error:', error.message);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};
