const Notification = require('../models/Notification');

// @desc Get all notifications for the logged-in user
// @route Get /api/notification
// @access Private

exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.find({ user: req.user.id}).sort({ createdAt: -1});
    res.status(200).json(notification);
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to fetch notification', error: error.message});
  }
};

// @desc Delete a specific notification
// @route DELETE /api/notifications/:id
// @access Private
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete({_id: req.params.id, user: req.user.id});

    if (!notification) {
      return res.status(404).json({message: 'Notification not found'});
    }
    res.json({ message: 'Notification deleted successfully'});
  }
  catch (error) {
    res.status(500).json({message: 'Failed to delete notification', error: error.message});
  }
};

// Clear all notifications
exports.clearNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    res.json({ message: 'All notifications cleared'});
  }
  catch (error) {
    res.status(500).json({message: 'Failed to clear notifications', error: error.message});
  }
};