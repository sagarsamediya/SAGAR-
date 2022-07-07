const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const booksModel = require('../controller/bookController')


const authentication = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

    
    //if (token.length != token)  res.status(400).send({ status: false, msg: "length of token is invalid " });
    let decodedToken = jwt.verify(token, "project_3_Group-64");
    //console.log(decodedToken)
    if (!decodedToken) return res.status(404).send({ status: false, msg: "token is not valid" })
    
        
      req.loggedInUser = decodedToken.userId   //  MAKING IT ACESSECIABLLE ANY WAHERE

    next();
    } catch (err) {
    return res.status(500).send({ msg: "Error", msg: err.message });
  }
};

// const authorization = function(req,res,next){
//     try{
//     //req.params.bookId != req.loggedInUser
//       res.status(403).send({status:false,msg:'unauthorize user'})
//       next();
// }catch (err) {
//     return res.status(500).send({ msg: "Error", error: err.message });
//   }
// }

module.exports = { authentication }