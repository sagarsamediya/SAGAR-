const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fName : {
        type: String, 
        required: true,
        trim: true   
    },
    lName: {
        type: String, 
        required: true,
        trim: true 
    },
    email: {
        type: String, 
        required: true, 
        trim: true,
        unique: true,
    },
    profileImage: {
        type: String, 
        required: true,
    },
    phone: {
        type: String, 
        required: true, 
        unique: true,
    },
    password: {
        type: String, 
        required: true,
        minLen: 8,
        maxLen: 15,
    },
    address: {
        shipping: {
            street: {
                type: String, 
                required: true,
            },
            city: {
                type: String, 
                required:true,
            },
            pinCode: {
                type: String, 
                required: true
            },
        },
        billing: {
            street: {
                type: String, 
                required: true,
            },
            city: {
                type: String, 
                required:true,
            },
            pinCode: {
                type: String, 
                required: true
            }
        }
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);


