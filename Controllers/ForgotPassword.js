const User = require("../Models/User");
const bcrypt = require("bcrypt")
const mailSender = require("../utils/mailSender")
const crypto = require("crypto")

exports.resetPasswordToken = async(req,res)=>{
    try{
        const {email} = req.body;

        if(!email){
            return res.status(404).json({
                success:false,
                message:"All fields required to get password change link. "
            })
        }

        const user = await User.findOne({email:email});

        if(!user){
            return res.json({
                success:false,
                message:"Admin not found for current email..."
            })
        }

        const token = crypto.randomBytes(20).toString("hex");

        const updatedUser = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordLinkExpires : Date.now() + 3600000,
            },
            {new:true}
        )

        

        const url = `http://localhost:5173/update-password/${token}`;

        await mailSender(
            email,
            `Your Link for email verification is ${url}. Please click this url to reset your password.`
        );

        return res.status(200).json({
            success:true,
            message:"Mail to reset password has been sent..."
        })

    }
    catch(error){
        
        return res.status(404).json({
            success:flse,
            message:"Error in sending mail to reset password...",
        })
    }
}


exports.resetPassword = async(req,res)=>{
    try{
        const {password , confirmPassword , token} = req.body;

        if(!password || !confirmPassword){
            return res.status(404).json({
                success:false,
                message:"All fields required to change password...",
            })
        }

        if(password !== confirmPassword){
            return res.status(404).json({
                success:false,
                message:"Password do not match"
            })
        }
        
        const userDetails = await User.findOne({token:token})

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"Invalid Token..."
            })
        }

        if(!(userDetails.resetPasswordLinkExpires > Date.now())){
            return res.status(404).json({
                success:false,
                message:"Token is expired...",
            })
        }

        const encryptedPassword = await bcrypt.hash(password,10);

        await User.findOneAndUpdate(
            {token:token},
            // {password:password},
            {password:encryptedPassword},
            {new:true}
        )
        

        return res.status(200).json({
            success:true,
            message:"Password reset successfully..."
        })

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"error in reseting password..."
        })
    }
}