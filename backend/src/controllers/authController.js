const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require("../../utils/sendEmail");


// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {

try {
  const { name, email, password } = req.body;

  //Check if user already exists
  const userExists
    = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  

  //Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  //Gernate token
  sendTokenResponse(user, 201, res);
}
catch (error) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate email and password
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide an email and password' });
    }

    //Check for user
    const user = await User.findOne({ email }).select('+password');
   

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User Not Found' });
    }


    //Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid Password or Email' });
    }

    user.lastLogin = new Date();
    await user.save();
    //Gernate token
    sendTokenResponse(user, 200, res);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

//
// @desc    Get current logged in user
// @route   POST /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email');

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email
        
      }
    });
  }
  catch (error) {
    console.error (error);
      res.status(500).json({
        succes: false,
        message: 'Server error'
      });
    
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout  
// @access  Private
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

//Get token from model, create cookie and send response
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // User object to return
  const userData = {
    id: user._id,
    name: user.name,
    email: user.email
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({message: "User not found with this email"});
    }

    // Gernate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token expiration to user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Create reset link
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    // Email content
    const message = `<p>You requested a password reset.</p>
    <p>Clcik the link below to reset your password.</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>`;

    await sendEmail(user.email, "Password Reset Request", message);

    res.status(200).json({ message: "Reset link to email."});
  }
  catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending email. Please try again."});
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now()}, //ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({message: "The liken has expired. Please request a new link."});
    }

    //set new passwowrd
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    
    res.status(200).json({message: "Password reset successful."});

  }
  catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({message:"Server Error"});
  }
}



