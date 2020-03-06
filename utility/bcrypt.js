var express = require("express");
var bcrypt = require("bcrypt");
const saltRounds = 10;

function hashPassword(password){
  console.log('thissss',password)
    return new Promise((resolve,reject)=>{
      bcrypt.hash(password, saltRounds, (err, hash) => {
          console.log('laces',hash)
         if(err) return err;
    resolve(hash)
    })
   }); 
  }

  function decryptPassword(password , hash){
    return new Promise((resolve,reject)=>{
 bcrypt.compare(password, hash, function(err, res) {
     console.log('bcryptin',res)
     if(err) return err;
     resolve(res)
 })
 }); 
 }


 module.exports = {decryptPassword,hashPassword}