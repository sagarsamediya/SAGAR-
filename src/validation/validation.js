const mongoose=require("mongoose")


const isValid= function(value){
    if (typeof value=== "undefined" || typeof value === null) return false
    if (typeof value==="string" && value.trim().length===0) return false
    // if(value==null)return false 
    return true
}



const isValidName=function(name){
    if( /^[-a-zA-Z_:,.' ']{1,100}$/.test(name))
    return true
}

const isValidEmail=(mail)=>{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
    return true
}
const isValidMobile=(mobile)=>{
    if(/^[0]?[6789]\d{9}$/.test(mobile))
    return true
}
const isValidPassword=(password)=>{
    if(/^(?=.*\d)(?=.*[a-zA-Z]).{8,15}$/.test(password)) //The password's first character must be a letter
    return true
}
const isValidRequestBody = function(data) {
    if(Object.keys(data).length==0) return false
    return true 
}


const isValidRegxDate = function(date){
    if(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm.test(date)) return true;
    return false;
}

const isValidRegxISBN = function(isbn){
    if(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(isbn)) return false;
    return true;
}

const isValidOjectId = function(id){
    if(mongoose.isValidObjectId(id)) return true;
    return false;
}

const isValidPincode = (pin) => {
    if (/^[1-9][0-9]{5}$/.test(pin))
        return true
}
module.exports={isValid,isValidName,isValidEmail,isValidMobile,isValidPassword,isValidRequestBody,isValidRegxDate,isValidRegxISBN,isValidOjectId,isValidPincode }