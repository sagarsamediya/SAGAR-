const reviewModel = require('../model/reviewModel');
const { isValid, isValidRequestBody, isValidOjectId, isValidRegxDate, isValidRegxISBN } = require("../validation/validation");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const { findByIdAndUpdate } = require('../model/reviewModel');
const bookModel = require('../model/bookModel');
const ObjectId = require('mongoose').Types.ObjectId



// ---------------------------------------****-----------------------------------------------------****------------

//DELETE /books/:bookId/review/:reviewId

const deleteByBookIdReviewId = async (req, res) =>{
    try{
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId

        if (!bookId) return res.status(400).send({ status: false, msg: "bookId must be present in param"})
        if (!reviewId) return res.status(400).send({ status: false, msg: "reviewId must be present in param"})

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "bookId is not valid"})
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, msg: "reviewId is not valid"})

        const book = await reviewModel.find({_Id:bookId, isDeleted:false})
        if(!book){
            return res.status(404).send({status: false , msg: "book not found"})
        }
        
        const review = await reviewModel.find({_id:bookId , reviewId:reviewId, isDeleted:false})
        if(!review){
            return res.status(404).send({status: false , msg: "reviewId is not present in given bookId"})
        }
        const deleteReview = await findOneAndUpdate({ _id: reviewId, bookId:bookId },  { isDeleted: true},  {new:True} )

      const decreaseCount = await bookModel.findOneAndUpdate({_id: bookId, reviews: {$gt:0} },{$inc:{reviews: -1}})
      return res.status(200).send({status: true, msg: "review deleted Sucessfully"})
    }catch(err){
        console.log(err)
        return res.status(500).send({status:false, msg: "error"})
    }
}