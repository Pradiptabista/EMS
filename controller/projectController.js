const router = require('express').Router();
const con = require('../dbconnection');
var jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    con.query('CALL get_project()',
        (err, rows) => {
            if (err) throw err;
            console.log('Data from project:');
            res.json({ message: "The list of all project details", data: rows[0] });
            console.log(rows);
        })
})


//get all project
router.get('/', (req, res) => {
    console.log('user', req.user);
    con.query('CALL get_project()',
        (err, rows) => {
            if (err) throw err;
            res.json({ message: "The list of all project are as follows", data: rows[0] });
        })
});

//get all project along with he users associated
router.get('/usernproject', (req, res) => {
    
    con.query('CALL get_userwithproject()',
        (err, rows) => {
            if (err) throw err;
            res.json({ message: "The list of all project along with the users involved are as follows", data: rows[0] });
        })
});

//get projects assigned to the given user id
router.get('/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    con.query(`CALL get_projectbyUid('${user_id}')`, (err, result) => {

        if (result[0].length > 0) {
            res.json({ message: "the projects assigned to the given user are", data: result[0] })
            console.log('sucessfull:');
        }
        else {
            console.log(result);
            res.json({ data: err, message: "No projects are assigned to the user" })


        }
    });


});

//get user info assigned to the given project id
router.get('/user/:P_id',(req, res) => {
    const P_id = req.params.P_id;

    con.query(`CALL get_userinfobyPid(${P_id})`, (err, result) => {

        if (result.length !== 0) {
            res.json({ data: result, message: "the user information for the given project is" })
        }

        else {
            console.log(result);
            res.json({ data: err, message: "No  user is currently assigned to any project" })

        }
    });
});


//deleting specific project 
router.delete('/:P_id', (req, res) => {
    const P_id = req.params.P_id;
    if(req.user.Admin){
    con.query(`CALL deleteproject_id(${P_id})`, (err, rows) => {
        if (err) throw err;

        res.json({ message: "deleted project", data: rows })
    });
}
else{
    res.json({message:"You are not authenticated to perform this operation"})
}
});



//deleting specific project assigned to a user
router.delete('/user/:P_id',(req, res) => {
    const P_id = req.params.P_id;
    if(req.user.Admin){
    con.query(`CALL deleteproject_assignid(${P_id})`, (err, rows) => {
        if (err) throw err;
        console.log('Delete current project from project:');

        res.json({ message: "deleted project of the given project id", data: rows })
    });
}
else{
    res.json({message:"You are not authorized to perform this operation"})
}
});


//get user info assigned to the given project id
router.get('/usernproject',(req, res) => {
    const P_id = req.params.P_id;

    con.query(`CALL get_userwithproject()`, (err, result) => {

        if (result.length !== 0) {
            res.json({ data: result, message: "the user information along with the project name is " })
        }

        else {
            console.log(result);
            res.json({ data: err, message: "No  user is currently assigned to any project" })

        }
    });
});




 //deleting user assigned to a project

 router.delete('/:user_id/:P_id',(req, res) => { 
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
        res.json({message:"You are not authorized to perform this operation"})
    }
 });
   
 //posting a project
 router.post('/post',(req, res) => {
    const body = req.body;
    if(req.user.Admin){
let insert_query = `CALL insert_newproject('${body.P_name}','${body.P_budget}','${body.P_duration}')`

con.query(insert_query, (err, rows) => {
        console.log(rows);
    if (err) throw err;
    
    console.log('to check the identity ', JSON.stringify(rows[0]));
    var resp = JSON.stringify(rows[0]);
    var id = resp.substring(resp.indexOf(":")+1,resp.indexOf("}"));
    console.log("id ", id);
     res.json({ message:`the new project information has been updated and assigned the id of ${id }`, data:`${id}`})
  });
}
else{
    res.json({message:"You are not authorized to perform this operation"})
}

});


    //assign a project id to the user

router.post('/piduid',(req, res) => {
    const body = req.body;
console.log('2345665456',body);
if(req.user.Admin){
let insert_query = `CALL assign_pid2user (${body.P_id},${body.user_id})`

con.query(insert_query, (err, rows) => {
        
     if (err) throw err;
       console.log('assign project id to the user:', rows);
       console.log(body.insertId)
        res.json({ message: `the project id has been assigned to the user`,userId:rows})
     });

    }
    else{
        res.json({message:"You are not authorized to perform this operation"})
    }
 });

 //updating a project
router.put ('/update',(req,res)=> {
    const body = req.body
    if(req.user.Admin){
    con.query(`CALL update_project(${body.P_id},'${body.P_name}','${body.P_budget}','${body.P_duration}')`,
        (err, rows) => {
  if (err) throw err;
  console.log(rows);
  res.json({message:"The project information has been sucessfully updated"})
  
        })
    }
    else{
        res.json({message:"You are not authorized to perform this operation"})
    }
  
      });

//update project id and user id relationship

router.put('/piduid/update', (req, res) => {
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
    

module.exports = router;