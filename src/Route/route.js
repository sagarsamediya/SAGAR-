const express = require('express')
const authorController = require('../Controller/authorController');
const blogController = require('../Controller/blogController');
 const blogMiddleware = require('../Middleware/blogMiddlware')
//  const authentication = require('..Middleware/authentication')
const router = express.Router();


// Author API's == Create an author - atleast 5 authors ===> no need authentication and authr..
router.post('/authors', authorController.createAuthor) 

// authentication.isPresentToken, authentication.isVerifyToken, authentication.createAuthorization, blogMiddleware.isAuthorIdValid,
// Blog API's yaha create krte time author id to dege hi denge ---> ab authorId se jayege hum emailId pr using populate
router.post('/blogs', blogController.createBlog)
// working perfect 
// authentication.isPresentToken, authentication.isVerifyToken, authentication.isloggedInUser,
router.delete("/delete/:blogId",  blogController.deleteById)

// authentication.isPresentToken, authentication.isVerifyToken, authentication.isloggedInUser,
// working perfect ===> tags prob is here
router.get('/blogs', blogController.getBlogs)

//update // put 
router.put("/blogs/:blogId", blogController.updateBlog)

 router.delete("/DELETE /blogs?queryParams", blogController.deleteBlog)
// router.get("/get" ,blogController.getBlogs )











// phase ---2
// login
// router.post('/login', loginController.login)




module.exports = router;