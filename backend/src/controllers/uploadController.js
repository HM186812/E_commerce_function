const { uploadToCloudinary } = require('../config/cloudinary');

/**
 * Upload single image (Product image or Payment slip)
 */
async function uploadSingleImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'ກະລຸນາເລືອກໄຟລ໌ຮູບພາບທີ່ຕ້ອງການອັບໂຫຼດ (No file uploaded)',
      });
    }

    const folder = req.body.folder || 'ecommerce/uploads';
    const localFilePath = req.file.path;

    // Upload to Cloudinary or fallback to local static route
    const result = await uploadToCloudinary(localFilePath, folder);

    // If local, prepend full host or relative path
    const fullUrl = result.isLocal
      ? `${req.protocol}://${req.get('host')}${result.url}`
      : result.url;

    res.json({
      success: true,
      message: 'ອັບໂຫຼດຮູບພາບສຳເລັດ',
      data: {
        url: fullUrl,
        relativePath: result.url,
        publicId: result.publicId,
        isLocal: result.isLocal,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Upload multiple images
 */
async function uploadMultipleImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ກະລຸນາເລືອກໄຟລ໌ຮູບພາບ',
      });
    }

    const folder = req.body.folder || 'ecommerce/gallery';
    const uploadPromises = req.files.map(async (file) => {
      const result = await uploadToCloudinary(file.path, folder);
      const fullUrl = result.isLocal
        ? `${req.protocol}://${req.get('host')}${result.url}`
        : result.url;
      return {
        url: fullUrl,
        relativePath: result.url,
        publicId: result.publicId,
        isLocal: result.isLocal,
      };
    });

    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      message: `ອັບໂຫຼດຮູບພາບສຳເລັດ ${results.length} ຮູບ`,
      data: results,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};
