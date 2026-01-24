const express= require('express');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const dbConnection=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require("./routes/reportRoutes");
const expenseRoutes=require('./routes/expenseRoutes');
const cookieParser=require('cookie-parser');
const ApiError=require('./utils/apiError');
const {globalErrorHandler}=require('./middleware/errorMiddleware');


dbConnection();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/expense', expenseRoutes);
app.use('/api/v1/report',reportRoutes)


app.use(globalErrorHandler);


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})