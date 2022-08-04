const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const validation = require("../validator/validation");

const { isEmpty, isValidObjectId, isValidStatus } = validation;

const createOrder = async function (req, res) {
    try {

    } catch(err) {
        return res.status(500).send({status: false, message: err.message});
    }
}

const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        if(!isValidObjectId(userId)) {
            return res.status(400).send({status: false, message: "Provide a valid userId"});
        }

        let validUser = await userModel.findOne({_id: userId});
        if(!isEmpty(validUser)) {
            return res.status(404).send({status: false, message: "User doesn't exist"});
        }
        if(Object.keys(data).length == 0) {
            return res.status(400).send({status: false, message: "Body must be filled"});
        }
        let { orderId, status } = data;
        if(!isEmpty(orderId)) {
            return res.status(400).send({status: false, message: "OrderId must be filled"});
        }
        if(!isEmpty(status)) {
            return res.status(400).send({status: false, message: "Provide a order status"});
        }
        if(!isValidObjectId(orderId)) {
            return res.status(400).send({status: false, message: "Provide a valid orderId"});
        }
        if(!isValidStatus(status)) {
            return res.status(400).send({status: false, message: "Order status should include pending, completed or cancelled only!"})
        }
        let validOrder = await orderModel.findOne({_id: orderId});
        if(!validOrder) {
            return res.status(404).send({status: false, message: "Order doesn't exist"});
        }
        if(validOrder.status == 'cancelled') {
            return res.status(400).send({status: false, message: "Dear user! your order is already get cancelled"});
        }
        if(validOrder.status == 'pending') {
            return res.status(400).send({status: false, message: "Dear user! your order is in pending state"});
        }
        if(validOrder.status == 'cancelled') {
            return res.status(400).send({status: false, message: "Dear user! your order is getting cancelled"})
        }
        if(status == 'cancelled') {
            if(validOrder.cancellable == false) {
                return res.status(400).send({status: false, message: "This order is not cancellable"})
            }
        }
        validOrder.status = status;
        await validOrder.save();

        return res.status(200).send({status: true, message: `Order status has been updated to ${status} successfully`, data: validOrder});
    } catch(err) {
        return res.status(500).send({status: false, message: err.message});
    }
}

module.exports = { createOrder, updateOrder };