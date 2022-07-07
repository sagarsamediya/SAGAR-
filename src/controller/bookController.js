const booksModel = require("../model/booksModel");
// const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");




// --------------***-----------------***---------------------***------------------
//  DELETE /books/:bookId

const deleteBookById = async (rerq, res) => {
    try{
        let  bookId = req.params.bookId
        //  bookId is present or not
        if (!bookId)   return res.status(400).send({ status: false, msg: "bookId must be present in param " })

        if(!isValidObjectId(bookId)) return res.status(400).send({status:false, msg:"bookId is not valid"})

        const book = await bookModel.find({_id: bookId, isDeleted: false})
        if(!book) return res.status(404).send({status: false, msg: "book not exist or allerady deleted"})

    }catch(err){
        console.log(err)
        return res.status(500).send({status : false , msg : "error"})
    }
}
