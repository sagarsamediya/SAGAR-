const bookModel = require("../model/bookModel");
const userModel = require("../model/userModel");
const reviewModel = require('../model/reviewModel')
const { isValid, isValidRequestBody,isValidOjectId,isValidRegxDate,isValidRegxISBN } = require("../validation/validation")
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose")
const { query } = require('express');


//-----------------##---------## create Books documents ##------------------##----------------------//

const createBookDoc = async function (req,res) {
    try {
        let data = req.body
        
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "data is empty" });
        let { title, excerpt, ISBN, category, subcategory, releasedAt,userId } = data
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is invalid" })
        if (userId == '' || !userId) return res.status(400).send({ status: false, message: "userId tag is required" });

        if (!isValidOjectId(userId)) return res.status(400).send({ status: false, message: "Object id is Invalid" });

        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "excerpt is invalid" })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is invalid" })
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is invalid" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: "subcategory is invalid" })
        // if (!isValid(releasedAt)) return res.status(400).send({ status: false, msg: "releasedAt is invalid" })

       


        let isExistsuserId = await userModel.find({_id:userId});
        if (!isExistsuserId) return res.status(400).send({ status: false, msg: "This userId is not present here" });

        let newdoc = await bookModel.create(data); 
        res.status(201).send({ status: true, data: newdoc });
    }
    catch (err) {
      res.status(500).send({ status: false, msg: "Internal server error" })
    }
};


// ------------------------------------------****---------------------------------------------***---------------------------------

const getBookByBookId = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        //    VALIDATION
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "userId is Invalid" });
        }
        //   FETCHING BOOK  WITH   BOOK ID
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        // WHEN  NOT FOUND
        if (!book) {
            return res.status(404).send({ status: false, mseesge: "book not found" })
        }
        // FETCHING   REVIEW   FROM   REVIEW   MODEL 
        const review = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 });

        // DESTRUCTURING  BOOK  FOR MAKING RESPONSE
        const { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt } = book  

        const data = { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt }
        data["reviewData"] = review;
        // SENDING   BOOK   LIST 
        res.status(200).send({ status: true, msg: "Book list", data: data });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


// --------------------------------------------***--------------------------------****-------------------------****

const updateBook = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        //BOOKID VALIDATIONS
        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter BookId in Params also Valid Id" });
        }
        //  DOCUMENT EXIST OR NOT IN DB
       
        const requestBody = req.body;
        //  IF BODY IS EMPTY
        if (Object.keys(requestBody).length == 0) {
            return res.status(400).send({ status: false, message: "Enter Data in Body" });
        }

        // DESTRUCTURING
        const { title, excerpt, releasedAt, ISBN } = requestBody;

        // BODY DATA VALIDATIONS
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "Eneter Title" });
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "Enter excerpt" });
        }
        //   DATE VALIDATION
        if (!isValid(releasedAt) || !isValidRegxDate(releasedAt)) {
            return res.status(400).send({ status: false, message: "Enter release date Also Formate Should be 'YYYY-MM-DD' " });
        }
        
        //  ISBN NO. VALIDATION
        if (!isValid(ISBN)  || isValidRegxISBN(ISBN) ) {
            return res.status(400).send({ status: false, message: "Enter ISBN Also Valid" });
        }
        const bookData = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!bookData) {
            return res.status(404).send({ status: false, message: "Book not found With Given id,or Allready Delete" });
        }
        if (req.loggedInUser != bookData.userId) {   //// CHECKING USER AUTERIZATION
            return res.status(403).send({ status: false, message: "Unauthorize To Make Changes" });
        }       
        // CHECKING UNIQUE EXISTANCE IN DB
        const uniqueIsbn = await bookModel.findOne({ ISBN: ISBN });
        if (uniqueIsbn) {
            return res.status(400).send({ status: false, message: "ISBN Allready Exist Use Different" });
        }
        const uniqueTitle = await bookModel.findOne({ title: title });
        if (uniqueTitle) {
            return res.status(400).send({ status: false, message: "Title Allready Exist Use different Title" });
        }
        //  UPADATING DOCUMENT IN DB
        const updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId }, { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } }, { new: true });
        res.status(200).send({ status: true, message: "Updated Successfully", data: updatedBook })

    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};

// ---------------------------****----------------------------***----------------------------------***---------------

const getBooks = async function (req, res) {
    try {
      let userQuery = req.query;
      let filter = {isDeleted: false,};
  
      if (!isValidRequestBody(userQuery)) {
        return res.status(400).send({status: true,message:" please provide valid data"});
      }
      const { userId, category, subcategory } = userQuery;
      if (userId) {
        if (!isValidObjectId(userId)) {
          return res
            .status(400)
            .send({ status: false, message: "Invalid userId" });
        }

        if (isValid(userId)) {
          filter["userId"] = userId;
        }
      }
      if (isValid(category)) {
        filter["category"] = category.trim(); 
      }
      if (isValid(subcategory)) {
        const subCategoryArray = subcategory.trim().split(",").map((s) => s.trim());
        filter["subcategory"] = { $all: subCategoryArray };
      }

      let findBook = await bookModel.find(filter).select({title: 1,book_id: 1,excerpt: 1,userId: 1,category: 1,releasedAt: 1,reviews: 1,});
      if (Array.isArray(findBook) && findBook.length === 0) {
        return res
          .status(404)
          .send({ status: false, message: "Books Not Found" });
      }
      const sortedBooks = findBook.sort((a, b) => a.title.localeCompare(b.title));
      res.status(200).send({ status: true, message: "Books list", data: sortedBooks });
    }
     catch (err) {
      res.status(500).send({status: false,message: "Internal Server Error",error: err.message,});
    }
  };

  // --------------***-----------------***---------------------***------------------
//  DELETE /books/:bookId

const deleteBookId = async (req, res) => {
    try{
        let  bookId = req.params.bookId
        //  bookId is present or not
        if (!bookId)   return res.status(400).send({ status: false, msg: "bookId must be present in param " })

        // bookId is a valid objectId
        if(!isValidObjectId(bookId)) return res.status(400).send({status:false, msg:"bookId is not valid"})

        const book = await bookModel.findOne({_id: bookId, isDeleted: false})
        if(!book) return res.status(404).send({status: false, msg: "book not exist or allerady deleted"})
                   

        // set the isDeleted true of that book with deleted date
        await bookModel.findOneAndUpdate({_id: bookId}, {$set: {isDeleted:true, deletedAt:new Date()}})
        // await reviewModel.findByIdAndUpdate({bookId:bookId},{$set:{isDeleted:true}})
        return res.status(200).send({status: true, message: "Success"})
    }
    catch(err){
        console.log(err)
        return res.status(500).send({status : false , msg : "error.message"})
    }
}

// ------------------------------***-------------------------------***---------------------------***-----------



module.exports={createBookDoc,getBooks,getBookByBookId,updateBook,deleteBookId }




