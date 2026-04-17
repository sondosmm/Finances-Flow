const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
exports.getSummary = async (userId, month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const categories = await Expense.aggregate([
        {
            $match: {
                userId:objectUserId,
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        }
    ]);
    const totalSpent = categories.reduce((sum, e) => sum + e.total, 0);
    const user = await User.findById(userId);
    return {
        month: `${year}-${month}`,
        budget: user.budget,
        totalSpent,
        remaining: user.budget - totalSpent,
        categories
    };
};

exports.getYearlySummary = async (userId, year) => {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const data = await Expense.aggregate([
    {
      $match: {
        userId: objectUserId,
        date: {
          $gte: start,
          $lt: end,
        },
      },
    },
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month, i) => {
    const found = data.find((d) => d._id === i + 1);
    return { month, total: found ? found.total : 0 };
  });
};