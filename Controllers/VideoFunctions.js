const cloudinary = require("cloudinary").v2

const Video = require("../Models/VideoModel")


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


exports.VideoUpload = async (req,res) => {

  try {

    const {name} = req.body
    const file = req.files.videoFiles

    if(!name || !file){
        return res.json({
            success:false,
            message:"All fields required while uploading video..."
        })
    }


    const supportedTypes = ["mp4"];

    const fileType = file.name.split('.')[1].toLowerCase()


    if(!supportedTypes.includes(fileType)){
      return res.json({
        success:false,
        message:"File format not supported..."
      })
    }

    const response = await uploadtocloudinary(file , "TejashVideo")


    // DB entry

    const fileData = await Video.create({
      name,
      public_id:response.public_id,
      videoURL:response.secure_url
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



exports.fetchVideos = async(req,res) => {

  try {

      const allVideos = await Video.find()


      return res.json({
        success:true,
        allVideos,
        message:"All Images"
      })

    
  } catch (error) {

    return res.json({
      success:false,
      message:"Error in fetching Images..."
    })
  }
}



exports.deleteVideo = async (req,res) => {
  try {

    const { videoURL , public_id} = req.body

    await Video.findOneAndDelete({videoURL})

    const response = await deleteFromCloudinary(public_id , "video")

    if(response.result != 'ok'){
      res.json({
            success:false,
            message:"error in deleting from cloudinary..."
          })
    }

    res.json({
      success:true,
      message:"Video deleted Successfully..."
    })
    
  } catch (error) {

    res.json({
      success:false,
      message:"error in deleting..."
    })
  }
}