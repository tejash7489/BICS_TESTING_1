const express = require("express")
const Router = express.Router()

const {login , signup} = require("../Controllers/AuthController")
const {ImageUpload , fetchImages , deleteImage} = require("../Controllers/ImageFunctions")
const {VideoUpload , fetchVideos , deleteVideo} = require("../Controllers/VideoFunctions")
const {resetPasswordToken , resetPassword} = require("../Controllers/ForgotPassword")

Router.post("/userLogin" , login)
Router.post("/userSignup" , signup)

Router.post("/ImageUpload" , ImageUpload)
Router.get("/fetchImages" , fetchImages)
Router.delete("/deleteImage" , deleteImage)

Router.post("/VideoUpload" , VideoUpload)
Router.get("/fetchVideos" , fetchVideos)
Router.delete("/deleteVideo" , deleteVideo)

Router.post("/reset-password-link" , resetPasswordToken)
Router.post("/reset-password" , resetPassword)



module.exports = Router