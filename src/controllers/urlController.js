const urlModel = require("../models/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");
const { isValid } = require("shortid");

//----------------------------------------------------------------------------------------
//                                1. API -  POST/url/shorten
//----------------------------------------------------------------------------------------

const createUrl = async function (req, res) {
  try {
    console.log("Create URL.");
    const body = req.body;
    if(Object.keys.value(length===0)) return res.status(400).send({status:false, msg: "body can not be empty"})
   
    const{longUrl} = body;
    if(!isValid(longUrl))  return res.status(400).send({status:false, msg: "provide valid longUrl"})
    // let { longUrl } = req.body ; 
    // let shortUrl ;
    // let urlCode ;
    let  checkLongUrl = await urlModel.findOne({longUrl: longUrl})
    if(checkLongUrl) return res.status(400).send({status: false , msg: "Already exit url"})

    let createUrl = await urlModel.create(body);
    return res.status(201).send({status: true,message: "Successfully Generated Short URL.",data: "[]"});

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//----------------------------------------------------------------------------------------
//                                2. API -  GET/:urlCode
//----------------------------------------------------------------------------------------

const getUrl = async function (req, res) {
  try {
    console.log("GET URL.");
     
    return res.status(200).send({
      status: true,
      message: "Successfully Fetched URL.",
      data: "[]",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getUrl };
