const productModel = require("../models/productModel");
const { uploadFile } = require("../aws/awsUpload");
const validation = require("../validator/validation");

let {
  isEmpty,
  isValidName,
  isValidImage,
  isValidPrice,
  isValidInstallment,
  isValidObjectId,
  isValidSize,
} = validation;

// ========> Create Product Api <=================
const createProduct = async function (req, res) {
  try {
    let data = req.body;
    let productImage = req.files;

    if (Object.keys(data).length == 0 && productImage.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are mandatory" });
    }
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

    if (!isEmpty(title)) {
      res
        .status(400)
        .send({ status: "false", message: "title must be present" });
    }

    if (!isEmpty(description)) {
      res
        .status(400)
        .send({ status: "false", message: "description must be present" });
    }
    if (!isEmpty(price)) {
      res
        .status(400)
        .send({ status: "false", message: "price must be present" });
    }
    if (!isEmpty(currencyId)) {
      res
        .status(400)
        .send({ status: "false", message: "currencyId must be present" });
    }
    if (!isEmpty(currencyFormat)) {
      res
        .status(400)
        .send({ status: "false", message: "currency format must be present" });
    }
    if (title) {
      if (!isValidName(title)) {
        res.status(400).send({
          status: false,
          message: "title should include alphabets only",
        });
      }
    }
    let checkTitle = await productModel.findOne({ title: title });
    if (checkTitle) {
      res
        .status(400)
        .send({ status: false, message: "title is already present" });
    }
    if (currencyId !== "INR") {
      res.status(400).send({
        status: false,
        message: "currencyId should be in INR format only",
      });
    }
    if (currencyFormat !== "₹") {
      res
        .status(400)
        .send({ status: false, message: "currencyFormat should be '₹' only" });
    }
    if (currencyId == "INR") {
      currencyFormat == "₹";
    }
    if (!isValidName(style)) {
      res.status(400).send({
        status: false,
        message: "style should include alphabets only",
      });
    }
    if (!isValidPrice(price)) {
      return res.status(400).send({
        status: false,
        msg: "Invalid Price! price should contain digits only",
      });
    }
    let product = {};
    if (availableSizes) {
      if (!isEmpty(availableSizes)) {
        return res
          .status(400)
          .send({ status: false, msg: "available Sizes must be present" });
      }
      if (availableSizes) {
        let validSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        let InputSizes = availableSizes
          .toUpperCase()
          .split(",")
          .map((s) => s.trim());
        for (let i = 0; i < InputSizes.length; i++) {
          if (!validSizes.includes(InputSizes[i])) {
            return res.status(400).send({
              status: false,
              message: "availableSizes must be [S, XS, M, X, L, XXL, XL]",
            });
          }
        }
        product.availableSizes = [...new Set(InputSizes)];
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
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ==============> Get Filtered Product <================
const getProduct = async function (req, res) {
  try {
    let filterQuery = req.query;
    let query = {};
    let { size, name, priceGreaterThen, priceLessThen, priceSort } =
      filterQuery;

    //validation for size
    if (size || size == "") {
      if (!isEmpty(size)) {
        return res
          .status(400)
          .send({ status: false, message: "plz Enter Size" });
      }
      if (!isValidSize(size)) {
        return res.status(400).send({
          status: false,
          message: "Please Provide Available Sizes from S,XS,M,X,L,XXL,XL",
        });
      }
      query.availableSizes = size;
    }
    //validation for name
    if (name || name == "") {
      if (!isEmpty(name)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please enter name" });
      }
      if (!isValidName(name)) {
        return res
          .status(400)
          .send({ status: false, message: "plz Enter a valid name" });
      }
      query["title"] = { $regex: name };
    }
    //validation for  price greater than
    if (priceGreaterThen || priceGreaterThen == "") {
      if (!isEmpty(priceGreaterThen)) {
        return res
          .status(400)
          .send({ status: false, msg: "Please enter price greater than" });
      }
      if (!isValidPrice(priceGreaterThen)) {
        return res
          .status(400)
          .send({ status: false, message: "plz Enter a value" });
      }
      query["price"] = { $gte: priceGreaterThen };
    }
    //validation for  price greater than
    if (priceLessThen || priceLessThen == "") {
      if (!isEmpty(priceLessThen)) {
        return res
          .status(400)
          .send({ status: false, message: "Please enter price lesser than" });
      }
      if (!isValidPrice(priceLessThen)) {
        return res
          .status(400)
          .send({ status: false, message: "plz Enter a value" });
      }
      query["price"] = { $lte: priceLessThen };
    }
    if (priceGreaterThen && priceLessThen) {
      query["price"] = { $gte: priceGreaterThen, $lte: priceLessThen };
    }
    //sorting
    if (priceSort) {
      if (priceSort != "-1" && priceSort != "1") {
        return res.status(400).send({
          status: false,
          message:
            "You can only use 1 for Ascending and -1 for Descending Sorting",
        });
      }
    }

    let getAllProduct = await productModel
      .find(query)
      .sort({ price: priceSort, isDeleted: false });
    if (!(getAllProduct.length > 0)) {
      return res.status(404).send({
        status: false,
        message: "Products Not Found",
      });
    }
    return res.status(200).send({
      status: true,
      count: getAllProduct.length,
      message: "Success",
      data: getAllProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error",
      error: err.message,
    });
  }
};

// ==============> Get Product By Id <================

let productById = async function (req, res) {
  try {
    let productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid productId!" });
    }
    let checkProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!checkProduct) {
      return res.status(400).send({
        status: false,
        message: "Product not available by this particular id",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "Product available", data: checkProduct });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =================> Update Product Api <====================

const updateProduct = async function (req, res) {
  try {
    let data = req.body;
    const productImage = req.files;
    let productId = req.params.productId;

    if (productId.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "Error! Please provide product Id." });
    }
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid productId!" });
    }
    let checkProductId = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!checkProductId) {
      return res
        .status(400)
        .send({ status: false, message: "Product not available by this id" });
    }

    if (Object.keys(data).length == 0 && productImage.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "All fields are mandatory" });
    }

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

    let product = {};

    if (title || title == "") {
      if (!isEmpty(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Title must be present" });
      }
      if (!isValidName(title)) {
        return res.status(400).send({
          status: false,
          message: "Title should include alphabetical characters only",
        });
      }
      let checkTitle = await productModel.findOne({
        title: title,
        isDeleted: false,
      });
      if (checkTitle) {
        return res.status(400).send({
          status: false,
          message: "Title already exists by the same name",
        });
      }
      product.title = title;
    }

    if (description || description == "") {
      if (!isEmpty(description)) {
        return res
          .status(400)
          .send({ status: false, message: "Description must be present" });
      }
      if (!isValidName(description)) {
        return res.status(400).send({
          status: false,
          message: "Title should include alphabetical characters only",
        });
      }
      let checkDescription = await productModel.findOne({
        description: description,
        isDeleted: false,
      });
      if (checkDescription) {
        return res.status(400).send({
          status: false,
          message: "Description already exists by the same name",
        });
      }
      product.description = description;
    }
    if (price || price == "") {
      if (!isValidPrice(price)) {
        return res.status(400).send({
          status: false,
          message: "Enter a valid price! only digits allowed",
        });
      }
      product.price = price;
    }
    if (currencyId || currencyId == "") {
      if (!isEmpty(currencyId)) {
        return res
          .status(400)
          .send({ status: false, message: "curreny must be present" });
      }
      if (currencyId != "INR")
        return res.status(400).send({
          status: false,
          message: "At this time only 'INR' currency is allowed",
        });
      product.currencyId = currencyId;
    }

    if (style || style == "") {
      if (!isEmpty(style)) {
        return res
          .status(400)
          .send({ status: false, message: "style must be present" });
      }
      if (!isValidName(style)) {
        return res.status(400).send({
          status: false,
          message: "style should include alphanumeric characters only",
        });
      }
      product.style = style;
    }
    if (installments || installments == "") {
      if (!isEmpty(installments)) {
        return res
          .status(400)
          .send({ status: false, msg: "installments must be present" });
      }
      if (!isValidInstallment(installments))
        return res.status(400).send({
          status: false,
          message: "installments should be +ve number only",
        });
      product.installments = installments;
    }
    if (availableSizes) {
      if (!isEmpty(availableSizes)) {
        return res
          .status(400)
          .send({ status: false, msg: "available Sizes must be present" });
      }
      if (availableSizes) {
        let validSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
        let InputSizes = availableSizes
          .toUpperCase()
          .split(",")
          .map((s) => s.trim());
        for (let i = 0; i < InputSizes.length; i++) {
          if (!validSizes.includes(InputSizes[i])) {
            return res.status(400).send({
              status: false,
              message: "availableSizes must be [S, XS, M, X, L, XXL, XL]",
            });
          }
        }
        product.availableSizes = [...new Set(InputSizes)];
      }
    }

    if (productImage && productImage.files == "") {
      if (productImage.length > 1)
        return res
          .status(400)
          .send({ status: false, message: "only one image at a time" });
      let uploadedFileURL = await uploadFile(productImage[0]);
      product.productImage = uploadedFileURL;
    } else {
      return res.status(400).send({ status: false, message: "No file found!"})
    }
    let updatedProduct = await productModel.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      product,
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ===========> Delete Product Api <================
const deleteProduct = async function (req, res) {
  try {
    const productId = req.params.productId;

    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "productId is invailid" });
    }
    let checkProductId = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!checkProductId) {
      return res.status(404).send({
        status: false,
        message: "no product found for this particulat id",
      });
    }
    const deleteProduct = await productModel.findByIdAndUpdate(
      checkProductId._id,
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );
    return res.status(200).send({
      status: true,
      message: "Product Deleted Successfully",
      data: deleteProduct,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createProduct,
  getProduct,
  productById,
  updateProduct,
  deleteProduct,
};
