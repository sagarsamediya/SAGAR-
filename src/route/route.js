const express = require("express");
const router =express.Router();
const userController = require("../controller/userController")
const login = require("../controller/login")


            // user Api's

router.post("/register",userController.createUser)

 router.post("/login",login.userLogin)

             // Book Api's

// router.post("/books",)

// router.get("/books",)

// router.get("/books/:bookId",)

// router.put("/books/:bookId",)

// router.delete("/books/:bookId",)

// router.post("/books/:bookId/review",)

// router.put("/books/:bookId/review/:reviewId",)

// router.delete("/books/:bookId/review/:reviewId",)

module.exports=router;
