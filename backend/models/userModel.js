const mongoose =require('mongoose');
const bcrypt =require('')
const UserSchema=new mongoose.Schema({
    name : {
        type:'String',
        required: [true,'name is required'],
    },
    email: {
        type:'String',
        required:[true, 'email is required'],
        unique:[true,'email must be unique']
    },
    password: {
        type:'String',
        required:[true,'password is required'],
        match:[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-=[\]{};:'",.<>/?\\|`~])[^\s]{10,}$/ ,'password length must be at least 8 charcters and must have at least one uppercase letter, one lowercase letter , one number, one special charcter'],
        select:false,
    },
});

UserSchema.pre('save',async (next)=>{
    if (!this.isModified('password'))
        return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
});


UserSchema.methods.match = async (enteredPassword)=>{
    return await bcrypt.compare(enteredPassword,this.password);
};


module.exports=mongoose.model('User',UserSchema);