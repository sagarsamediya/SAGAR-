const userModel =require("../model/userModel")
const jwt = require("jsonwebtoken")
const isValidRequestBody= require('../validation/validation')

const userLogin = async function(req,res){
    
    let email=req.body.email;
    let password=req.body.password
    //if (!(isValidRequestBody(data))) return res.status(400).send({ status: false, msg: "data is empty" });
    if(!(email)) return res.status(400).send({status:false,msg:"email is required"})
    if(!(password)) return res.status(400).send({status:false,msg:"password is required"})

    let user = await userModel.findOne({email:email,password:password});
    if(!user) return res.status(400).send({status:false,msg:"Please enter valid email and password"})
    
    let token = jwt.sign(
        {
            userId: user._id.toString(),
            iat: Math.floor(Date.now()/1000),
            ext: Math.floor(Date.now()/1000)+10*60*60 
        },
        "project_3_Group-64"               
    )
        res.setHeader("x-api-key",token)
        return res.status(201).send({status:true,msg:"  sucessfully login",token: token})
        
    }

    module.exports.userLogin = userLogin;