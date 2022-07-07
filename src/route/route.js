const express = require("express");
const router =express.Router();
const userController = require("../controller/userController")
const bookController =require("../controller/bookController")
const middleware = require("../middleware/auth")
const login = require("../controller/login")


//---------------------------------- *** user api ***-----------------------------------------//

router.post("/register",userController.createUser)

 router.post("/login",login.userLogin)
 //-----------------------------------## Book api ##-------------------------------------------------//

router.post("/books",bookController.createBookDoc)
            

// router.post("/books",)

// router.get("/books",)

// router.get("/books/:bookId",)

// router.put("/books/:bookId",)

// router.delete("/books/:bookId",)

// router.post("/books/:bookId/review",)

// router.put("/books/:bookId/review/:reviewId",)

// router.delete("/books/:bookId/review/:reviewId",)

module.exports=router;
