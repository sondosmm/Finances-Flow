const mongoose =require('mongoose');
const bcrypt =require('bcryptjs')
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],

    },
    password: {
      type: String,
      required: [true, "password is required"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};:'",.<>/?\\|`~])[^\s]{8,}$/,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      ],
      select: false,
    },
    budget: {
      type: "Number",
      default: 0,
      min: [0, "budget cannot be negative"],
    },
  },
  { timestamps: true }
);

UserSchema.pre('save',async function(next){
    if (!this.isModified('password'))
        return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});



module.exports=mongoose.model('User',UserSchema);