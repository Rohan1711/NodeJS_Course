const express = require('express');
const app = express();
const db=require('./db');
require('dotenv').config();

const passport =require('./auth.js');


const bodyParser=require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// middleware
const logRequest = (req,res,next)=>{
  console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
  next(); // move to the next phase
}
app.use(logRequest);

app.use(passport.initialize());
const localAuthMiddleware = passport.authenticate('local',{session:false});

//import router file
const personRoutes =require('./routes/personRoutes.js');
const menuItemRoutes =require('./routes/menuItemRoutes.js');

//use router
app.get('/',localAuthMiddleware, function (req, res) {
  res.send('Welcome to my hotel')
})
app.use('/person', personRoutes);
app.use('/menuitem', menuItemRoutes);



// app.get('/chicken', function (req, res) {
//     res.send('sure! would serve u chicken')
//   })

// app.get('/idli', function (req, res) {
//     res.send('south indian fav')
//   })  


app.listen(PORT,()=>{
    console.log("server is running on port 3000")
})