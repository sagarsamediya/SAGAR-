const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-Api-key"];
    if (!token)
      {return res.status(400).send({ status: false, msg: "token must be present" })};

    
    if (token.length != 215){ return res.status(400).send({ status: false, msg: "token must be valid" })};
    let decodedToken = jwt.verify(token, "project_3_Group-64");
    //console.log(decodedToken)
    if (decodedToken.length ==0){
      return res.status(404).send({ status: false, msg: "token is not valid" })};
    next();
    } catch (err) {
    return res.status(500).send({ msg: "Error", error: err.message });
  }
};