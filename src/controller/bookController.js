const bookModel = require("../model/booksModel");
const userModel = require("../model/userModel");
const { isValid, isValidRequestBody } = require("../validation/validation")




const createBookDoc = async function (req, res) {
    try {
        let data = req.body.userId
        let { title, excerpt, ISBN, category, subcategory, releasedAt } = req.body

        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "userId is invalid " });
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is invalid" })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "excerpt is invalid" })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is invalid" })
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is invalid" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: "subcategory is invalid" })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, msg: "releasedAt is invalid" })

       


        let isExistsuserId = await userModel.findById(userId)
        if (!isExistsuserId) return res.status(400).send({ status: false, msg: "This userId is not present here" });

        let newdoc = await bookModel.create(data);
        res.status(201).send({ status: true, data: newdoc });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "Internal server error" })
    }
};

module.exports={createBookDoc}
