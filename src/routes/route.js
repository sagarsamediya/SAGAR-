const express = require('express');
const router = express.Router(); 
const userController = require("../controllers/userController");

let { createUser } = userController;

router.post("/register", createUser);

module.exports = router;