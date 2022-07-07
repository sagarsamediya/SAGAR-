

const isValid= function(value){
    if (typeof value=== "undefined" || typeof value === "null") return false
    if (typeof value==="string" && value.trim().length===0) return false
    if(value==null)return false 
    return true
}
const isValidName=(name)=>{
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
    if(/^[a-zA-Z]\w{8,15}$/.test(password)) //The password's first character must be a letter
    return true
}
const isValidRequestBody = (requestBody) =>{
    return Object.keys(requestBody).length > 0
}
module.exports={isValid,isValidName,isValidEmail,isValidMobile,isValidPassword,isValidRequestBody }