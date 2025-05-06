const Expense = require('../models/Expense');
const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI-based Insight Controller
exports.getAIInsight = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    if (!expenses.length) {
      return res.status(404).json({ message: 'No expenses found to analyze.' });
    }

    const formattedExpenses = expenses.map(exp => ({
      date: exp.date.toISOString().split("T")[0],
      category: exp.category,
      amount: exp.amount,
      description: exp.description
    }));

    const prompt = `Analyze the user's expense records below and provide 5 personalized financial insights or tips: ${JSON.stringify(formattedExpenses)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful financial assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const aiInsight = response.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: aiInsight
    });
  } catch (error) {
    console.error("AI Insight Error:", error.message);
    res.status(500).json({ message: "Failed to generate AI insight." });
  }
};


exports.getInsight = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });

    if (!expenses.length) {
      return res.status(404).json({ message: 'No expenses found to generate insights.' });
    }

    const categoryTotals = {};
    const monthlyTotals = {};
    const categoryTrends = {}; 

    expenses.forEach(expense => {
      const category = expense.category;
      const date = new Date(expense.date);
      const amount = expense.amount;

      //Monthly key
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      //Total per Category 
      if (!categoryTotals[category]) categoryTotals[category] = 0;
      categoryTotals[category] += amount;

      //Total per Month 
      if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
      monthlyTotals[monthKey] += amount;

      //Category Trends for Dynamic Tips 
      if (!categoryTrends[category]) categoryTrends[category] = {};
      if (!categoryTrends[category][monthKey]) categoryTrends[category][monthKey] = 0;
      categoryTrends[category][monthKey] += amount;
    });

    //Top & Lowest Spending Category 
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0][0];
    const lowestCategory = sortedCategories[sortedCategories.length - 1][0];

    //Average Monthly Expense 
    const totalMonths = Object.keys(monthlyTotals).length;
    const totalExpense = Object.values(monthlyTotals).reduce((a, b) => a + b, 0);
    const avgMonthlyExpense = totalExpense / totalMonths;

    //Spending Trend (Compare last two months)
    const sortedMonths = Object.keys(monthlyTotals).sort();
    let spendingTrend = null;
    if (sortedMonths.length >= 2) {
      const lastMonth = sortedMonths[sortedMonths.length - 1];
      const prevMonth = sortedMonths[sortedMonths.length - 2];
      const current = monthlyTotals[lastMonth];
      const previous = monthlyTotals[prevMonth];
      const change = ((current - previous) / previous) * 100;
      spendingTrend = change.toFixed(2);
    }

    //Smart Saving Tips (Dynamic) 
    const tips = [];

    // Tip 1: Overall high spending
    if (avgMonthlyExpense > 1000) {
      tips.push("Consider setting a monthly spending limit.");
    }

    // Tip 2: Detect unusual spikes per category
    for (const category in categoryTrends) {
      const months = Object.keys(categoryTrends[category]).sort();
      if (months.length >= 2) {
        const previousMonths = months.slice(0, -1);
        const lastMonth = months[months.length - 1];

        const previousAvg = previousMonths
          .map(month => categoryTrends[category][month])
          .reduce((a, b) => a + b, 0) / previousMonths.length;

        const current = categoryTrends[category][lastMonth];
        const percentChange = ((current - previousAvg) / previousAvg) * 100;

        if (percentChange > 20) {
          tips.push(`Your ${category} spending increased by ${percentChange.toFixed(1)}%. Consider reviewing this.`);
        }
      }
    }

    // Default tip if no issues found
    if (!tips.length) {
      tips.push("You're managing your expenses well! Keep it up.");
    }

    //Return All Insights
    res.status(200).json({
      success: true,
      data: {
        topCategory,
        lowestCategory,
        avgMonthlyExpense: avgMonthlyExpense.toFixed(2),
        spendingTrend: spendingTrend ? `${spendingTrend}` : null,
        smartTips: tips,
        categoryTotals,
        monthlyTotals
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate insights' });
  }
};
