const router = require('express').Router();
const con = require('../dbconnection');
var utility= require('../utility/bcrypt.js')
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");
const saltRounds = 10;

router.put('/test'),(req, res) => {
    const body = req.body;
    console.log('ipdate user')
    con.query(`CALL update_information(${body.user_id},'${body.user_name}','${body.user_email}','${body.user_phone}','${body.user_role}','${body.user_dob}','${body.user_gender}')`,
        (err, rows) => {
            if (err) throw err;
            console.log('update user id into employee:');
            console.log(rows);
            res.json({ message: "Your information has been sucessfully updated"})

        });
}
//get all users
router.get('/', (req, res) => {
    console.log('user', req.user);
    con.query('CALL get_all()',
        (err, rows) => {
            if (err) throw err;
            res.json({ message: "The list of all users are as follows", data: rows[0] });
        })
});

//get specific user id
router.get('/:id', (req, res) => {

    const id = req.params.id;
    con.query(`CALL get_byid(${id})`, (err, rows) => {
        if (err) throw err;
        console.log('Distinct user id received from users:');
        console.log(rows);
        res.json({ message: "the user information for the given id is", data: rows[0] })

    });
});

//delete user from users

router.delete('/:user_id', (req, res) => {
    if(req.user.Admin){
    const user_id = req.params.user_id;
    con.query(`CALL deleteby_id(${user_id})`, (err, rows) => {
        if (err) throw err;
        console.log('Delete current employee id from users:');

        res.json({ message: "deleted user of the given id" })

    });
}
else{
    res.json({message:"You are not authorized to perform this operation"})

}
});


//approve active status by users
router.get('/approve/:user_id', (req, res) => {
   if(req.user.Admin){
    const user_id = req.params.user_id
    console.log('fsb', user_id);
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

    })
   }
   else{
       res.json({message:"You are not authorized to perform this operation"})
   }
});

//put or update new information about a user

router.put('/update',  (req, res) => {
    const body = req.body;
    if(req.user.Admin || req.user.id == body.user_id){
    console.log('testing', body);
    con.query(`CALL update_information(${body.user_id},'${body.user_name}','${body.user_email}','${body.user_phone}','${body.user_role}','${body.user_dob}','${body.user_gender}')`,
        (err, rows) => {
            if (err) throw err;
            console.log('update user id into employee:');
            console.log(rows);
            //res.json({ message: "Your information has been sucessfully updated" , data: rows })
            res.json({ message: "Your information has been sucessfully updated" , data: req.body })
        });
    }
    else
    {
        res.json({message:"You are not authrorized to perform this operation"})
   }

});



//update password

router.put('/users/password' ,async(req, res) => {

    const body = req.body
    const user = req.user;
    if(req.user.id == body.user_id){
    
    let newpwd  = await utility.hashPassword(body.user_password)  //await promise
    console.log('hash',newpwd)
    con.query(`update users set user_password='${newpwd}' where user_id = '${body.user_id}'`,
        (err, rows) => {
            if (err) throw err;
            console.log('update user password :');
    
            res.json({ message: "Your password has been sucessfully updated" })

        });
    }
    else{
        res.json({message:" You are not authorized to perform this operation"})
    }
});


module.exports = router;