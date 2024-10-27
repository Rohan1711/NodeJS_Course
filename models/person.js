const mongoose =require ('mongoose');
const brypt = require('bcrypt');
const personSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
    },
    work:{
        type:String,
        enum :['chef','waiter','manager'],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        required :true
    },
    password:{
        type:String,
        required :true
    }

});
personSchema.pre('save', async function(next){
    const person = this;
    // hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try {
        //hash password generation
        const salt =await brypt.genSalt(10);
        //hash password
        const hashedPassword = await brypt.hash(person.password, salt);
        //override the plain password with hashed one 
        person.password=hashedPassword;
        next();

    }catch(err){
        return next(err);
    }
})
personSchema.methods.comparePassword = async function(candidatePasword){
    try{
        //use brypt to compare the provided password with the hashed password
        const isMatch =await brypt.compare(candidatePasword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}
const Person = mongoose.model('Person',personSchema);
module.exports=Person;
