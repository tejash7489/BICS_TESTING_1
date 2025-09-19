const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    videoURL:{
        type:String,
        required:true,
    },
    public_id:{
        type:String,
        required:true,
    },
})

module.exports = mongoose.model("Video" , videoSchema)