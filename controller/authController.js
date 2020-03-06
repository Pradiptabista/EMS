const express = require("express");
const router = require('express').Router();
var utility= require('../utility/bcrypt.js')
const saltRounds = 10;
const con = require('../dbconnection');
var jwt = require('jsonwebtoken');



//posting user information

router.post('/register',async (req, res) => {
const body = req.body;
console.log("eww",body);

    let newpwd = await utility.hashPassword(body.user_password)  //await promise
    console.log('hash',newpwd)

let insert_query = `CALL insert_newinfo('${body.user_name}','${body.user_email}','${body.user_phone}','${body.user_role}','${newpwd}','${body.user_dob}','${body.user_gender}')`

con.query(insert_query, (err, rows) => {
        
    console.log('yeeee',rows)
     if (err) throw err;
     
       console.log('to check the identity thing', JSON.stringify(rows[0]));
       var resp = JSON.stringify(rows[0]);
       var id = resp.substring(resp.indexOf(":")+1,resp.indexOf("}"));
       console.log("id ", id);

        res.json({ message:`Your information has been sucessfully added and has been assigned the id of ${id }`,data : `${id}`})
     });
 });

//login and authentication work
router.post('/login', async(req, res) => {
    const body = req.body
   console.log('thissssssss',body.user_email);
    con.query(` select * from users where user_email = '${body.user_email}' and Active_user=1`,
    // con.query(`select * from users where user_email = '${body.user_email}'`,
       async (err, result) => {
          console.log('pradiptaaa',result)
            var token = jwt.sign({ id: result[0].user_id ,email:result[0].user_email,Admin:result[0].Is_Admin}, 'secretkey', {
                expiresIn: 172800 // expires in 48 hours
              });
              console.log('token',token)
            let check_password = await utility.decryptPassword(body.user_password , result[0].user_password);
            console.log('check password==',check_password)
            if(check_password){
                res.json({ data: result[0],token})
            }else{
                res.json({ data: err, message: "login credentials were incorrect or you are not a active user" })
            }
         
        });
});
 
   




 module.exports =router;