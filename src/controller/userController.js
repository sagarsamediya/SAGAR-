const { validate } = require("../model/userModel");
const userModel = require("../model/userModel");


const {isValid,isValidName,isValidEmail,isValidMobile,isValidPassword,isValidRequestBody} =require("../validation/validation")


const createUser = async function (req, res) {
    try {
        let userBody = req.body;
       

        if (!isValidRequestBody(userBody)) {
            return res.status(400).send({ status: false, msg: "userDetails must be provided" });
        }

        let { title, name, phone, email, password, address } = userBody // destructuring
        //  validation
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is required" })
        if (!isValid(name)) return res.status(400).send({ status: false, msg: "name is required" })
        if (!isValid(phone)) return res.status(400).send({ status: false, msg: "phone is required" })
        if (!isValid(email)) return res.status(400).send({ status: false, msg: "Email is required" })
        if (!isValid(password)) return res.status(400).send({ status: false, msg: "password is required" })
        if (!isValid(address)) return res.status(400).send({ status: false, msg: "address is required" })

        //---------title validation
        if (!["Mr", "Miss", "Mrs"].includes(title)) {
            return res.status(400).send({ status: false, msg: "Title must includes['Mr','Miss','Mrs']" })
        }

        //------match name with regex
        if (!isValidName(name))
            return res.status(400).send({ status: false, msg: "Please use valid type of name" })
        

        //-------match phone with regex
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, msg: "please provide a valid phone Number" })
        }
        let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, msg: 'Phone already exists' })
        }

        //-------match email with regex
        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "Please provide a email in correct format" })
        }

         //--------match password with regex
         if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "Please use first letter in uppercase, lowercase and number with min. 8 lengthand maxi 15 length" })
        }

        

        //check if email is already in use
        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, msg: 'email already exists' })
        }
        //----------addressValidation
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: 'address is required' })
        }
        if (address) {
            if (!isValid(address.street)) {
                return res.status(400).send({ status: false, message: 'street is required' })
                
            }
            //address match with regex 
            if ((!isValid(address.city))|| !(/^[a-zA-Z]*$/).test(address.city)) {
                return res.status(400).send({ status: false, message: 'city is required' })
               
            }
            //pincode match with regex
            if ((!isValid(address.pincode)) || !(/^\d{6}$/).test(address.pincode) ) {
                return res.status(400).send({ status: false, message: 'Enter the pincode and only in 6 digits'})
            }
        }

        let newUser = await userModel.create(userBody);
        return res.status(201).send({ status: true, msg: "user created successfully", data: newUser })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: "message error" })
    }
}

module.exports = { createUser }