const jwt =require('jsonwebtoken');

const jwtAuthMidleware = (req,res,next)=>{
    // first check request  header has authorized or not
    const authorization=req.headers.authorization
    if(!authorization) return res.status(401).json({error: "Token not found"});

    //extract the jwt token from request headers
    const token =req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'Unauthorized'});

    try{
        // verify the jwt token
        const decoded= jwt.verify(token, process.env.JWT_SECRET);

        //attch user information to the request object 
        req.user=jwt.decoded
        next();

    }catch(err){
        console.error(err);
        res.status(401).json({error : 'Inavlid token'});
    }
}
// function to generate JWT token
const generateToken = (userData)=>{
    // generate a new JWT token using user data 
    return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn: 30000});

}

module.exports = {jwtAuthMidleware, generateToken }