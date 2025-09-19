const express = require("express")
const app = express();
require("dotenv").config()
const db = require("./config/DbConnect")
const cors = require("cors")

app.use(express.json())
app.use(cors())

db.connect()
// let isConnected = false;
// async function connectToMongoDB(){
//     try {  
//         await db.connect();
//         isConnected = true;

//     } catch (error) {
//         console.error("Error connecting to MONGO_DB" , error)
//     }
// }

// app.use(async(req,res,next)=>{
//     if(!isConnected){
//         connectToMongoDB()
//     }
//     next()
// })


const fileupload = require("express-fileupload")
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

const cloudinary = require("./config/CloudinaryConnect")
cloudinary.cloudinaryConnect()

const allRoutes = require("./Routes/AllRoutes")

app.use("/api/v1",allRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT , ()=>{
    console.log("Hello World...")
    console.log("App is running at PORT = " , PORT)
})


// module.exports = app

