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
    let checkUser = await userModel.findOne({ _id: userId });
    if (!checkUser)
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
    if (checkUser._id.toString() !== userLoggedIn)
      return res
        .status(403)
        .send({ status: false, message: "Unauthorized access" });

    //searching for product
    let checkProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!checkProduct)
      return res.status(404).send({
        status: false,
        message: "No products found or product has been deleted",
      });

    let checkCart = await cartModel.findOne({ userId: userId });
    if (!checkCart && findCart) {
      return res
        .status(403)
        .send({ status: false, message: "Cart does not belong to this user" });
    }
    if (checkCart) {
      if (cartId) {
        if (checkCart._id.toString() != cartId)
          return res.status(403).send({
            status: false,
            message: "Cart does not belong to this user",
          });
      }
      let ProdIdInCart = checkCart.items;
      let uptotal =
        checkCart.totalPrice + checkProduct.price * Number(quantity);
      let productId = checkProduct._id.toString();
      for (let i = 0; i < ProdIdInCart.length; i++) {
        let productfromitem = ProdIdInCart[i].productId.toString();

        //updates previous product i.e QUANTITY
        if (productId == productfromitem) {
          let previousQuantity = ProdIdInCart[i].quantity;
          let updatedQuantity = previousQuantity + quantity;
          ProdIdInCart[i].quantity = updatedQuantity;
          checkCart.totalPrice = uptotal;
          await checkCart.save();
          return res
            .status(200)
            .send({ status: true, message: "Success", data: checkCart });
        }
      }
      //adds new product
      checkCart.items.push({
        productId: productId,
        quantity: Number(quantity),
      });
      let total = checkCart.totalPrice + checkProduct.price * Number(quantity);
      checkCart.totalPrice = total;
      let count = checkCart.totalItems;
      checkCart.totalItems = count + 1;
      await checkCart.save();
      return res
        .status(200)
        .send({ status: true, message: "Success", data: checkCart });
    }

    // 1st time cart
    let calprice = checkProduct.price * Number(quantity);
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

// =========> Update Users Cart Api <============
const updateCart = async function (req, res) {
  try {
    let paramsuserId = req.params.userId;
    if (!paramsuserId) {
      return res
        .status(400)
        .send({ status: false, message: "userid is required" });
    }
    if (!isValidObjectId(paramsuserId)) {
      return res.status(400).send({
        status: false,
        message: "please enter valid user Id",
      });
    }
    //if userid exist in user model
    let user = await userModel.findById(paramsuserId);
    if (!user) {
      return res
        .status(400)
        .send({ status: false, message: "user dont exist" });
    }

    let data = req.body;
    let { productId, cartId, removeProduct } = data;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "please provide Cart details",
      });
    }
    if (!isEmpty(productId)) {
      return res.status(400).send({
        status: false,
        messege: "please provide productId",
      });
    }
    if (!isValidObjectId(productId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid productId! Please provide a valid productId",
      });
    }
    const findProduct = await productModel.findOne({_id: productId, isDeleted: false});
    if (!findProduct) {
      return res
        .status(404)
        .send({ status: false, message: "product not found." });
    }
    if (findProduct.isDeleted === true) {
      return res.status(400).send({ status: false, msg: "product is deleted" });
    }

    //validation for cart ID
    if (!isEmpty(cartId)) {
      return res.status(400).send({
        status: false,
        messege: "please provide cartId",
      });
    }

    if (!isValidObjectId(cartId)) {
      return res.status(400).send({
        status: false,
        message: "invalid cartId! Please provide a valid cartId",
      });
    }
    //check if the cart is already exist or not
    const findCart = await cartModel.findOne({ paramsuserId });
    if (!findCart) {
      return res.status(404).send({
        status: false,
        message: "cart not found.",
      });
    }
    if (findCart._id != cartId) {
      return res.status(400).send({
        status: false,
        message: "CartId does't belong to this user!",
      });
    }
    //validation for remove product
    if (!isEmpty(removeProduct)) {
      return res.status(400).send({
        status: false,
        messege: "please provide items to delete",
      });
    }
    if (isNaN(Number(removeProduct))) {
      return res.status(400).send({
        status: false,
        message: "removeProduct should be a valid number",
      });
    }
    if (removeProduct < 0 || removeProduct > 1) {
      return res.status(400).send({
        status: false,
        message: "removeProduct should be 0 or 1",
      });
    }
    let findQuantity = findCart.items.find(
      (x) => x.productId.toString() === productId
    );

    if (removeProduct == 0) {
      let itemsarr = findCart.items
      if (itemsarr.length == []) {
          return res.status(400).send({ status: false, message: "No products to remove cart is empty" });
      }
      let totalAmount =
        findCart.totalPrice - findProduct.price * findQuantity.quantity;
      let quantity = findCart.totalItems - 1;
      let newCart = await cartModel.findOneAndUpdate(
        { _id: cartId },
        {
          $pull: { items: { productId: productId } },
          $set: { totalPrice: totalAmount, totalItems: quantity },
        },
        { new: true }
      );

      return res.status(200).send({
        status: true,
        message: "the product has been removed from the cart",
        data: newCart,
      });
    }

    if (removeProduct == 1) {
      let itemsarr = findCart.items
      if (itemsarr.length == []) {
          return res.status(400).send({ status: false, message: "No products found to reduce with given productid in cart" });
      }
      let totalAmount = findCart.totalPrice - findProduct.price;
      let items = findCart.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId.toString() === productId) {
          items[i].quantity = items[i].quantity - 1;
          if (items[i].quantity == 0) {
            var noOfItems = findCart.totalItems - 1;
            let newCart = await cartModel.findOneAndUpdate(
              { _id: cartId },
              {
                $pull: { items: { productId: productId } },
                $set: { totalPrice: totalAmount, totalItems: noOfItems },
              },
              { new: true }
            );
            return res.status(200).send({
              status: true,
              message: "the product has been removed from the cart",
              data: newCart,
            });
          }
        }
      }
      let updatedData = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { totalPrice: totalAmount, items: items },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "product in the cart updated successfully.",
        data: updatedData,
      });
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).send({ status: false, error: err.message });
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

    let checkCart = await cartModel
      .findOne({ userId: userId })
      .select({ "items._id": 0, __v: 0 });

    if (!checkCart) {
      return res
        .status(404)
        .send({ status: false, message: "no cart found with this userId" });
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

    let checkCart = await cartModel.findOneAndUpdate(
      { userId: userId },
      { items: [], totalPrice: 0, totalItems: 0 }
    );

    if (!checkCart) {
      return res
        .status(404)
        .send({ status: false, message: "no cart found with this userId" });
    }
    if (checkCart.items.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Cart already deleted" });
    }
    return res.status(204).send({
      status: true,
      message: "Cart has been deleted Successfully",
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createCart, updateCart, getCart, deleteCart };


