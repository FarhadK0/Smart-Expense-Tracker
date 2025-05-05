const express = require('express');
const router = express.Router();
const { createBudget, getBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');
const { protect} = require('../middleware/auth');

router.post('/', protect, createBudget);
router.get('/', protect, getBudget);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);

module.exports = router;