const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
  try {
    token = req.headers["x-api-key"];
    if (!token) {
      return res.status(400).send({ status: false, msg: "Token required here" });
    }

    jwt.verify(token, "project_3_Group-64", { ignoreExpiration: true }, function (error, decodedToken) {
      if (error) {
        return res.status(400).send({ status: false, msg: "Token is invalid!" });
      } else {
        if (Date.now() > decodedToken.exp * 1000) {
          return res.status(401).send({ status: false, msg: "Session Expired" });
        }
        
        req.loggedInUser= decodedToken.userId;
        //return res.status(200).send({ status: true, tokenContains:decodedToken });
        
        next();

      }
    }
    )

  //   let token = jwt.sign(
  //     { userId: user._id.toString(), iat: Math.floor(new Date().getTime() / 1000) },

  //     "project_3_Group-64", { expiresIn:"6000s" }
  // );
  // let decode= jwt.verify(token,"project_3_Group-64")
  // let date=decode.iat
  // let time= new Date(date*1000).toString()
  // res.status(200).send({ status: true, message: "Successfully loggedin",iat:time, token: token });
    

  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
};


module.exports = { authentication }