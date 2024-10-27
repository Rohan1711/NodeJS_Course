const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem.js");


router.post("/", async (req, res) => {
  try {
    const data = req.body; // assuming the request.body contain person data
    // create a new person document using the mongoose model
    const newMenu = new MenuItem(data);

    const response = await newMenu.save();
    console.log("data saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get('/:tasteType' , async(req, res) =>{
    try{
      const tasteType =req.params.tasteType;  //extract tasteType from URL
      if(tasteType=='spicy'|| tasteType=='sweet' || tasteType=='sour')
      {
        const response= await MenuItem.find({taste:tasteType});
        console.log("response fetched");
        res.status(200).json(response);
      }else{
        res.status(404).json({error:"invalid tasteType"});
      }
    } catch(err){
    console.log(err);
    res.status(500).json({error:"internal server error"});
    }
  })

module.exports=router;