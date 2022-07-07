const bookModel =require("../model/booksModel")
const auth = require("../middleware/auth")
const validation = require("../validation/validation")



const createBookDoc = async function(req,res){
    let data = req.body.userId 
    let {title,excerpt,userId,ISBN,category,subcategory,releasedAt}=req.body

    if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"userId should be not empty "})

}