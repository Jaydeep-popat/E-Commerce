import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_URL
});

const uploadCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null;
        //upload  file on the cloudinary
        const result = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
    }catch(e){
        fs.unlinkSync(localFilePath);
        // remove the saved temporary file as the operation got rejected 
        return null;
    }
}

export {cloudinary};
