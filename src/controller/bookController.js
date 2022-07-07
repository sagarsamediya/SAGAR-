const bookModel = require('../model/bookModel')
const reviewModel = require('../model/reviewModel')

const getBookByBookId = async function (req, res) {
    try {
        const bookId = req.params.bookId;
        //    VALIDATION
        if (!validator.isValidObjectId(bookId)) {
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

module.exports={getBookByBookId}