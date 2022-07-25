const userModel = require('../models/userModel');

const createUser = async function(req, res) {
    try {
        let data = req.body;

        if(Object.keys(data).length > 0) {
            res.status(400).send({status: 'false', message: "All fields are mandatory"});
        }
        let savedUser = await userModel.create(data); 
        if(savedUser) {
            res.status(201).send({status: 'true', message: "user has been created", data: savedUser})
        } 
    } catch(err) {
        res.status(500).send(err.message);
    }
}

module.exports.createUser = createUser;