const express = require('express');
const dotenv = require('dotenv');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const userRoutes=require('./routes/user');
dotenv.config({path: './config/config.env'});
const app =express();

console.log('-------------------SERVER STARTS------------------');

app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});

app.use('/',userRoutes);

app.use((error,req,res,next)=>{
  console.log(error.statusCode);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data});
})

const MONGO_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hfqxk.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

mongoose.connect(MONGO_URI)
.then((result)=>{
  app.listen(process.env.PORT);
})
.catch(err=> console.log(err));



