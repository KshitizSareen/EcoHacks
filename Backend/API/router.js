const { default: axios } = require("axios");
const express = require("express");

const router = express.Router();

const con = require("../conn");

router.post("/getalldata/",(req,res)=>{
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    console.log(req.body.intime);
    let inTimeStamp = (new Date(req.body.intime)).getTime()/1000;
    console.log(inTimeStamp);
    let outTimeStamp = (new Date(req.body.outTime)).getTime()/1000;
    console.log(outTimeStamp);
    let code = req.body.code;

    let query = 'CALL RetrieveAllData('+inTimeStamp+','+outTimeStamp+','+code+');'

    con.query(query,(error, results, fields) => {
        if(error)
        {
            res.json(error);
        }
        else
        {
            let result = results[0];
            res.json(result);
        }
    })


})

router.post("/getmeandata/",(req,res)=>{
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    console.log(req.body.intime);
    let inTimeStamp = (new Date(req.body.intime)).getTime()/1000;
    console.log(inTimeStamp);
    let outTimeStamp = (new Date(req.body.outTime)).getTime()/1000;
    console.log(outTimeStamp);
    let code = req.body.code;

    let query = 'CALL RetrieveMeanData('+inTimeStamp+','+outTimeStamp+','+code+');'

    con.query(query,(error, results, fields) => {
        if(error)
        {
            res.json(error);
        }
        else
        {
            let result = results[0];
            res.json(result);
        }
    })


})

router.post("/getcountries",(req,res)=>{

    let query = 'CALL RetrieveCountries();'

    con.query(query,(error, results, fields) => {
        if(error)
        {
            res.json(error);
        }
        else
        {
            let result = results[0];
            res.json(result);
        }
    })


})

module.exports=router;