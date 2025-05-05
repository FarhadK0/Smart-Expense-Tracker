const Budget = require('../models/Budget')

//Create Budget
exports.createBudget = async (req, res) => {
  try {
    const { category, amount, period, startDate, endDate } = req.body;
    
    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      period,
      startDate,
      endDate,
    });

    res.status(201).json(budget);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({message: "Failed to create budget"});
  }
};


//Get Budget for Logged-in User

exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.find({ user: req.user._id}).sort({ createdAt: -1});

    if (!budget) {
      return res.status(404).json({message:"No budget found"});
    }
    res.json(budget);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({message: "Failed to fetch budget"})
  }
}
  //Update Budget
  exports.updateBudget = async (req, res) => {
    try {
      const { id } = req.params;
      const { category, amount, period, startDate, endDate } = req.body;

      const budget = await Budget.findOneAndUpdate(
        { _id: id, user: req.user._id},
        { category, amount, period, startDate, endDate},
        { new: true}
      );

      if (!budget) {
        return res.status(404).json({message: "No budget found to update"});
      }

      res.json(budget);
    }

    catch (error) {
      console.error(error);
      res.status(500).json({message: "Failed to update budget"});
    }
  }

  //Delete Budget
  exports.deleteBudget = async (req, res) => {
    try {
      const { id } = req.params;
      const budget = await Budget.findOneAndDelete({ _id: id, user: req.user._id});

      if (!budget) {
        return res.status(404).json({message: "No budget found to delete"});
      }

      res.json({message: "Budget deleted successfully"});
    }
    catch (error) {
      console.error(error);
      res.status(500).json({message: "Failed to delete budget"});
    }
  };