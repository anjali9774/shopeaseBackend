const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'due9d0x80',
    api_key: '628851825248971',
    api_secret: 'eria7me9c5T8ESYzUfy9wZdNtaU'
});



// Configure storage engine for multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Shopease-api",
    },
});

// Initialize multer with the configured storage engine
const categoryFileUpload = multer({
    storage
});

module.exports = categoryFileUpload;
