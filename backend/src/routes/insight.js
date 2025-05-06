const express = require('express');
const { getInsight, getAIInsight } = require('../controllers/insightController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Regular insight route
router.get('/', protect, getInsight);

// AI-based insight route
router.get('/ai', protect, getAIInsight);

module.exports = router;
