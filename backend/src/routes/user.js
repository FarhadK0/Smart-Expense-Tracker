const express = require('express');
const { protect } = require('../middleware/auth');
const { getUserProfile, updateUserProfile, updateUserPassword, deleteUserAccount,} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);
router.delete('/delete', protect, deleteUserAccount);

module.exports = router;
