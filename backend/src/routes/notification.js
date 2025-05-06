const express = require('express');
const { getNotification, deleteNotification, clearNotification } = require ('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotification);
router.delete('/:id', protect, deleteNotification);
router.delete('/', protect, clearNotification);

module.exports = router;