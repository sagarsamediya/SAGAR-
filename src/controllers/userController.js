const userModel = require("../models/userModel");
const { uploadFile } = require("../aws/awsUpload");
const validation = require("../validator/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let {
  isEmpty,
  isValidName,
  isValidPhone,
  isValidPassword,
  isValidpincode,
  isValidEmail,
  isValidObjectId,
  isValidImage,
} = validation;

// ========> Create User Api <=================
const createUser = async function (req, res) {
  try {
    let data = req.body;
    let profileImage = req.files;
    console.log(profileImage);

    if (Object.keys(data).length == 0 || profileImage.length == 0) {
      res
        .status(400)
        .send({ status: "false", message: "All fields are mandatory" });
    }

    let { fname, lname, email, phone, password, address } = data;

    if (!isEmpty(fname)) {
      res
        .status(400)
        .send({ status: "false", message: "fname must be present" });
    }
    if (!isEmpty(lname)) {
      res
        .status(400)
        .send({ status: "false", message: "lname must be present" });
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
    if (!isValidName(lname)) {
      res.status(400).send({
        status: "false",
        message: "last name must be in alphabetical order",
      });
    }
    if (!isValidPhone(phone)) {
      res
        .status(400)
        .send({ status: "false", message: "Provide a valid phone number" });
    }
    if (!isValidPassword(password)) {
      res.status(400).send({
        status: "false",
        message:
          "Password must contain atleast 8 characters including one upperCase, lowerCase, special characters and Numbers",
      });
    }
    if (!isValidName(fname)) {
      res.status(400).send({
        status: "false",
        message: "first name must be in alphabetical order",
      });
    }
    if (!isValidEmail(email)) {
      res.status(400).send({
        status: "false",
        message: "provide a valid emailId",
      });
    }

    // ------- Address Validation  --------
    if (address) {
      data.address = JSON.parse(address);
      if (address.shipping) {
        // let { street, city, pincode } = address.shipping;
        if (!isEmpty(address.shipping.street)) {
          res
            .status(400)
            .send({ status: "false", message: "street must be present" });
        }
        if (!isEmpty(address.shipping.city)) {
          res
            .status(400)
            .send({ status: "false", message: "city must be present" });
        }
        if (!isEmpty(address.shipping.pincode)) {
          res
            .status(400)
            .send({ status: "false", message: "pincode must be present" });
        }
        if (!isValidName(address.shipping.street)) {
          res.status(400).send({
            status: "false",
            message: "street should be in alphabetical order",
          });
        }
        if (!isValidName(address.shipping.city)) {
          res.status(400).send({
            status: "false",
            message: "city should be in alphabetical order",
          });
        }
        if (!isValidpincode(address.shipping.pincode)) {
          res.status(400).send({
            status: "false",
            message: "pincode should be digits only",
          });
        }
      }
      if (address.billing) {
        // let { street, city, pincode } = address.billing;
        if (!isEmpty(address.billing.street)) {
          res
            .status(400)
            .send({ status: "false", message: "street must be present" });
        }
        if (!isEmpty(address.billing.city)) {
          res
            .status(400)
            .send({ status: "false", message: "city must be present" });
        }
        if (!isEmpty(address.billing.pincode)) {
          res
            .status(400)
            .send({ status: "false", message: "pincode must be present" });
        }
        if (!isValidName(address.billing.street)) {
          res.status(400).send({
            status: "false",
            message: "street should be in alphabetical order",
          });
        }
        if (!isValidName(address.billing.city)) {
          res.status(400).send({
            status: "false",
            message: "city should be in alphabetical order",
          });
        }
        if (!isValidpincode(address.billing.pincode)) {
          res.status(400).send({
            status: "false",
            message: "pincode should be digits only",
          });
        }
      }
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
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
      if (!["image/png", "image/jpeg"].includes(files[0].mimetype))
        return res.status(400).send({
          status: false,
          message: "only png,jpg,jpeg files are allowed from productImage",
        });
      let uploadFileURL = await uploadFile(profileImage[0]);
      console.log(uploadFileURL);
      data.profileImage = uploadFileURL;
    } else {
      return res.status(400).send({ status: false, msg: "No file found" });
    }
    let savedUser = await userModel.create(data);
    res.status(201).send({
      status: true,
      message: "user has been created successfully",
      data: savedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "false", msg: err.message });
  }
};

// ==========> User Login Api <================

const userLogin = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are mandatory" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "Email must be present" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Password must be present" });
    }

    let checkEmail = await userModel.findOne({
      email: email,
    });
    if (!checkEmail) {
      return res.status(401).send({
        status: false,
        message: "Email is incorrect please provide a valid Email",
      });
    }
    let checkPassword = await bcrypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      return res.status(401).send({
        status: false,
        message: "Password is incorrect please provide a valid password",
      });
    }
    let token = jwt.sign(
      {
        userId: checkEmail._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, //expires in 24 hr
      },
      "group1Project5"
    );
    res.setHeader("x-api-key", token);
    res.status(200).send({
      status: true,
      message: "User Login Successful",
      data: { userId: checkEmail._id, token: token },
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// ==========> Get Users Data <================

const getUser = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userLoggedIn = req.tokenData.userId;

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid userId" });
    }

    if (userId != userLoggedIn) {
      return res
        .status(403)
        .send({ status: false, msg: "Error, authorization failed" });
    }

    let checkData = await userModel.findOne({ _id: userId });

    if (!checkData) {
      return res.status(404).send({ status: false, message: "No data found" });
    }
    return res.status(200).send({
      status: true,
      message: "Users Profile Details",
      data: checkData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// ===========> Update Users Data <=============

const updateUsersProfile = async function (req, res) {
  try {
    const data = req.body;
    const userId = req.params.userId;
    const profileImage = req.files;

    //checks if user id is coming in request or not
    if (!userId) {
      return res.send({
        status: false,
        message: "Error! Please provide user id",
      });
    }
    //Validate body
    if (Object.keys(data).length == 0 && profileImage.length == 0) {
      return res.status(400).send({
        status: false,
        message: "All fields are mandatory",
      });
    }

    //check if userid is valid
    if (!isValidObjectId(userId)) {
      return res.status(400).send({
        status: false,
        message: "invalid userId",
      });
    }

    const checkUser = await userModel.findOne({ _id: userId });
    if (!checkUser) {
      return res.status(404).send({
        status: false,
        message: "User does not exist",
      });
    }

    let { fname, lname, email, phone, password, address } = data;
    // console.log(address);
    let updatedData = {};
    //validation for fname
    if (fname) {
      if (!isValidName(fname)) {
        return res.status(400).send({ status: false, msg: "Invalid fname" });
      }
      updatedData.fname = fname;
    }
    //validation for lname
    if (lname) {
      if (!isValidName(lname)) {
        return res.status(400).send({ status: false, msg: "Invalid lname" });
      }
      updatedData.lname = lname;
    }
    //validation for mail
    if (email) {
      if (!isValidEmail(email)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid email id" });
      }
      const checkEmail = await userModel.findOne({ email: email });
      if (checkEmail) {
        return res
          .status(400)
          .send({ status: false, message: "email id already exist" });
      }
      updatedData.email = email;
    }
    //validation of phone
    if (phone) {
      if (!isValidPhone(phone)) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid phone number" });
      }

      const checkPhone = await userModel.findOne({ phone: phone });
      if (checkPhone) {
        return res
          .status(400)
          .send({ status: false, message: "phone number already exist" });
      }
      updatedData.phone = phone;
    }
    // Updating of password
    if (password) {
      if (!isValidPassword(password)) {
        return res.status(400).send({
          status: false,
          message:
            "Password must contain atleast 8 characters including one upperCase, lowerCase, special characters and Numbers",
        });
      }
      // hashing password  
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      data.password = hash;
    }
    //update profile Image
    if (productImage || productImage.files == "") {
      if (productImage.length > 1)
        return res
          .status(400)
          .send({ status: false, message: "only one image at a time" });
      if (!["image/png", "image/jpeg"].includes(files[0].mimetype))
        return res
          .status(400)
          .send({
            status: false,
            message: "only png,jpg,jpeg files are allowed from productImage",
          });
      let uploadedFileURL = await uploadFile(productImage[0]);
      product.productImage = uploadedFileURL;
    }
    //update address
    address = JSON.parse(address);
    // if (address in data) {
      // console.log(address);
      let {shipping, billing} = address;
      if (shipping) {
        let {street, city,pincode} = shipping;
        if (street || street == "") {
          if(!isEmpty(street)) {
            return res.status(400).send({status: false, msg: "street must be present"})
          }
          if (!isValidName(street)) {
            return res.status(400).send({
              status: false,
              message: "Please provide valid street name",
            });
          }
          updatedData.address.shipping.street = street;
        }
        if (city || city == "") {
          if(!isEmpty(city)) {
            return res.status(400).send({status: false, msg: "city must be present"})
          }
          if (!isValidName(city)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide city" });
          }
          updatedData.address.shipping.city = city;
        }
        if (pincode) {
          if (typeof pincode !== "number") {
            return res.status(400).send({
              status: false,
              message: "Please provide pincode in number format",
            });
          }
          // Validate shipping pincode
          if (!isValidpincode(pincode)) {
            return res
              .status(400)
              .send({ status: false, msg: "Invalid Shipping pincode" });
          }
          updatedData.address.shipping.pincode = pincode;
        }
      }
      if (billing) {
        let {street, city, pincode} = billing
        if (street || street == "") {
          if(!isEmpty(street)) {
            return res.status(400).send({status: false, msg: "street must be present"})
          }
          if (!isValidName(street)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide valid street" });
          }
          updatedData.address.billing.street = street;
        }
        if (city || city == "") {
          if(!isEmpty(city)) {
            return res.status(400).send({status: false, msg: "city must be present"})
          }
          if (!isValidName(city)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide valid city" });
          }
          updatedData.address.billing.city = city;
        }
        if (pincode || pincode == "") {
          if (typeof pincode !== "number") {
            return res.status(400).send({
              status: false,
              message: "Please provide pincode in number format",
            });
          }
          // Validate billing pincode
          if (!isValidpincode(pincode)) {
            return res
              .status(400)
              .send({ status: false, msg: "Invalid billing pincode" });
          }
          updatedData.address.billing.pincode = pincode;
        }
      }
    // }
    // address = JSON.parse(address)
    updatedData.address = address;
    const profileUpdated = await userModel.findOneAndUpdate(
      { _id: userId },
      updatedData,
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: "User profile updated",
      data: profileUpdated,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createUser, userLogin, getUser, updateUsersProfile };
