const userModel = require("../model/userModel");


const createUser = async function(req,res) {
    let data = req.body;
    let savedData = await userModel.create(data);
    res.send({status: true,data:savedData})
}

module.exports={createUser}