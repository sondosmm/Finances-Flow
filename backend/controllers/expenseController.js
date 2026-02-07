const Expense= require('../models/expenseModel');
const ApiError = require('../utils/apiError');
const asyncHandler = require("express-async-handler");

exports.createExpense=asyncHandler(async(req,res,next)=>{
    const { amount, category, description, date } = req.body;
    const expense = await Expense.create({
      amount,
      category,
      description,
      date,
      userId: req.user.id,
    });
    res.status(201).json({ message: "expense created successfully" });
});

exports.getExpense = asyncHandler(async (req, res, next) => {

    const expense=await Expense.findOne({_id:req.params.id, userId:req.user.id});
    if (!expense)
        return next(new ApiError("no expense with this id", 404));
    
    res.status(200).json({data:expense});
});

exports.getExpenses = asyncHandler(async (req, res, next) => {
    const page=req.query.page*1||1;
    const limit =Math.min(req.query.limit*1||4,50);
    const skip = (page - 1) * limit;
    const { category, from, to } = req.query;
    const filter = { userId: req.user.id };
    if (category)
    {
        filter.category = category;
    }
    if (from || to)
    {
        filter.date = {};
        if (from)
            filter.date.$gte = new Date(from);
        if (to)
            filter.date.$lte = new Date(to);
    }
  const expenses = await Expense.find(filter).sort({date:-1}).skip(skip).limit(limit);
  res.status(200).json({page:page,limit:limit, data: expenses });
});

exports.updateExpense=asyncHandler(async(req,res,next)=>{
    const { amount, category, description, date } = req.body;
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense)
        return next(new ApiError('no expense with this id',404));
    const updates={};
    if (amount!==undefined)
        updates.amount = amount;
    if (category !== undefined)
        updates.category = category;
    if (description !== undefined)
        updates.description = description;
    if (date !== undefined)
        updates.date = date;
    const updatedExpense= await Expense.findOneAndUpdate({_id:req.params.id,userId:req.user.id},updates,{new:true,runValidation:true});
    res.status(200).json({data:updatedExpense});
});

exports.deleteExpense= asyncHandler(async(req,res,next)=>{
    const expense= await Expense.findOneAndDelete({_id:req.params.id, userId:req.user.id});
    if (!expense) 
        return next(new ApiError("no expense with this id", 404));
    res.status(200).json({message :"expense deleted successfully"});
});