const mongoose= require ('mongoose');

const dbConnection =async ()=>{
    try{
       const conn= await mongoose.connect(process.env.DB_URI);
        console.log(`Database Connection on ${conn.connection.host}`);
        console.log(mongoose.connection.name);
    }
    catch(err){
        console.error(`Database Connection error: ${err}`);
    };
};


module.exports=dbConnection;