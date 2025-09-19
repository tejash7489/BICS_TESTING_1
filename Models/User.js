const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordLinkExpires:{
        type:Date,
    }
})

module.exports = mongoose.model("User" , adminSchema)