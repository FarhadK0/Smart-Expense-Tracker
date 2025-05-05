const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require("../../utils/sendEmail");


//@desc Admin login
//@route POST /api/admin/login
//@access Public
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  //Validate fields
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password'});
  }

  //Check for admin
  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Details not found!'});
  }

 


 

  //check password
  const isMatch = await admin.matchPassword(password);

  

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect email or password. Please try again'});

  }

  //Update lastLogin
  admin.lastLogin = new Date();
  console.log("Updating lastLogin for admin:", admin.email);
  await admin.save();
 
  //Create Token
  const token = admin.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email:admin.email,
     
    }
  });

};

exports.adminRegister = async (req, res) => {
  try {
    const {name, email, password} = req.body;

    //check if admin already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin with this email already exists"});
    }

    //Create Admin
    const admin = await Admin.create({ name, email, password });

    //Generate token
    const token = admin.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  }
  catch (error) {
    console.error("Admin registration error:", error.message);
    res.status(500).json({message: "Server error"});
  }
};



exports.forgotAdminPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({message: "User not found with this email"});
    }

    // Gernate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token expiration to user
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await admin.save();

    // Create reset link
    const resetUrl = `${process.env.BASE_URL}/admin/reset-password/${resetToken}`;

    // Email content
    const message = `<p>You requested a password reset.</p>
    <p>Clcik the link below to reset your password.</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 10 minutes.</p>`;

    await sendEmail(admin.email, "Password Reset Request", message);

    res.status(200).json({ message: "Reset link to email."});
  }
  catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending email. Please try again."});
  }
};

exports.resetAdminPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now()}, //ensure token is not expired
    });

    if (!admin) {
      return res.status(400).json({message: "The liken has expired. Please request a new link."});
    }

    //set new passwowrd
    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save();
    
    res.status(200).json({message: "Password reset successful."});

  }
  catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({message:"Server Error"});
  }
}