import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const fileUploadCloudinary = async (localFilePath) => {
  console.log(process.env.CLOUDINARY_API_KEY, "API KEY");
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded sucessfully
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error, "error in file upload");
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { fileUploadCloudinary };
