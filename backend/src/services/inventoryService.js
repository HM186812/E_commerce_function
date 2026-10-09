const prisma = require('../config/db');
const { notifyLowStock } = require('./telegramService');

/**
 * Check if all items in cart have sufficient stock
 * @param {Array<{ productId: string, quantity: number }>} items
 * @returns {Promise<{ valid: boolean, errors: string[], productsMap: Map }>}
 */
async function validateStock(items) {
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
  });

  const productsMap = new Map(products.map((p) => [p.id, p]));
  const errors = [];

  for (const item of items) {
    const product = productsMap.get(item.productId);
    if (!product) {
      errors.push(`ສິນຄ້າລະຫັດ ${item.productId} ບໍ່ພົບ ຫຼື ຖືກປິດການຂາຍແລ້ວ`);
      continue;
    }
    if (product.stock < item.quantity) {
      errors.push(
        `ສິນຄ້າ "${product.name}" ມີຈຳນວນໃນສະຕັອກພຽງ ${product.stock} ຊິ້ນ (ທ່ານສັ່ງຊື້ ${item.quantity} ຊິ້ນ)`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    productsMap,
  };
}

/**
 * Deduct inventory for items in an order atomically and alert if stock is low
 * @param {Array<{ productId: string, quantity: number }>} items
 * @param {Object} tx - Prisma transaction client (optional)
 */
async function deductStock(items, tx = prisma) {
  const updatedProducts = [];
  const lowStockAlerts = [];

  for (const item of items) {
    const updated = await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });

    updatedProducts.push(updated);

    // If stock is now less than 5, trigger Telegram low stock alert
    if (updated.stock <= 5 && updated.stock >= 0) {
      lowStockAlerts.push(updated);
    }
  }

  // Trigger Telegram low stock notifications asynchronously
  for (const product of lowStockAlerts) {
    notifyLowStock(product).catch((err) =>
      console.error(`Failed to send low stock alert for ${product.name}:`, err.message)
    );
  }

  return updatedProducts;
}

/**
 * Restore stock if an order is cancelled
 * @param {Array<{ productId: string, quantity: number }>} items
 * @param {Object} tx - Prisma transaction client (optional)
 */
async function restoreStock(items, tx = prisma) {
  for (const item of items) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });
  }
}

/**
 * Get products that have stock less than or equal to threshold
 * @param {number} threshold
 */
async function getLowStockProducts(threshold = 5) {
  return prisma.product.findMany({
    where: {
      stock: { lte: threshold },
      isActive: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      stock: 'asc',
    },
  });
}

module.exports = {
  validateStock,
  deductStock,
  restoreStock,
  getLowStockProducts,
};
