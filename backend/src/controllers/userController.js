const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('name email income');
    res.status(200).json({
      success: true,
      data: user,
    });
  }
  catch (error) {
    res.status(500).json({ success: false, message: 'Server error'});
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found'});

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.income = req.body.income ?? user.income;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile update successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        income: user.income,
      },
    });
  }
  catch (error) {
    res.status(500).json({ success: false, message: 'Server error'});
  }
};

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
exports.updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if(!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password'});
    }

    const isSamePassword = await user.matchPassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from current password' });
    }
    
    user.password = newPassword
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully'});
  }
  catch (error) {
    res.status(500).json({ success: false, message: 'Server error'});
  }
};

// @desc    Delete user account
// @route   DELETE /api/user/delete
// @access  Private
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found'});

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'Account deleted successfully'});
  }
  catch (error) {
    res.status(500).json({ successs: false, message: 'Server error'});
  }
};