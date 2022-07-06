<<<<<<< HEAD
const express = require('express');
// const router =express.Router();
const router = express();
=======
const express = require("express");
const router =express.Router();
const userController = require("../controller/userController")

>>>>>>> 3d5a6282691c5d868909c4371431f33a86be7040



router.post("/register",userController.createUser)

// router.post("/login",)

// router.post("/books",)

// router.get("/books",)

// router.get("/books/:bookId",)

// router.put("/books/:bookId",)

// router.delete("/books/:bookId",)

// router.post("/books/:bookId/review",)

// router.put("/books/:bookId/review/:reviewId",)

// router.delete("/books/:bookId/review/:reviewId",)

<<<<<<< HEAD
router.delete("/books/:bookId/review/:reviewId",)


module.exports = router;
=======
module.exports=router
>>>>>>> 3d5a6282691c5d868909c4371431f33a86be7040
