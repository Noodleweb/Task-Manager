const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

router.post('/register', async(req,res) => {
  const {username,email,password,confirmPassword} = req.body
  try{
    //Check if passwords match
    if(password !== confirmPassword){
      return res.status(400).json({error: 'Passwords do not match'});
    }

    // Check if user with the same email already exists
    const existingUSer = await schemas.Users.findOne({email});
    if(existingUSer){
      return res.status(400).json({error:'Email is already registered'});
    }

    // Respond to the request indicating email verification is required
    res.status(200).json({ message: 'Please check your email for verification' });

    // Hash and salt the password
    const hashedPassword = await bcrypt.hash(password,10);

    // Create new user
    const userData = {username:username,email:email,password:hashedPassword};
    const newUser = new schemas.Users(userData);
    const savedUser = await newUser.save();
    res.status(200).json({message:'Account has been registered'});
  }catch(error){
    console.error('Failed to register:',error);
    res.status(500).json({error:'Failed to register'});
  } 
});
// Login endpoint
router.post('/login', async(req,res)=>{
  const { email, password } = req.body;

  try{
  const user = await schemas.Users.findOne({email})
  if(!user){
    console.log('User does not exist');
    return res.status(400).json({error:'User does not exist'});
  }

  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    return res.status(400).json({error:'Password is incorrect'});
  }
  const payload = {email:user.email,username:user.username};
  const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'15min'});
  // Redirect to the dashboard
  res.status(200).json({accessToken:token});
 

  } catch(error) {
      console.error('Failed to login:',error);
      res.status(500).json({error:'Failed to login'});
  }

});

router.get('/dashboard', authenticateToken,(req,res) => {
  res.send("Welcome");
});

//middleware authentication
function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);

  jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next();
  });

};


module.exports = router