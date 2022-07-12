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

        const {reviewedBy,reviewedAt,rating,review}=data


        if(!isValidName(reviewedBy))return res.status(400).send({status:false,msg:"Provide valid name"});
        if(reviewedBy){
        if(!isValid(reviewedBy))return res.status(400).send({status:false,msg:"Give name of reviewer"});
        };

        // if(!isValid(reviewedAt))return res.status(400).send({status:false,msg:"this is format of date 'yyyy-mm-dd' "});
        data["reviewedAt"]=Date.now()

        

       if(!(rating>=1 && rating<=5))return res.status(400).send({status:false,msg:"please provide rating 1-5"});
        if(!isValid(rating))return res.status(400).send({status:false,msg:"please provide rating"});
        
        if(review && !isValid(review))return res.status(400).send({status:false,msg:"please give your review about books"});
        
        let savedData = await reviewModel.create(data);
        const existBookId = await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{$inc:{reviews:+1}},{new:true}).lean();
        if (!existBookId)return res.status(404).send({ status: false, msg: `${bookId}.This bookId not found in Db` });
    
        existBookId["createdreview"]=savedData

        return res.send({ status: true, data: existBookId });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "Internal server error" });
    }
};


const updateReview = async function (req, res) {
    try {

        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        //     Validation and DB fetch for Existance
        if (!isValid(bookId) || !isValidOjectId(bookId)) {
            return res.status(400).send({ status: false, message: "Please! enter a valid bookid" })
        }

        if (!isValid(reviewId) || !isValidOjectId(reviewId)) {
            return res.status(400).send({ status: false, message: "Please! enter a valid reviewId" })
        }
        const existBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!existBook) {
            return res.status(404).send({ status: false, message: "Book does not found with given id" })
        }
        const existReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!existReview) {
            return res.status(404).send({ status: false, message: "Review Id does not exist in DataBase" })
        }

        // check params-bookid matches with reiews bookid
        if (!(existReview.bookId == bookId)) {
            return res.status(400).send({ status: false, message: `The Review does not belong to book by BookId: ${bookId}` })
        }
        if (!(Object.keys(requestBody).length > 0)) {
            return res.status(400).send({
                status: false,
                message: "Invalid request parameters, Provide data to update review"
            })
        }

        // DESTURCTURING
        const { reviewedBy, rating, review } = requestBody  

        const filter = {}
        if (reviewedBy) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: "Please! enter a valid data to reviewedby feild" })
            }
            filter['reviewedBy'] = reviewedBy.trim()
            /*
            filter={
                reviewedBy:reviewedBy.trim();
            } */
        }

        if (rating) {
            if (!(rating >= 1 && rating <= 5)) {
                return res.status(400).send({ status: false, message: "Please! enter a value to rating feild between 1 and 5" })
            }
            filter['rating'] = rating
        }

        if (review) {
            if (!isValid(review)) {
                return res.status(400).send({ status: false, message: "Please! enter a valid data to 'review' feild" })
            }
            filter['review'] = review.trim()
        }

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: filter }, { new: true })
        const reviewData = await reviewModel.findOne({ _id:reviewId }).select({ bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        //      Destructuring

        const { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt } = existBook

        //     Assigning to variable  data object

        const data = { _id, title, excerpt, userId, category, subcategory, isDeleted, reviews, deletedAt, releaseAt, createdAt, updatedAt, reviewData }

        return res.status(200).send({ status: true, message: "Success", data: data })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
};



module.exports={updateReview,createReview}

