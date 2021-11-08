const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req,res,next) =>{
  const { name, username, password } = req.body;
  console.log(name, username, password);
  try{
  const hashedPwd= await bcrypt.hash(password,12);
  const user = new User({
    name: name,
    username: username,
    password: hashedPwd
  });
  await user.save();
  res.status(201).json({
    message: 'User Created!', username: username })
} catch(err) {
  console.log(err);
}
};

exports.readUser = async (req,res,next) =>{
  const { username, password } = req.body;
  console.log(username, password);
  try{
    const user = await User.findOne({username});
    if(!user){
      const error = new Error('no user found with this username');
      error.statusCode = 401;
      throw error;
    }
  let loadedUser = user;
  const isEqual = bcrypt.compare(user.password, password);
  if(!isEqual){
    const error = new Error("password doesn't match!")
    error.statusCode=401;
    throw error;
  }
  const token = jwt.sign({
    name: loadedUser.name,
    username: loadedUser.username
  }, 'somesupersecretsecret',
  {expiresIn: '1h'});
  res.status(200).json({ token: token, username: loadedUser.username});
} catch(err) {
  if(!err.statusCode)
    console.log(err.statusCode);
    err.statusCode=500;
    next(err);
}
};

exports.updateUser = async (req,res,next) =>{
  const { name, username } = req.body;
  const oldUsername = req.username;
  console.log(name, username);
  try{
    const user = await User.findOne({oldUsername});
    if(!user){
      const error = new Error('no user found with this username');
      error.statusCode = 401;
      throw error;
    }
    user.name = name;
    loadedUser=user;
    user.username = username;
    await user.save();
  res.status(200).json({ status: "updated successfully", username: loadedUser.username});
} catch(err) {
  if(!err.statusCode)
    console.log(err.statusCode);
    err.statusCode=500;
    next(err);
}
};
  
exports.deleteUser = async (req,res,next) =>{
  const username = req.username;
  console.log(username);
  try{
    const user = await User.deleteOne({username});
    if(!user){
      const error = new Error('no user found with this username');
      error.statusCode = 401;
      throw error;
    }
  res.status(200).json({ status: "deleted successfully", username: username});
} catch(err) {
  if(!err.statusCode)
    console.log(err.statusCode);
    err.statusCode=500;
    next(err);
}
};


