let blogModel= require('../Model/blogModel')
const  mongoose = require("mongoose")

const  mongoose = require("mongoose")
let blogModel= require('../Model/blogModel')
const { query } = require('express');


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
}
// ------------------------------**------------------------**----------------------**-------------------

let createBlog = async function (req, res) {
  try {
      let data = req.body;
      let newBlogObject = await blogModel.create(data)
     return res.status(201).send({ status: true, data: newBlogObject })
  } catch (err) {
      res.status(500).send({ status: false, msg: "Internal problem" })

  }
}

// ------------------------------**------------------------**----------------------**-------------------

const getBlogs = async function (req, res) {
  try {
    let data = req.query;
        let filter = {
      isdeleted: false,
      isPublished: true,
      ...Data
    };

    const { category, subcategory, tags } = data

    if (category) {
      let verifyCategory = await blogModel.findOne({ category: category })
      if (!verifyCategory) {
        return res.status(404).send({ status: false, msg: 'No blogs in this category exist' })
      }
      if (authorId) {
        let verifyCategory = await blogModel.findOne({ authorId: authorId })
        if (!verifyCategory) {
            return res.status(404).send({ status: false, msg: 'author id is not exists' })
        }
    }
 
// ------------------------------**------------------------**----------------------**-------------------

const getBlogs = async function (req, res) {
    try {
        let data = req.query;

        let filter = {
            isdeleted: false,
            isPublished: true,
            ...data
        };
        const { authorId, category, subcategory, tags } = data
        if (category) {
            let verifyCategory = await blogModel.findOne({ category: category }) 
            if (!verifyCategory) {
                return res.status(404).send({ status: false, msg: 'No blogs in this category exist' })
            }
        }
        if (authorId) {
            let verifyCategory = await blogModel.findOne({ authorId: authorId })
            if (!verifyCategory) {
                return res.status(404).send({ status: false, msg: 'author id is not exists' })
            }
        }

        if (tags) {

            if (!await blogModel.find({ tags: tags })) {
                return res.status(404).send({ status: false, msg: 'no blog with this tags exist' })
            }
        }

        if (subcategory) {

            if (!await blogModel.exists(subcategory)) {
                return res.status(404).send({ status: false, msg: 'no blog with this subcategory exist' })
            }
        }

        let getSpecificBlogs = await blogModel.find(filter);

        if (getSpecificBlogs.length == 0) {
            return res.status(404).send({ status: false, data: "No blogs can be found" });
        }
        else {
            return res.status(200).send({ status: true, data: getSpecificBlogs });
        }
    }
    catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};


      if (!await blogModel.exists(tags)) {
        return res.status(404).send({ status: false, msg: 'no blog with this tags exist' })
      }
    }

    if (subcategory) {

      if (!await blogModel.exists(subcategory)) {
        return res.status(404).send({ status: false, msg: 'no blog with this subcategory exist' })
      }
    }

    let getSpecificBlogs = await blogModel.find(filter);

    if (getSpecificBlogs.length == 0) {
      return res.status(404).send({ status: false, data: "No blogs can be found" });
    } 
    else {
      return res.status(200).send({ status: true, data: getSpecificBlogs });
    }
  
  } catch(error) {
    res.status(500).send({ status: false, err: error.message });
  }
};

// ------------------------------**------------------------**----------------------**-------------------



// =======================================================================
const updateBlog = async function (req, res) {
     try {
        let blogId = req.params.blogId
       

        if(!Object.keys(req.body).length) 
            return res.status(400).send({status: false, msg: "No data provided to update."})
        if(!mongoose.isValidObjectId(req.params.blogId))
            return res.status(400).send({status: false, msg: "Invalid Blog objectId."})
        // if (data.title == undefined)   return res.status(400).send({ status: false, messaage: "Pleage provide valid title" })
        // if (data.body == undefined)   return res.status(400).send({ status: false, messaage: "Pleage provide valid title" })
        // if (data.addingtags == undefined)   return res.status(400).send({ status: false, messaage: "Pleage provide valid title" })
        // if (data.addingasubcategory == undefined)   return res.status(400).send({ status: false, messaage: "Pleage provide valid addingasubcategory" })

        // if (!isValid(data.title))   return res.status(400).send({ status: false, messaage: " invalid title" })
        // if (!isValid(data.body))  return res.status(400).send({ status: false, messaage: " invalid body" })  
        // if (!isValid(data.addingtags))  return res.status(400).send({ status: false, messaage: " invalid adding tags" })
        // if (!isValid(data.addingasubcategory))  return res.status(400).send({ status: false, messaage: " invalid adding a subcategory" })
        

        let blog = await blogModel.findById(blogId);

        if (!blog || blog.isdeleted == true) {
            return res.status(404).send({ status: false, msg: "no such blog exists" });
        };
        let blogData = req.body;
        let updateBlog = await blogModel.findOneAndUpdate({ _id: blogId }, blogData);
        return res.status(200).send({ status: true, data: updateBlog });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "Internal Server Error" })
    }
};


// ------------------------------**------------------------**----------------------**-------------------
// working 

const deleteById = async function (req, res) {
    
  let blog = req.params.blogId
  console.log(blog)
  
  if(!blog){
      return res.status(400).send({status : false, msg : "blogId must be present in order to delete it"})
  }
     
  if(!mongoose.Types.ObjectId.isValid(blog)){
      return res.status(404).send({status: false, msg: "Please provide a Valid blogId"})
  }
  let fullObject = await blogModel.findOne({_id:blog})
  
  if(fullObject.isPublished != false && fullObject.isdeleted==false) 
  {
      let newData = await blogModel.findByIdAndUpdate(blog , {$set:{isdeleted:true}})
      res.status(200).send()
  }
  else
  {
      res.status(400).send({status:false,msg:"This data is not publised "})
  }  
};

// delete using query params --->check

const deleteBlog = async function (req, res) {
    try {
        let queryData = req.query

        let filter = {
            isdeleted: false,
            isPublished: true,
            ...queryData
        };
        const { authorId, category, subcategory, tags } = queryData
        if (category) {
            let verifyCategory = await blogModel.findOne({ category: category })
            if (!verifyCategory) {
                return res.status(404).send({ status: false, msg: 'No blogs in this category exist' })
            }
        }
        if (authorId) {
            let verifyCategory = await blogModel.findOne({ authorId: authorId })
            if (!verifyCategory) {
                return res.status(404).send({ status: false, msg: 'author id is not exists' })
            }
        }
        if (tags) {

            if (!await blogModel.find({ tags: tags })) {
                return res.status(404).send({ status: false, msg: 'no blog with this tags exist' })
            }
        }

        if (subcategory) {

            if (!await blogModel.exists(subcategory)) {
                return res.status(404).send({ status: false, msg: 'no blog with this subcategory exist' })
            }
        }

        let getSpecificBlogs = await blogModel.find(filter);

        if (getSpecificBlogs.length == 0) {
            return res.status(404).send({ status: false, msg: "No blogs can be found" });
        }


        let deletedData = await blogModel.updateMany({ $set: { isdeleted: true } })
        res.status(200).send({ status: true, data: deletedData });


    }
    catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }


};
module.exports.getBlogs =getBlogs
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.createBlog = createBlog;
module.exports.deleteById=deleteById;
//const blogModel = require("../Model/blogModel")

// ------------------------------**------------------------**----------------------**-------------------

  // module.exports.createBlog = createBlog

  // module.exports.getBlogs =getBlogs

  // module.exports.updateBlog = updateBlog

  // module.exports.deleteBlogs = deleteBlogs
  
  // module.exports.deleteBlog = deleteBlog

module.exports = {
    getBlogs, deleteBlog, createBlog, updateBlog , deleteById
}

