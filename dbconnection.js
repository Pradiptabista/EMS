const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    database : "ems",
    user: "root",
    password: "slowly 12"
});

con.connect(function (err) {
    if (err) {
        console.log('Connection error')
        throw err;
    }
    console.log("Connected!");
});


module.exports=con