const express = require('express');
const router = express.Router(); 
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const middleWare = require("../middleware/auth");

let { createUser, userLogin, getUser, updateUsersProfile } = userController;
let { createProduct, getProduct, productById, updateProduct, deleteProduct } = productController;
let { createCart, getCart, deleteCart } = cartController;
let { authentication, authorization } = middleWare;

// ==========> Create User Api <============
router.post("/register", createUser);

// =========> User Login Api <============
router.post("/login", userLogin);

// =========> Get User Api <============
router.get("/user/:userId/profile", authentication, authorization, getUser);

// =========> Update User Profile Api <============
router.put("/user/:userId/profile", authentication, authorization, updateUsersProfile);

// =========> Create Product Api <============
router.post("/products", createProduct);

// =========> Get Filtered Product Api <============
router.get("/products", getProduct);

// =========> Get ProductById Api <============
router.get("/products/:productId", productById);

// =========> Update Product Api <============
router.put("/products/:productId", updateProduct);

// =========> Delete Product Api <============
router.delete("/products/:productId", deleteProduct);

// =========> Create Users Cart Api <============
router.post("/users/:userId/cart", authentication, authorization, createCart);

// =========> Update Users Cart Api <============
// router.put("/users/:userId/cart", authentication, authorization, updateCart);

// =========> Get Users Cart Details Api <============
router.get("/users/:userId/cart", authentication, authorization, getCart);

// =========> Delete Users Cart Details Api <============
router.delete("/users/:userId/cart", authentication, authorization, deleteCart);

router.all("/*", async function (req, res) {
    res.status(404).send({ status: false, msg: "Page Not Found!"})
});

module.exports = router;
