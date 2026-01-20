const express= require('express');
const dotenv=require('dotenv');
const dbConnection=require('./config/db');
const authRoutes=require('./routes/authRoutes');
const userRoutes=require('./routes/userRoutes');
const cookieParser=require('cookie-parser');
const ApiError=require('./utils/apiError');
const {globalErrorHandler}=require('./middleware/errorMiddleware');

dotenv.config({path:'./config.env'});
dbConnection();

const app = express();
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user',userRoutes);


app.use(globalErrorHandler);


const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})