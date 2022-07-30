const express = require('express');
const router = express.Router(); 
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const middleWare = require("../middleware/auth");

let { createUser, userLogin, getUser, updateUsersProfile } = userController;
let { createProduct, getProduct, productById, updateProduct, deleteProduct } = productController;
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

router.all("/*", async function (req, res) {
    res.status(404).send({ status: false, msg: "Page Not Found!"})
});

module.exports = router;
