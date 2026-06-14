import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage Engine Layout
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'jasbuilt_project_screenshots', // Organized folder structure inside Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Reject dangerous file formats at the gate
    transformation: [{ width: 1280, height: 720, crop: 'limit' }], // Industry optimization: resize screenshots automatically
  },
});

// Create the Multer upload instances
export const uploadImage = multer({ storage: storage });