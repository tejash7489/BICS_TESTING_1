const cloudinary = require("cloudinary").v2

const Image = require("../Models/ImageModel")

async function uploadtocloudinary(file , folder){
  const options = {
                folder,
                resource_type: "auto"
              }
  return await cloudinary.uploader.upload(file.tempFilePath , options)
}

async function deleteFromCloudinary(public_id, resource_type = "image") {
  try {
      const result = await cloudinary.uploader.destroy(public_id, {
      resource_type, // "image" | "video" | "raw"
    });

    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete error:", error.message);
    throw error;
  }
}



exports.ImageUpload = async (req,res) => {

  try {

    const file = req.files.imageFiles

    const supportedTypes = ["jpg" , "jpeg" , "png" , "webp"];

    const fileType = file.name.split('.')[1].toLowerCase()

    if(!supportedTypes.includes(fileType)){
      return res.json({
        success:false,
        message:"File format not supported..."
      })
    }

    const response = await uploadtocloudinary(file , "Tejash")

    // DB entry

    const fileData = await Image.create({
      imageURL:response.secure_url,
      public_id:response.public_id
    })
    return res.json({
      success:true,
      fileData,
      message:"Upload ho gya..."
    })
    
  } catch (error) {
    
    return res.json({
      success:false,
      message:"Failed to upload..."
    })
  }
}


exports.fetchImages = async(req,res) => {

  try {

      const allImg = await Image.find()

      return res.json({
        success:true,
        allImg,
        message:"All Images"
      })

    
  } catch (error) {
    
    return res.json({
      success:false,
      message:"Error in fetching Images..."
    })
  }
}




exports.deleteImage = async (req,res) => {
  try {

    const {imageURL , public_id} = req.body

    await Image.findOneAndDelete({imageURL})
    

    const response = await deleteFromCloudinary(public_id)
    
    if( response.result != 'ok'){
        
      return res.json({
            success:false,
            message:"error in deleting from cloudinary..."
          })
    }

    return res.json({
      success:true,
      message:"Image deleted Successfully..."
    })
    
  } catch (error) {

    return res.json({
      success:false,
      message:"error in deleting..."
    })
  }
}