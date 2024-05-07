const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

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
  // Find the user with the given email.  
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
  res.status(200).json({accessToken:token});
 

  } catch(error) {
      console.error('Failed to login:',error);
      res.status(500).json({error:'Failed to login'});
  }

});

router.get('/dashboard', authenticateToken,(req,res) => {
  res.send("Welcome");
});

//Middleware for authentication
function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401); // unauthorized

  jwt.verify(token,process.env.JWT_SECRET,(err,user) => {
    if(err) return res.sendStatus(403); // invalid token
    req.user = user;
    next();
  });

};

function authenticateCookie(req,res,next){
  const token = req.cookies['_auth']; // Extract token from the cookie

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token

        req.user = user;
        next();
    });
};

// Task endpoints
router.get('/tasks',authenticateCookie ,async(req,res) => {
  const email = req.user.email; // Extract email from token payload (email is unique)
  
  try{
    const user = await schemas.Users.findOne({email});
    if(!user){
      return res.status(400).json({error:'User does not exist'});
    }
    const tasks = await schemas.Task.find({ user: user._id });
    res.json({tasks});

  } catch(error) {
    console.error('failed to fetch tasks:',error);
    res.status(500).json({error:'Failed to fetch tasks'});
  }

});

router.post('/tasks', authenticateCookie ,async(req,res)=>{
  const { title, description, dueDate, subTasks } = req.body;
  const userMail= req.user.email;

  if(!title){
    res.status(400).json({error:'Title is required'});
  }
  try{
    const user = await schemas.Users.findOne({email:userMail})
    if(!user){
      return res.status(400).json({error:'User not found'});
    }    

    const processedDueDate = typeof dueDate === 'object' && Object.keys(dueDate).length === 0 ? null : dueDate;
    const userId = new mongoose.Types.ObjectId(user._id);
    const newTask = new schemas.Task({
    title:title,
    description:description,
    dueDate:processedDueDate,
    subTasks: subTasks.map(subtask => ({ title: subtask.title, completed: subtask.completed })),
    user:userId,
    });

    newTask.save();

    res.status(200).send('Task added successfully');
  }catch(error){
    console.error('Failed to add task:',error);
    res.status(500).json({error:'Failed to add task'});
  }
});

router.delete('/tasks', authenticateCookie ,async(req,res)=>{
  const taskId = req.body.taskId;
  if(!taskId){
    return res.status(400).json({error:'Invalid task id'});
  }

  try{
    const result = await schemas.Task.deleteOne({_id:taskId});
    res.status(200).send('Task deleted successfully');
  } catch(error) {
    console.error('Failed to delete task:',error);
    res.status(500).json({error:'Failed to delete task'});
  }
});

module.exports = router