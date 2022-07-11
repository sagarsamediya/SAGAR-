const bookModel = require("../model/bookModel");
const reviewModel = require("../model/reviewModel");
const { isValidObjectId } = require("mongoose");
const { findById, validate } = require("../model/userModel");
const { isValid, isValidRequestBody,isValidName } = require("../validation/validation");



//--------------------------##---------***** create review ******----------------##-------------------------------------------------//

const createReview = async function (req, res) {
    try {
        let data = req.body
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: `Provide valid data for review` });

        let bookId = req.params.bookId;
        if (bookId == '' || !bookId) return res.status(400).send({ status: false, message: "bookId tag is required" });
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is invalid or empty,required here valid information" });

        data.bookId=bookId

        const {reviewBy,reviewedAt,rating,review}=data
        if(reviewBy){
        if(!isValid(reviewBy))return res.status(400).send({status:false,msg:"Give name of reviewer"});
        if(!isValidName(reviewBy))return res.status(400).send({status:400,msg:"Provide valid name"});
        };

        if(!isValid(reviewedAt))return res.status(400).send({status:false,msg:"this is format 'yyyy-mm-dd' "});


       if(!(rating>=1 && rating<=5))return res.status(400).send({status:false,msg:"please provide rating 1-5"});
        if(!isValid(rating))return res.status(400).send({status:false,msg:"please provide rating"});
        if (review){
        if(!isValid(review))return res.status(400).send({status:false,msg:"please give your review about books"});
        };

        let existBookId = await bookModel.findOne({_id:bookId,isDeleted:false});
        if (!existBookId) return res.status(400).send({ status: false, msg: `${bookId}.This bookId is invalid` });

        let savedData = await reviewModel.create(data);
        return res.send({ status: true, data: savedData });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "Internal server error" });
    }
};

module.exports = { createReview }