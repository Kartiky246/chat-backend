import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "den8xodxv",
  api_key: "689159687475139",
  api_secret: "i9QKRapyhwsCls3lITh3XVtGIXk",
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
