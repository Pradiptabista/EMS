
const router = require('express').Router();
const con = require('../dbconnection');
var jwt = require('jsonwebtoken');
var uploadFile = require('../utility/imageuploadservice.js');


 //update user image
 router.put('/update/img', async function(req, res) {

    let file = req.files;
    console.log('pradii',req.user)
    let user_obj = Object.assign(req.body,{image:file});
    console.log('image information',user_obj);
    let upload_result = await uploadFile(user_obj.image);
    console.log('Image uploaded successfully',upload_result)
  

    con.query(`update users set image_name= '${upload_result.image_name}' where user_id=${req.user.id}`,
    (err, rows) => {
        if (err) throw err;
        console.log(rows);
        res.json({message:"Your profile picture has been updated",imagePath:`http://localhost:3040/uploads/${upload_result.image_name}`})
  
    });
    
   })
   
  
  module.exports =router;