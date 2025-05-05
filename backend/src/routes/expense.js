const express = require('express');
const { getExpenses, createExpense, updateExpense, deleteExpense, } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

//Get all expense
router.get('/', protect,getExpenses);

//Create a new expense
router.post('/', protect, createExpense);

//Update an existing expense
router.put('/:id', protect, updateExpense);

//Delete an expense
router.delete('/:id', protect, deleteExpense);

module.exports = router;