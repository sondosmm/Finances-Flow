const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
exports.getSummary = async (userId, month, year) => {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const expenses = await Expense.find({ userId: userId, date: { $gte: start, $lt: end } });
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
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const user = await User.findById(userId);
    return {
        month: `${year}-${month}`,
        budget: user.budget,
        totalSpent,
        remaining: user.budget - totalSpent,
        categories
    };
};