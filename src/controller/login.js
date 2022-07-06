const userModel =require("../model/userModel")
const jwt = require("jsonwebtoken")

const userLogin = async function(req,res){
    let email=req.body.email;
    let password=req.body.password
    if(!(email && password)) return res.status(400).send({status:false,msg:"Please enter valid email & password"})

    let user = await userModel.findone({email:email,password:password})
    if(!user) return res.status(400).send({status:false,msg:"No such user exist"})

    let token = jwt.sign({
        userId:user._id.toString(),
        batch:"radon",
        organisation:"functionUp"
    },
        "Project_3_Group-64"
        )
        res.setHeader("x-api-key",token)
        return res.status(201).send({status:true,msg:"sucessfully login",data:token})
    }