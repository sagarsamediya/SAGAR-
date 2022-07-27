const productModel = require("../models/productModel");
const { uploadFile } = require("../aws/awsUpload");
const validation = require("../validator/validation");

let { isEmpty, isValidName, isValidSize, isValidImage, isValidPrice} = validation;

const createProduct = async function (req, res) {
  try {
    let data = req.body;
    let productImage = req.files;

    // if(Object.keys(data).length == 0) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "All fields are mandatory" });
    // }
    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      style,
      availableSizes,
      installments,
    } = data;

    if(!isEmpty(title)) {
      res
        .status(400)
        .send({ status: "false", message: "title must be present" });
    }

    if(!isEmpty(description)) {
      res
        .status(400)
        .send({ status: "false", message: "description must be present" });
    }
    if(!isEmpty(price)) {
      res
        .status(400)
        .send({ status: "false", message: "price must be present" });
    }
    if(!isEmpty(currencyId)) {
      res
        .status(400)
        .send({ status: "false", message: "currencyId must be present" });
    }
    if(!isEmpty(currencyFormat)) {
      res
        .status(400)
        .send({ status: "false", message: "currency format must be present" });
    }
    if (title) {
      if (!isValidName(title)) {
        res
          .status(400)
          .send({
            status: false,
            message: "title should include alphabets only",
          });
      }
    }
    let checkTitle = await productModel.findOne({ title: title}) 
    if(checkTitle) {
        res.status(400).send({status: false, message: "title is already present"});
    }
    if (currencyId !== "INR") {
      res
        .status(400)
        .send({
          status: false,
          message: "currencyId should be in INR format only",
        });
    }
    if (currencyFormat !== "₹") {
      res
        .status(400)
        .send({ status: false, message: "currencyFormat should be '₹' only" });
    }
    if (!isValidName(style)) {
      res
        .status(400)
        .send({
          status: false,
          message: "style should include alphabets only",
        });
    }
    if(!isValidPrice(price)) {
        return res.status(400).send({status: false, msg: "Invalid Price! price should contain digits only"})
    }
    // if (!isValidImage(productImage[0])) {
    //   return res.status(400).send({
    //     status: false,
    //     message: "image format should be jpeg/jpg/png only",
    //   });
    // }
    if (availableSizes) {
      if (!isValidSize(availableSizes)) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "Sizes only include S,XS, M,X,L,XXL,Xl only",
          });
      }
    }
    if (installments) {
      if (!isValidInstallment(installments)) {
        return res
          .status(400)
          .send({ status: false, msg: "Installments should be digits only" });
      }
    }
    if (productImage && productImage.length > 0) {
      let uploadFileURL = await uploadFile(productImage[0]);
      data.productImage = uploadFileURL;
    } else {
      return res.status(400).send({ status: false, msg: "No file found" });
    }
    let savedProduct = await productModel.create(data);
    return res.status(201).send({
      status: true,
      message: "Product saved successfully",
      data: savedProduct,
    });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createProduct };
