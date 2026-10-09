const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Upload a local file to Cloudinary or fallback to local static URL
 * @param {string} localFilePath - Path to local file
 * @param {string} folder - Destination folder (e.g. 'ecommerce/products', 'ecommerce/slips')
 * @returns {Promise<{ url: string, publicId: string | null }>}
 */
async function uploadToCloudinary(localFilePath, folder = 'ecommerce') {
  if (!isCloudinaryConfigured) {
    // Return relative URL for static file serving
    const filename = localFilePath.split(/[/\\]/).pop();
    const url = `/uploads/${filename}`;
    return { url, publicId: null, isLocal: true };
  }

  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'auto',
    });

    // Optionally remove local temp file after upload
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (e) {
      console.warn('Could not remove temporary local file:', e.message);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      isLocal: false,
    };
  } catch (error) {
    console.error('Cloudinary upload error, using local fallback:', error.message);
    const filename = localFilePath.split(/[/\\]/).pop();
    return { url: `/uploads/${filename}`, publicId: null, isLocal: true };
  }
}

/**
 * Delete an image from Cloudinary or local storage
 * @param {string} publicId - Cloudinary public ID
 * @param {string} localUrl - Local file URL
 */
async function deleteImage(publicId, localUrl) {
  if (publicId && isCloudinaryConfigured) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error.message);
    }
  } else if (localUrl && localUrl.startsWith('/uploads/')) {
    const path = require('path');
    const filename = localUrl.replace('/uploads/', '');
    const fullPath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error('Failed to delete local file:', err.message);
      }
    }
  }
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteImage,
};
