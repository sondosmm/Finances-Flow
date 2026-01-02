const mongoose= require('mongoose');

const expeseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "this field is required"],
  },
  amount: {
    type: Number,
    required: [true, "this field is require"],
    min: 0.01,
  },
  category: {
    type: "String",
    required: [true, "this field is required"],
    enum: [
      "Food",
      "Transport",
      "Bills",
      "Health",
      "Entertainment",
      "Shopping",
      "Other",
    ],
  },
  description: {
    type: "String",
    required: [true, "this field is required"],
    maxlength: 200,
    trim: true,
  },
  date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

expeseSchema.index({userId:1,date:-1});


module.exports=mongoose.model('Expense',expeseSchema);