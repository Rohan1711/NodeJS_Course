const express = require ('express');
const router = express.Router();
const Person = require ('../models/person.js');
const {jwtAuthMidleware, generateToken }= require('./../jwt.js');
//post route to add person 
router.post('/signup', async (req, res)=>{
    try{
    const data = req.body;  // assuming the request.body contain person data
   // create a new person document using the mongoose model
    const newPerson = new Person(data);

    const response = await newPerson.save();
    console.log("data saved");
    
    const payload = {
      id: response.id,
      username:response.username
    }
    console.log(JSON.stringify(payload));
  
    const token =generateToken(payload);
    console.log("token is : ",token);

    res.status(200).json({response: response, token: token});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
  }
   
}) 

// login route
router.post('/login', async(req,res)=> {
  try{
    // extract username and password from request body
  const {username,password}=req.body;
  //find user by username
  const user =await Person.findOne({username:username});
  //if user does not exits or password does not match , return error
  if(!user || !(await user.comparePassword(password))){
    return res.status(401).json({error : 'Invalid username or password'});
  }

  //generate token

  const payload ={
    id:user.id,
    username:user.username

  }
  const token = generateToken(payload);
  // return token as response
  res.json({token})
  }catch(err){
    console.log(err)
    res.status(500).json({error: 'internal server error'});
  }
  
});
// Profile route
router.get('/profile', jwtAuthMidleware, async (req, res) => {
  try{
      const userData = req.user;
      console.log("User Data: ", userData);

      const userId = userData.id;
      const user = await Person.findById(userId);

      res.status(200).json({user});
  }catch(err){
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})


// Assuming jwtAuthMidleware is correctly defined and authenticates the user
// router.get('/profile', jwtAuthMidleware, async (req, res) => {
//   try {
//     // Check if req.user exists
//     if (!req.user) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//     // If req.user exists, proceed to fetch user data
//     const userData = req.user;
//     console.log("User Data: ", userData);

//     const userId = userData.id;
//     const user = await Person.findById(userId);

//     res.status(200).json({ user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// })


// get method to get person
router.get('/',jwtAuthMidleware, async (req, res) =>{
  try{
    const data = await Person.find();
    console.log("data fetched");
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});

  }
})

router.get('/:workType' , async(req, res) =>{
    try{
      const workType =req.params.workType;  //extract workType from URL
      if(workType=='chef'|| workType=='waiter' || workType=='manager')
      {
        const response= await Person.find({work:workType});
        console.log("response fetched");
        res.status(200).json(response);
      }else{
        res.status(404).json({error:"invalid workType"});
      }
    } catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
    }
  })

router.put('/:id',async (req, res)=>{
    try{
        const personId = req.params.id; //extract id from the URL paramter
        const updatedPersonData =req.body; //updated data for the person

        const response = await Person.findByIdAndUpdate(personId,updatedPersonData,{
            new:true, // return the updated documents
            runValidators:true, //run mongoose validation
        })
        if(!response){
            return res.status(404).json({error:"Person not found"});
        }
        console.log("data updated");
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'})
    }
})

router.delete('/:id',async (req, res)=>{
    try{
        const personId = req.params.id; //extract id from the URL paramter
        
        // assuming you have a person model
        const response = await Person.findOneAndDelete(personId);
        if(!response){
            return res.status(404).json({error:"Person not found"});
        }
        console.log("data deleted");
        res.status(200).json({message :'Person delted successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'})
    }
})


module.exports=router;