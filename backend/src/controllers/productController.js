const prisma = require('../config/db');
const { getLowStockProducts } = require('../services/inventoryService');
const { deleteImage } = require('../config/cloudinary');

/**
 * Get products with search, filter, sorting, and pagination
 */
async function getProducts(req, res, next) {
  try {
    const {
      search,
      categoryId,
      categorySlug,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // Build Prisma query filter
    const where = {
      isActive: true,
    };

    // Keyword Search (Matches English name, Lao name, or description)
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { nameLao: { contains: q } },
        { description: { contains: q } },
      ];
    }

    // Category Filter
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    // In Stock Only Filter
    if (inStock === 'true' || inStock === true) {
      where.stock = { gt: 0 };
    }

    // Featured Filter
    if (isFeatured === 'true' || isFeatured === true) {
      where.isFeatured = true;
    }

    // Sorting Options
    let orderBy = { createdAt: 'desc' }; // default: newest
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    // Execute queries in parallel
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, nameLao: true, slug: true },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
          hasPrev: pageNum > 1,
          hasNext: pageNum < totalPages,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get product by ID
 */
async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'ບໍ່ພົບຂໍ້ມູນສິນຄ້ານີ້ (Product not found)',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new product (Admin)
 */
async function createProduct(req, res, next) {
  try {
    const {
      name,
      nameLao,
      description,
      price,
      originalPrice,
      stock,
      image,
      images,
      categoryId,
      isFeatured,
      isActive,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        nameLao,
        description: description || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock, 10),
        image,
        images: images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
        categoryId: categoryId || null,
        isFeatured: Boolean(isFeatured),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'ເພີ່ມສິນຄ້າໃໝ່ສຳເລັດ',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update product (Admin)
 */
async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      nameLao,
      description,
      price,
      originalPrice,
      stock,
      image,
      images,
      categoryId,
      isFeatured,
      isActive,
    } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(nameLao && { nameLao }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && { originalPrice: originalPrice ? parseFloat(originalPrice) : null }),
        ...(stock !== undefined && { stock: parseInt(stock, 10) }),
        ...(image && { image }),
        ...(images !== undefined && { images: typeof images === 'string' ? images : JSON.stringify(images) }),
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: {
        category: true,
      },
    });

    res.json({
      success: true,
      message: 'ອັບເດດຂໍ້ມູນສິນຄ້າສຳເລັດ',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete product (Admin)
 */
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'ບໍ່ພົບສິນຄ້າ' });
    }

    // Clean up local or cloud image if present
    if (product.image) {
      await deleteImage(null, product.image);
    }

    await prisma.product.delete({ where: { id } });

    res.json({
      success: true,
      message: 'ລຶບສິນຄ້າສຳເລັດ',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get products with low stock (threshold <= 5) for Admin Dashboard
 */
async function getLowStock(req, res, next) {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 5;
    const products = await getLowStockProducts(threshold);

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock,
};
