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
    

  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
};


module.exports = { authentication }