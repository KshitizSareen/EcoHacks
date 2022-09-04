const mysql = require('mysql');

const con = mysql.createConnection({
    host: "35.235.77.86",
    user: "root",
    password: "Ks@1234567890",
    database: "TestSchema",
    port: "3306"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  
  });
  
  
  module.exports=con;