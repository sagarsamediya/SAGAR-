const booksModel = require("../model/booksModel");
// 0const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");

// --------------***-----------------***---------------------***------------------
// ### PUT /books/:bookId

const updateBooks = async (req, res) => {
    try{

    }catch(err){
    return res.stauts(500).send({status:false , msg: "error"})}
}


// --------------***-----------------***---------------------***------------------
//  DELETE /books/:bookId

const deleteBookId = async (rerq, res) => {
    try{
        let  bookId = req.params.bookId
        //  bookId is present or not
        if (!bookId)   return res.status(400).send({ status: false, msg: "bookId must be present in param " })

        if(!isValidObjectId(bookId)) return res.status(400).send({status:false, msg:"bookId is not valid"})

        const book = await bookModel.findOne({_id: bookId, isDeleted: false})
        if(!book) return res.status(404).send({status: false, msg: "book not exist or allerady deleted"})

        await bookModel.findOneAndUpdate({_id: bookId}, {$set: {isDeleted:true, deletedAt:new Date()}})
       
        return res.status(200).send({status: true, message: "Success"})
    }
    catch(err){
        console.log(err)
        return res.status(500).send({status : false , msg : "error"})
    }
}
module.exports = { deleteBookId }