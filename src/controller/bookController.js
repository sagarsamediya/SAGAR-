const bookModel = require("../model/booksModel");
const userModel = require("../model/userModel");
const { isValid, isValidRequestBody,isValidOjectId } = require("../validation/validation")
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



module.exports={createBookDoc,deleteBookById}