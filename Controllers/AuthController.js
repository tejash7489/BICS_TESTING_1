const User = require("../Models/User")
const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")


exports.signup = async(req,res) => {
    try {
        
        const {email,password} = req.body;

        if(!email || !password){
            return res.json({
                success:false,
                message:"All Fields Required while SiginingUp..."
            })
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.json({
                success:false,
                message:"User Already Exists..."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password:hashedPassword
        })

        return res.json({
            success:true,
            user,
            message:"User Created Successfully..."
        })


    } catch (error) {
        return res.json({
            success:false,
            message:"Error In Creating User..."
        })
    }
}



exports.login = async(req,res) => {
    try {
        const {email , password} = req.body

        if(!email || !password){
            return res.json({
                success:false,
                message:"All Fields Required while Logingin..."
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"User Not Found..."
            })
        }

        if(await bcrypt.compare(password , user.password)){
            const token = JWT.sign(
                {email:user.email , id:user._id},
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            )

            user.token = token
            user.password = undefined

            return res.json({
                success:true,
                message:"Login Successfull..."
            })
        }
        else{
            return res.json({
                success:false,
                message:"Incorrect Password..."
            })
        }

    } catch (error) {
        return res.json({
            success:false,
            message:"Error In Logingin..."
        })
    }
}
