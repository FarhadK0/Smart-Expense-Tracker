const Expense = require("../models/Expense");
const User = require("../models/User");

exports.getReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ userId});

    if (!expenses.length) {
      return res.status(404).json({message: "No expenses found"});
    }

    const user = await User.findById(userId);
    const income = user?.income || 0;


    //Monthly breakdown
    const monthlyTotals = {};
    const categoryTotals = {};
    const categoryTrends = {};
   

    
    

    expenses.forEach((expense) => {
      const { amount, category, date } = expense;
      const dt = new Date(date);
      const monthKey = `${dt.getFullYear()}-${String(dt.getMonth() +1).padStart(2, "0")}`;

      //Monthly totals
      if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
      monthlyTotals[monthKey] += amount;

      //Category totals
      if (!categoryTotals[category]) categoryTotals[category] = 0;
      categoryTotals[category] +=amount;

      // Category Trends
      if (!categoryTrends[category]) categoryTrends[category] ={};
      if (!categoryTrends[category][monthKey]) categoryTrends[category][monthKey] = 0;
      categoryTrends[category][monthKey] += amount;
    });

    // Current and previous month detction
    const sortedMonths = Object.keys(monthlyTotals).sort();
    const currentMonthKey = sortedMonths[sortedMonths.length -1];
    const prevMonthKey = sortedMonths[sortedMonths.length -2] || null;

    const currentMonthTotal = monthlyTotals[currentMonthKey] || 0;
    const prevMonthTotal = prevMonthKey ? monthlyTotals[prevMonthKey] : 0;
    const monthlySavings = 
    income - currentMonthTotal;
    const savingRate = income > 0 ?((monthlySavings / income) * 100).toFixed(1) : "0.0";

    //Category breakdown woth percentages
    const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    const categoryBreakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalExpenses) * 100),
    }));

    //Category trend data (current vs previous)
    const trendData = [];
    for (const category in categoryTrends) {
      const current = categoryTrends[category][currentMonthKey] || 0;
      const previous = categoryTrends[category][prevMonthKey] || 0;
      const change = previous === 0 ? 0 : ((current - previous) / previous) * 100;
      trendData.push({
        category,
        previous,
        current,
        change: `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
      });
    }

    // Quaterly-style overview (latest 3 months if available)
    const quarterlyData = sortedMonths.slice(-3).map((monthKey) => {
      const expenses = monthlyTotals[monthKey];
      return {
        month: monthKey,
        income,
        expenses,
        saving: income - expenses,
      };
    });
  
    res.status(200).json({
      success:true,
      data: {
        monthlySummary: {
          income,
          expenses: currentMonthTotal,
          savings: monthlySavings,
          savingRate,
        },
        categoryBreakdown,
        categoryTrends: trendData,
        quarterlyData,
      },
    });
  }
  catch (error) {
    console.error("Report error:", error);
    res.status(500).json({message: "Failed to generate report."});
  }
};