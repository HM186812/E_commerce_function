const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * Verify JWT token from Authorization header (Bearer <token>)
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນດຳເນີນການ (Authentication token missing)',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_lao_ecommerce_2026_dev_mode');
    
    // Fetch current user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, phone: true, address: true, role: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ບັນຊີຜູ້ໃຊ້ນີ້ບໍ່ມີໃນລະບົບແລ້ວ (User not found)',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token ໝົດອາຍຸ ຫຼື ບໍ່ຖືກຕ້ອງ (Invalid or expired token)',
    });
  }
}

/**
 * Require ADMIN role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'ທ່ານບໍ່ມີສິດເຂົ້າເຖິງສ່ວນນີ້ (Admin access required)',
    });
  }
  next();
}

/**
 * Optional authentication: attaches user if token exists, but does not block if not
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_lao_ecommerce_2026_dev_mode');
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true, phone: true, address: true, role: true },
      });
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore invalid token for optional auth
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth,
};
