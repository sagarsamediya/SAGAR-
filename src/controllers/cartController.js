const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const validation = require("../validator/validation");

const { isEmpty, isValidObjectId } = validation;

// ==========> Create Cart Api <=============
const createCart = async (req, res) => {
  try {
    let data = req.body;
    let userLoggedIn = req.tokenData.userId;
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty" });

    let userId = req.params.userId;
    if (!isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid userId Id" });

    //getting token from req in auth
    if (userId != userLoggedIn) {
      return res
        .status(403)
        .send({ status: false, msg: "Error, authorization failed" });
    }
    let { productId, cartId, quantity } = data;
    if (!isEmpty(productId))
      return res
        .status(400)
        .send({ status: false, message: "productId required" });
    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid product ID" });

    if (!quantity) {
      quantity = 1;
    }

    quantity = Number(quantity);
    if (typeof quantity !== "number")
      return res
        .status(400)
        .send({ status: false, message: "quantity must be a number" });
    if (quantity < 1)
      return res
        .status(400)
        .send({ status: false, message: "quantity cannot be less then 1" });

    // checking cartId
    if (cartId) {
      if (!isValidObjectId(cartId))
        return res
          .status(400)
          .send({ status: false, message: "Invalid cart ID" });
    }

    //checking for valid user
    let validUser = await userModel.findOne({ _id: userId });
    if (!validUser)
      return res
        .status(404)
        .send({ status: false, message: "User does not exists" });

    if (cartId) {
      var findCart = await cartModel.findOne({ _id: cartId });
      if (!findCart)
        return res
          .status(404)
          .send({ status: false, message: "Cart does not exists" });
    }

    // user authorization
    if (validUser._id.toString() !== userLoggedIn)
      return res
        .status(403)
        .send({ status: false, message: "Unauthorized access" });

    //searching for product
    let validProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!validProduct)
      return res.status(404).send({
        status: false,
        message: "No products found or product has been deleted",
      });

    let validCart = await cartModel.findOne({ userId: userId });
    if (!validCart && findCart) {
      return res
        .status(403)
        .send({ status: false, message: "Cart does not belong to this user" });
    }
    if (validCart) {
      if (cartId) {
        if (validCart._id.toString() != cartId)
          return res.status(403).send({
            status: false,
            message: "Cart does not belong to this user",
          });
      }
      let productidincart = validCart.items;
      let uptotal =
        validCart.totalPrice + validProduct.price * Number(quantity);
      let proId = validProduct._id.toString();
      for (let i = 0; i < productidincart.length; i++) {
        let productfromitem = productidincart[i].productId.toString();

        //updates old product i.e QUANTITY
        if (proId == productfromitem) {
          let oldQuant = productidincart[i].quantity;
          let newquant = oldQuant + quantity;
          productidincart[i].quantity = newquant;
          validCart.totalPrice = uptotal;
          await validCart.save();
          return res
            .status(200)
            .send({ status: true, message: "Success", data: validCart });
        }
      }
      //adds new product
      validCart.items.push({
        productId: productId,
        quantity: Number(quantity),
      });
      let total = validCart.totalPrice + validProduct.price * Number(quantity);
      validCart.totalPrice = total;
      let count = validCart.totalItems;
      validCart.totalItems = count + 1;
      await validCart.save();
      return res
        .status(200)
        .send({ status: true, message: "Success", data: validCart });
    }

    // 1st time cart
    let calprice = validProduct.price * Number(quantity);
    let obj = {
      userId: userId,
      items: [
        {
          productId: productId,
          quantity: quantity,
        },
      ],
      totalPrice: calprice,
    };
    obj["totalItems"] = obj.items.length;
    let result = await cartModel.create(obj);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: result });
  } catch (err) {
    return res.status(500).send({ status: false, err: err.message });
  }
};

// =========> Get Users Cart Details Api <============
const getCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userLoggedIn = req.tokenData.userId;

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid userId" });
    }

    let checkData = await userModel.findOne({ _id: userId });

    if (!checkData) {
      return res.status(404).send({ status: false, message: "No data found" });
    }
    if (checkData._id.toString() != userLoggedIn) {
      return res
        .status(403)
        .send({ status: false, msg: "Error, authorization failed" });
    }

    let checkCart = await cartModel.findOne({ userId: userId }).select({"items._id":0, __v:0});

    if(!checkCart) {
      return res.status(404).send({ status: false, message: "no cart found with this userId"})
    }
    return res.status(200).send({
      status: true,
      message: "Users Profile Details",
      data: checkCart,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

// =========> Delete Users Cart Details Api <============
const deleteCart = async function (req, res) {
  try {
    let userId = req.params.userId;
    let userLoggedIn = req.tokenData.userId;

    if (!isValidObjectId(userId)) {
      return res.status(400).send({ status: false, msg: "Invalid userId" });
    }

    let checkData = await userModel.findOne({ _id: userId });

    if (!checkData) {
      return res.status(404).send({ status: false, message: "No data found" });
    }
    if (checkData._id.toString() != userLoggedIn) {
      return res
        .status(403)
        .send({ status: false, msg: "Error, authorization failed" });
    }

    let checkCart = await cartModel.findOneAndUpdate({ userId: userId }, {items:[], totalPrice: 0, totalItems: 0});

    if(!checkCart) {
      return res.status(404).send({ status: false, message: "no cart found with this userId"})
    }
    if(checkCart.items.length == 0) {
      return res.status(400).send({ status: false, message: "Cart already deleted"})
    }
    return res.status(204).send({
      status: true,
      message: "Cart has been deleted Successfully"
    }); 
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
}
module.exports = { createCart, getCart, deleteCart };
