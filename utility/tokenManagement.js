const express = require("express");
var jwt = require('jsonwebtoken');
// Configuring body parser middleware
var jwtmiddleware = function (req, res, next) {
    console.log('jwt 888');
    try{
        let token = req.headers['x-acess-token'];
    console.log('token @@@@@@@',token)
    var decoded = jwt.verify(token, 'secretkey'); 
    console.log('decoded',decoded)
    if(decoded){
        req.user = decoded;
        next();
    }else{
        res.json({message:"You are not Authenticated . Please Sign in first"});
        return;
    }
    }catch(e){
        res.json({message:"You are not Authenticated . Please Sign in first"});
    }
   
  }

  module.exports = jwtmiddleware;