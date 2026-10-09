/**
 * 404 Not Found Middleware
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `ບໍ່ພົບ Endpoint ທີ່ທ່ານຮ້ອງຂໍ (${req.originalUrl})`,
  });
}

/**
 * Global Centralized Error Handler
 */
function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err);

  // Multer Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'ຂະໜາດໄຟລ໌ໃຫຍ່ເກີນໄປ (ຈຳກັດສູງສຸດບໍ່ເກີນ 5MB)',
      });
    }
    return res.status(400).json({
      success: false,
      message: `Multer Error: ${err.message}`,
    });
  }

  // Custom File Type Error
  if (err.message && err.message.includes('ຮອງຮັບສະເພາະໄຟລ໌ຮູບພາບ')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Prisma Unique Constraint Error (P2002)
  if (err.code === 'P2002') {
    const field = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `ຂໍ້ມູນ ${field} ນີ້ມີຢູ່ໃນລະບົບແລ້ວ (Duplicate value)`,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'ເກີດຂໍ້ຜິດພາດພາຍໃນເຊີບເວີ (Internal Server Error)',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
