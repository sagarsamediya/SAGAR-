const userModel = require("../models/userModel");
const { uploadFile } = require("../aws/awsUpload");
const validation = require("../validator/validation");
const bcrypt = require("bcrypt");

let { isEmpty, isValidName, isValidPhone, isValidPassword, isValidPinCode } =
  validation;

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let profileImage = req.files;
    console.log(profileImage);
    if (Object.keys(data).length == 0) {
      res
        .status(400)
        .send({ status: "false", message: "All fields are mandatory" });
    }

    let { fName, lName, email, phone, password, address } = data;

    if (!isEmpty(fName)) {
      res
        .status(400)
        .send({ status: "false", message: "fName must be present" });
    }
    if (!isEmpty(lName)) {
      res
        .status(400)
        .send({ status: "false", message: "lName must be present" });
    }
    if (!isEmpty(email)) {
      res
        .status(400)
        .send({ status: "false", message: "email must be present" });
    }
    if (!isEmpty(phone)) {
      res
        .status(400)
        .send({ status: "false", message: "phone number must be present" });
    }
    if (!isEmpty(password)) {
      res
        .status(400)
        .send({ status: "false", message: "password must be present" });
    }
    if (!isEmpty(address)) {
      res
        .status(400)
        .send({ status: "false", message: "Address must be present" });
    }
    if (!isValidName(lName)) {
      res.status(400).send({
        status: "false",
        message: "lName must be in alphabetical order",
      });
    }
    if (!isValidPhone(phone)) {
      res
        .status(400)
        .send({ status: "false", message: "Provide a valid phone number" });
    }
    if (!isValidPassword(password)) {
      res
        .status(400)
        .send({ status: "false", message: "Provide a valid password" });
    }
    if (!isValidName(fName)) {
      res.status(400).send({
        status: "false",
        message: "fName must be in alphabetical order",
      });
    }

    // ------- Address Validation  --------
    if (address) {
      let checkAddress = JSON.parse(address);
      if (checkAddress.shipping) {
        // let { street, city, pinCode } = checkAddress.shipping;
        if (!isEmpty(checkAddress.shipping.street)) {
          res
            .status(400)
            .send({ status: "false", message: "street must be present" });
        }
        if (!isEmpty(checkAddress.shipping.city)) {
          res
            .status(400)
            .send({ status: "false", message: "city must be present" });
        }
        if (!isEmpty(checkAddress.shipping.pinCode)) {
          res
            .status(400)
            .send({ status: "false", message: "pinCode must be present" });
        }
        if(!isValidName(checkAddress.shipping.street)) {
            res
            .status(400)
            .send({ status: "false", message: "street should be in alphabetical order" });
        }
        if(!isValidName(checkAddress.shipping.city)) {
            res
            .status(400)
            .send({ status: "false", message: "city should be in alphabetical order" });
        }
        if(!isValidPinCode(checkAddress.shipping.pinCode)) {
            res
            .status(400)
            .send({ status: "false", message: "pinCode should be digits only" });
        }
      }
      if (checkAddress.billing) {
        // let { street, city, pinCode } = checkAddress.billing;
        if (!isEmpty(checkAddress.billing.street)) {
          res
            .status(400)
            .send({ status: "false", message: "street must be present" });
        }
        if (!isEmpty(checkAddress.billing.city)) {
          res
            .status(400)
            .send({ status: "false", message: "city must be present" });
        }
        if (!isEmpty(checkAddress.billing.pinCode)) {
          res
            .status(400)
            .send({ status: "false", message: "pinCode must be present" });
        }
        if(!isValidName(checkAddress.billing.street)) {
            res
            .status(400)
            .send({ status: "false", message: "street should be in alphabetical order" });
        }
        if(!isValidName(checkAddress.billing.city)) {
            res
            .status(400)
            .send({ status: "false", message: "city should be in alphabetical order" });
        }
        if(!isValidPinCode(checkAddress.billing.pinCode)) {
            res
            .status(400)
            .send({ status: "false", message: "pinCode should be digits only" });
        }
      }
    }

    const saltRounds = 10; 
    const hash = bcrypt.hash(password, saltRounds);
    data.password = hash;
    
    let checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      res
        .status(400)
        .send({ status: "false", message: "Email is already in use" });
    }
    let checkPhone = await userModel.findOne({ phone: phone });
    if (checkPhone) {
      res
        .status(400)
        .send({ status: "false", message: "Phone number is already in use" });
    }
    if (profileImage && profileImage.length > 0) {
      let uploadFileURL = await uploadFile(profileImage[0]);
      console.log(uploadFileURL);
      data.profileImage = uploadFileURL;
    } else {
      return res.status(400).send({ status: false, msg: "No file found" });
    }
    let savedUser = await userModel.create(data);
    res.status(201).send({
      status: "true",
      message: "user has been created successfully",
      data: savedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "false", msg: err.message });
  }
};

module.exports.createUser = createUser;
