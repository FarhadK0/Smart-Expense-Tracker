//Import the mongoose library for MongoDB object modelling
const mongoose = require('mongoose');

//Define the Schema for the Expense model
const expenseSchema = new mongoose.Schema({

  //Reference to the User who created this expense
  userId: {
    type: mongoose.Schema.Types.ObjectId, //Stores MongoDB ObjectId
    ref: 'User', //References the Uuser Model
    required: true, //This field is mandatory
  },

  //Category of the expense (e.g Foood etc)
  category: {
    type: String,
    required: true,

  },

  //Description of the expense
  description: {
    type: String,
    required: true,
  },

  //Amount of the expense
  amount: {
    type: Number,
    required: true,
  },

  //Data when the expense was incurred
  date: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        const today = new Date();
        const minDate = new Date(today.getFullYear(), today.getMonth() -1, 1);
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 31);
        return value >= minDate && value <= maxDate;

    },
    message: 'Date must be within the last month or next month',
  },
  },

  //Payment method used for the expense
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'Cash',  'PayPal', 'ApplePay', 'GooglePay'],
    required: true,
  },


  //Status of the expense transction
  status: {
    type: String,
    enum: ['completed', 'pending', 'recurring'],
    default: 'completed', //If not provided deafults to completed
  },
});

//Create and export the Expense model based on the schema
module.exports = mongoose.model('Expense', expenseSchema);