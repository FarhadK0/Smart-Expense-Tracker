const Expense = require('../models/Expense');
const User = require('../models/User');
const Budget = require('../models/Budget');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');


// @desc Get all expense for the authentication User
// @route    GET /api/expense
// @access   Private
// @returns {Array} List of user's expenses sorted by date(newest first)

exports.getExpenses = async (req, res) => {
  try {
    //Find all expenses belonging to the authenticated user
    //Sort by date in descending order (newest first)
    const expense = await Expense.find({ userId: req.user.id}).sort({date: -1});

    //Return the expense as JSON response
    res.json(expense);
  }

  catch (error){
  //Handle server errors

  res.status(500).json({
    message: 'Error fetching expenses',
    error: error.message
  });
  }
};

// @desc    Create a new expense
//   @route   POST /api/expenses
//   @access  Private
//   @param   {String} category - Expense category
//   @param   {String} description - Expense description
//  @param   {Number} amount - Expense amount
//   @param   {Date} date - Date of expense (defaults to now)
//   @param   {String} paymentMethod - Payment method used
//  @param   {String} status - Expense status (default: 'completed')
//   @returns {Object} The newly created expense

exports.createExpense = async (req, res) => {
  //Destructure requires fields from request from request body
  const { category, description, amount, date, paymentMethod, status} = req.body;

  //Create new expense document
  const newExpense = new Expense({
    userId: req.user.id, 
    category,
    description,
    amount,
    date: date || Date.now(),
    paymentMethod,
    status: status || 'completed',
  });

  try {
    //Save the new expense to database
    const savedExpense = await newExpense.save();

    // Check fir mathing budget
    const budget = await Budget.findOne({
      user: req.user.id,
      category,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

   
    if (budget) {
      //Calculate total expenses in this category for the budget period
      const totalSpent = await Expense.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user.id),
            category,
            status: "completed",
            date: { $gte: budget.startDate, $lte: budget.endDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      const spent = totalSpent.length > 0 ? totalSpent[0].total : 0;
      const percentageSpent = (spent / budget.amount) * 100;
      const roundedPercentage = Math.round(percentageSpent);


   

      //Trugger notification if thresholds are crossed
      let message = null;
      if (percentageSpent >= 100) {
        message = `You have exceeded your ${category} budget.`; 
      }
      else if (percentageSpent >= 80) {
        message = `You have spent ${roundedPercentage}% of your ${category} budget.`;

      }
      else if (percentageSpent >= 50) {
        message = `You have spent ${roundedPercentage}% of your ${category} budget.`;
      }

      if (message) {
       
        await Notification.create({
          user: req.user.id,
          message,
          type: "budget",
        });
      }
    }

    res.status(201).json(savedExpense);
  }
  catch (error) {
    res.status(400).json({
      message: 'Failed  to create expense',
      error: error.message
    });
  }
};


// @desc    Update an existing expense
//   @route   PUT /api/expenses/:id
//   @access  Private
//   @param   {String} id - Expense ID to update
//  @param   {Object} body - Fields to update
//  @returns {Object} The updated expense document

exports.updateExpense = async (req, res) => {
  const { id } = req.params;

  try {
    //Find and Update the expense, ensuring it belongs to the user
    const updatedExpense = await Expense.findOneAndUpdate(
      {_id: id, userId: req.user.id}, //verify the user
      req.body,
      { new: true}
    );

    //if expense not found
    if (!updatedExpense) {
      return res.status(404).json({message: 'Expense not found'});
    }

    //Return the updated expense
    res.json(updatedExpense);
  }
  catch (error) {
    res.status(400).json({
      message: 'Failed to update expense',
      error: error.message
    });
  }
};

//  @desc    Delete an expense
//  @route   DELETE /api/expenses/:id
//  @access  Private
// @param   {String} id - Expense ID to delete
// @returns {Object} Success message

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    //Find and delete the expense, verifying user
    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    //if not found
    if (!deletedExpense) {
      return res.status(404).json({message: 'Expense not found'});
    }

    //Return success message
    res.json({message: 'Expense deleted successfully'});
  }
  catch (error) {
    res.status(500).json({
      message: 'Failed to delete expense',
      error: error.message
    });
  }
};