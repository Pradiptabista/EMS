
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
let con = require('./dbconnection');
let serverpath = require('./config');
const cors = require("cors");
var bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require('jsonwebtoken');
var config = require('./config');
const app = express();
app.use(bodyParser.json());
app.use(cors()); 
const fs = require('fs'); //writing buffer into a file
const fileUpload = require('express-fileupload');
app.use('/form', express.static(__dirname + '/index.html'));  //
const path = require('path');
const PORT = 3040;

const appRoute = require('./route.js') //
//
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }));
  app.use(express.static(path.join(__dirname, "/")))
app.use('/',appRoute)


app.post('/upload/image', function(req, res) {
    console.log('Image upload',req.files)

let user_image_path = path.join(__dirname, "./","uploads");
console.log("this",req.files.image.data )
//file name
const image_name = Date.now() + "_" + req.files.image.name;

});
/*

 ///jwt token checking
 app.get('/checks', function(req, res) {
    var token = req.headers['x-acess-token'];
    //console.log('token',token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'secretkey', function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
    });
  });
 

app.use('/',appRoute);

function uploadFile(file){
  console.log('file ===',file)
  return new Promise((resolve,reject)=>{
    let user_image_path = path.join(__dirname, "./","uploads");
    const image_name = Date.now() + "_" + file.image.name;
    console.log('image path',user_image_path)
    fs.writeFile(`${user_image_path}/${image_name}`,file.image.data, (err) =>{
      if (err) {
        reject(err)
      };
      resolve({image_name})
        
    });
  })
}


// Configuring body parser middleware

var jwtmiddleware = function (req, res, next) {
    console.log('jwt 888');
    try{
        let token = req.headers['x-acess-token'];
    console.log('token',token)
    var decoded = jwt.verify(token, 'secretkey'); 
  
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

//get all users all list
app.get('/users', jwtmiddleware,(req, res) => {
    con.query('CALL get_all()',
        (err, rows) => {
            if (err) throw err;
            //console.log('Data received from employee:');
            res.json({ message: "The list of all users are as follows", data: rows[0]});
        })
});
 ///jwt token checking
app.get('/checks', function(req, res) {
    var token = req.headers['x-acess-token'];
    //console.log('token',token)
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, 'secretkey', function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
    });
  });
  

//get users with specific id only
app.get('/users/:user_id',jwtmiddleware, (req, res) => {
    //if(Active_user!==0  Is_Admin!==0){
    const user_id = req.params.user_id;
    con.query(`CALL get_byid(${user_id})`, (err, rows) => {
        if (err) throw err;
        console.log('Distinct user id received from users:');
        console.log(rows);
        res.json({ message: "the user information for the given id is", data: rows[0]})

    });
}); 

function writeFile(image){
    return 'image written succsfully'
}

//post new information about a new user with hashed password

function hashPassword(password){
  
  return new Promise((resolve,reject)=>{
    bcrypt.hash(password, saltRounds, (err, hash) => {
        console.log('laces',hash)
       if(err) return err;
  resolve(hash)
  })
 }); 
}
app.post('/users',async (req, res) => {
  
    const body = req.body;
    
     console.log('pwd',body.user_password);

    let newpwd  = await hashPassword(body.user_password)  //await promise
    console.log('hash',newpwd)

let insert_query = `CALL insert_newinfo('${body.user_name}','${body.user_email}','${body.user_phone}','${body.user_role}','${newpwd}','${body.user_dob}','${body.user_gender}',${req.files.image_name}=0)`

con.query(insert_query, (err, rows) => {
        
    console.log(rows)
     if (err) throw err;
       console.log('Post new user information into users:', rows);
       console.log('to check the identity thing', JSON.stringify(rows[0]));
       var resp = JSON.stringify(rows[0]);
       var id = resp.substring(resp.indexOf(":")+1,resp.indexOf("}"));
       console.log("id ", id);

        res.json({ message:`Your information has been sucessfully added and has been assigned the id of ${id }`,data : `${id}`})
     });
 });

//put or update new information about a user
app.put('/users/update',jwtmiddleware, (req, res) => {
    const body = req.body;
    
    if(req.user.id == body.user_id  || req.user.Admin ){
    console.log('testing', body);

 
    con.query(`CALL update_information(${body.user_id},'${body.user_name}','${body.user_email}','${body.user_phone}','${body.user_role}','${body.user_dob}','${body.user_gender}')`,
        (err, rows) => {
            if (err) throw err;
            console.log('update user id into employee:');
            console.log(rows);
            res.json({ message: "Your information has been sucessfully updated" })

        });
    }
    else {
        res.json ({message:"You are not authorized to update the information"})
    }
});

//deleting specific id from users
app.delete('/users/:user_id',jwtmiddleware, (req, res) => {
    
      if(req.user.Admin){
    const user_id = req.params.user_id;
    con.query(`CALL deleteby_id(${user_id})`, (err, rows) => {
        if (err) throw err;
        console.log('Delete current employee id from users:');
        console.log(rows);
        res.json({ message: "deleted user of the given id" })

    });
}
else{
    res.json({message:"You are not authorized to delete user informattion. Please contact the administration"});
}
});

//compare password with that of what is in the database

function decryptPassword(password , hash){
   return new Promise((resolve,reject)=>{
bcrypt.compare(password, hash, function(err, res) {
    console.log('bcryptin',res)
    if(err) return err;
    resolve(res)
})
}); 
}

 //login and authentication work
app.post('/users/login', async(req, res) => {
    const body = req.body
    console.log('this', body);
    
    con.query(`select * from users where user_email=('${body.user_email}')`,
    //con.query(`select user_id, user_name, user_email, user_password, user_phone, user_phone, user_role, user_dob, user_gender from users where user_email=('${body.user_email}')`,
       async (err, result) => {
          
            var token = jwt.sign({ id: result[0].user_id ,email:result[0].user_email,Admin:result[0].Is_Admin}, 'secretkey', {
                expiresIn: 172800 // expires in 48 hours
              });
              console.log('token',token)
            let check_password = await decryptPassword(body.user_password , result[0].user_password);
            console.log('check password==',check_password)
            if(check_password){
                res.json({ data: result[0],token})
            }else{
                res.json({ data: err, message: "login credentials were incorrect" })
            }
         

        });
});


//put or update user password
function hashPassword(password){
  
    return new Promise((resolve,reject)=>{
      bcrypt.hash(password, saltRounds, (err, hash) => {
        
         if(err) return err;
    resolve(hash)
    })
   }); 
  }

app.put('/users/password' ,jwtmiddleware, async(req, res) => {

    const body = req.body
    const user = req.user;
    if(req.user.id == body.user_id){
    
    let newpwd  = await hashPassword(body.user_password)  //await promise
    console.log('hash',newpwd)
    con.query(`update users set user_password='${newpwd}' where user_id = '${body.user_id}'`,
        (err, rows) => {
            if (err) throw err;
            console.log('update user password :');
            console.log(rows);
            res.json({ message: "Your password has been sucessfully updated" })

        });
    }
    else{
        res.json({message:" You are not authorized to perform this operation"})
    }
});

//updating user active status by admin
app.get('/users/approve/:user_id',jwtmiddleware, (req, res) => {
     
         if(req.user.Admin){
            const user_id = req.params.user_id
            
            con.query(`call approve_sp(${user_id})`, (err, result) => {
                console.log(result)
                if (result.affectedRows != 0) {
                    res.json({ data: result, message: "user active status updated" })
                    console.log('login sucessfull:');
                }
                
                else {
                    console.log(result);
                    res.json({ data: err, message: "user doesnot exist" })
        
                }
            
            });
         }else{
            res.json({  message: "You are not authorized. Please contact to the administrator." })
         }

});

//get all users project list
app.get('/project', (req, res) => {
    console.log('user');
    con.query('CALL get_project()', 
        (err, rows) => {
            if (err) throw err;

            console.log('Data from project:');
            res.json({ message: "The list of all project details", data: rows[0] });
            console.log(rows);
        })
});

//get projects assigned to the given user id
app.get('/project/:user_id', (req, res) => {
    const user_id = req.params.user_id;
   con.query(`CALL get_projectbyUid('${user_id}')`, (err, result) => {
      
        if (result[0].length>0) {
            res.json({  message: "the projects assigned to the given user are",data: result[0] })
            console.log('sucessfull:');
        }
        else {
            console.log(result);
            res.json({ data: err, message: "no  user is currently assigned to any project" })
        
        
        }
        });
        
        
        });

//get user info assigned to the given project id
app.get('/project/user/:P_id', (req, res) => {
    const P_id = req.params.P_id;
   
    con.query(`CALL get_userinfobyPid(${P_id})`, (err, result) => {
      if (result[0].length > 0) {
    res.json({ data: result, message: "the user information for the given project is" })
    console.log('sucessfull:');
}
else {
    console.log(result);
    res.json({ data: err, message: "No  user is currently assigned to any project" })

}
});

});

//post new project information 

app.post('/project/post',jwtmiddleware,(req, res) => {
    const body = req.body;
    if(req.user.Admin){
let insert_query = `CALL insert_newproject('${body.P_name}','${body.P_budget}','${body.P_duration}')`

con.query(insert_query, (err, rows) => {
        
    console.log(rows)
    if (err) throw err;
    
    console.log('to check the identity ', JSON.stringify(rows[0]));
    var resp = JSON.stringify(rows[0]);
    var id = resp.substring(resp.indexOf(":")+1,resp.indexOf("}"));
    console.log("id ", id);
     res.json({ message:`the new project information has been updated and assigned the id of ${id }`, data:`${id}`})
  });
 }
 else{
     res.json({message:"You are not authorized to add project information"})
 }
});

//deleting specific project 
app.delete('/project/:P_id', jwtmiddleware,(req, res) => {
    const P_id = req.params.P_id;
    if(req.user.Admin){
    con.query(`CALL deleteproject_id(${P_id})`, (err, rows) => {
        if (err) throw err;
        console.log('Delete current project from project:');
        console.log(rows);
        res.json({ message: "deleted project", data: rows})
    });
}
else {
    res.json({message:"You are not authorized to delete project information"})
}
});

//deleting specific project assigned to a user
app.delete('/project/user/:P_id', jwtmiddleware,(req, res) => { 
    const P_id = req.params.P_id;
    if(req.user.Admin){
    con.query(`CALL deleteproject_assignid(${P_id})`, (err, rows) => {
        if (err) throw err;
        console.log('Delete current project from project:');
        console.log(rows);
        res.json({ message: "deleted project of the given project id", data: rows})
    });
}
else{
    res.json({message:"You are not authorized to delete project information"})
}
});

//deleting user assigned to a project
app.delete('/project/:user_id/:P_id', jwtmiddleware,(req, res) => { 
    const user_id = req.params.user_id;
    const P_id = req.params.P_id;
    if(req.user.Admin){
    con.query(`CALL deleteuser_assignpid(${user_id},${P_id})`, (err, rows) => {
        if (err) throw err;
        console.log(rows);
        res.json({ message: "deleted user assigned to the given project", data: rows})
    });
}
else{
    res.json({message:"You are not authorized to delete project information"})
}
});

//updating a project
app.put('/project/update',jwtmiddleware, (req, res) => {
    const body = req.body
    console.log('testing', body);
if(req.user.Admin){
    con.query(`CALL update_project(${body.P_id},'${body.P_name}','${body.P_budget}','${body.P_duration}')`,
        (err, rows) => {
            if (err) throw err;
            console.log(rows);
            res.json({ message: "Your project information has been sucessfully updated" })

        });
    }

    else{
        res.json({message:"You are not authorized to change project information" })
    }
});

//assingn a project id to the user

app.post('/project/piduid',jwtmiddleware,(req, res) => {
    const body = req.body;
    if(req.user.Admin){
let insert_query = `CALL assign_pid2user ('${body.P_id}','${body.user_id}');`

con.query(insert_query, (err, rows) => {
        
    console.log(rows)
     if (err) throw err;
       console.log('assign project id to the user:', rows);
       console.log(body.insertId)
        res.json({ message: `the project id has been assigned to the user`,userId:rows})
     });

    }
    else {
        res.json({message:"You are not authorized to perform this operation"})
    }

 });


//update project id and user id relationship

app.put('/project/piduid/update',jwtmiddleware, (req, res) => {
    const body = req.body
    console.log('testing', body);
if(req.user.Admin){
    con.query(`CALL update_piduid(${body.P_id},'${body.user_id}')`,
        (err, rows) => {
            if (err) throw err;
            console.log('update project assigned to user:');
            console.log(rows);
            res.json({ message: "the project has been assigned to the new user" })

        });
    }
    else{
        res.json({message:"You are not authorized to perform this operation"})
    }
});
app.put('/update/image',jwtmiddleware, async function(req, res) {

    let file = req.files;
    let user_obj = Object.assign(req.body,{image:file});
    console.log('image information',user_obj);
    let upload_result = await uploadFile(user_obj.image);
    console.log('Image uploaded successfully',upload_result)
  
  // fs.writeFile(`${user_image_path}/${image_name}`,req.files.image.data,  (err) =>{
  
    con.query(`update users set image_name= '${upload_result.image_name}' where user_id=${user_obj.id}`,
    (err, rows) => {
        if (err) throw err;
        console.log(rows);
        res.json({message:"Your profile picture has been updated",imagePath:`http://localhost:3040/uploads/${upload_result.image_name}`})
  
    });
    
   })
   
   */

app.listen(PORT, () => console.log(`port info ${PORT}!`));
