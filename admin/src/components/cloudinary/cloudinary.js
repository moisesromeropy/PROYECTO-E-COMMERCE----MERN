import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadCloudinary = async (file, formData) => {
  formData.append("images", file);
  formData.append("upload_preset", process.env.CLOUDINARY_CLOUD_NAME);
  const { data } = await axios.post("https://api.cloudinary.com/v1_1/" + process.env.CLOUDINARY_CLOUD_NAME + "/image/upload", formData);

  return { publicId: data?.public_id, url: data?.secure_url, formData };
}
