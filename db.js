const mongoose =require('mongoose');
require('dotenv').config();

const mongoURL =process.env.MONGODB_URL_LOCAL;
// define the mongoDB connection url
// const mongoURL = 'mongodb://localhost:27017/Hotels';

// set up momgDB connection

mongoose.connect(mongoURL);
//     {
//     useNewUrlParser:true
//     // useUnifiedTopology:true
// })

// get defalut connection 
// Mongoose maintain a defalut connection obejct representing the mongoDB connection

const db=mongoose.connection;

//define event listener for db connection
db.on('connected',()=>{
    console.log("Connected to mongoDB server");
});

db.on('error',(err)=>{
    console.log("Connection error",err);
});

db.on('disconnected',()=>{
    console.log("MongoDB disconnected");
});

//export db connection
module.exports=db;