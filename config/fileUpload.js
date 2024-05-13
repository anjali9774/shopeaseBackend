const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
const hello =cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});



// Configure storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats:["jpg","png"],  // Allow only images (jpg/png)
    params: {
        folder: "Shopease-api",
    },
});

// Initialize multer with the configured storage engine
const upload = multer({
    storage:storage
});

module.exports = upload;
