const prisma = require('../config/db');

/**
 * Get all categories with product counts
 */
async function getAllCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameLao: c.nameLao,
      slug: c.slug,
      description: c.description,
      image: c.image,
      productCount: c._count.products,
      createdAt: c.createdAt,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create a new category
 */
async function createCategory(req, res, next) {
  try {
    const { name, nameLao, description, image } = req.body;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const category = await prisma.category.create({
      data: {
        name,
        nameLao,
        slug: slug || `category-${Date.now()}`,
        description: description || null,
        image: image || null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'ສ້າງໝວດໝູ່ໃໝ່ສຳເລັດ',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update category
 */
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, nameLao, description, image } = req.body;

    const slug = name
      ? name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : undefined;

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(nameLao && { nameLao }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
      },
    });

    res.json({
      success: true,
      message: 'ອັບເດດໝວດໝູ່ສຳເລັດ',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete category
 */
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `ບໍ່ສາມາດລຶບໝວດໝູ່ນີ້ໄດ້ ເນື່ອງຈາກຍັງມີສິນຄ້າ ${productCount} ລາຍການຢູ່ໃນໝວດນີ້`,
      });
    }

    await prisma.category.delete({ where: { id } });

    res.json({
      success: true,
      message: 'ລຶບໝວດໝູ່ສຳເລັດ',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
