const prisma = require('../config/db');
const { validateStock, deductStock, restoreStock } = require('../services/inventoryService');
const { notifyNewOrder, notifyOrderStatusChanged } = require('../services/telegramService');
const { sendOrderReceiptEmail } = require('../services/emailService');

/**
 * Generate human-readable order number (e.g. ORD-261009-8472)
 */
function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomSuffix}`;
}

/**
 * Create a new order with atomic stock deduction and Telegram notification
 */
async function createOrder(req, res, next) {
  try {
    const {
      customerName,
      customerPhone,
      customerAddress,
      customerNote,
      paymentMethod = 'BCEL_ONE_QR',
      paymentSlipUrl,
      paymentSlipPublicId,
      items,
    } = req.body;

    const userId = req.user?.id || null;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ກະຕ່າສິນຄ້າວ່າງເປົ່າ (Cart is empty)',
      });
    }

    // Step 1: Validate stock availability
    const stockValidation = await validateStock(items);
    if (!stockValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'ບາງສິນຄ້າມີຈຳນວນບໍ່ພໍໃນສະຕັອກ (Insufficient stock)',
        errors: stockValidation.errors,
      });
    }

    // Step 2: Calculate total amount securely from verified DB prices
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = stockValidation.productsMap.get(item.productId);
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const orderNumber = generateOrderNumber();

    // Step 3: Atomic Transaction (Deduct stock & Create Order)
    const newOrder = await prisma.$transaction(async (tx) => {
      // 3a. Deduct inventory
      await deductStock(items, tx);

      // 3b. Create Order & OrderItems
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          customerName,
          customerPhone,
          customerAddress,
          customerNote: customerNote || null,
          totalAmount,
          paymentMethod,
          paymentSlipUrl: paymentSlipUrl || null,
          paymentSlipPublicId: paymentSlipPublicId || null,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, nameLao: true, image: true, price: true },
              },
            },
          },
        },
      });

      return createdOrder;
    });

    // Step 4: Asynchronously send Telegram notification to Admin
    notifyNewOrder(newOrder)
      .then(async (result) => {
        if (result?.success) {
          await prisma.order.update({
            where: { id: newOrder.id },
            data: { telegramNotified: true },
          });
        }
      })
      .catch((err) => console.error('[Order Controller] Telegram notification failed:', err.message));

    // Step 5: Asynchronously send Email confirmation if user has email
    if (req.user?.email) {
      sendOrderReceiptEmail(req.user.email, newOrder).catch((err) =>
        console.error('[Order Controller] Email receipt failed:', err.message)
      );
    }

    res.status(201).json({
      success: true,
      message: 'ສັ່ງຊື້ສິນຄ້າສຳເລັດແລ້ວ! ກະລຸນາລໍຖ້າຮ້ານກວດສອບສະລິບ',
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get current logged in user's orders
 */
async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, nameLao: true, image: true, price: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single order by ID or orderNumber
 */
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { id: true, email: true, name: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'ບໍ່ພົບຂໍ້ມູນລາຍການສັ່ງຊື້ນີ້',
      });
    }

    // Ensure non-admin users only see their own orders
    if (req.user && req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'ທ່ານບໍ່ມີສິດເບິ່ງລາຍການນີ້',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all orders for Admin with filters and pagination
 */
async function getAllOrders(req, res, next) {
  try {
    const {
      status,
      search,
      page = 1,
      limit = 15,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
      ];
    }

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, nameLao: true, image: true, price: true },
              },
            },
          },
          user: {
            select: { id: true, email: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        orders,
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
 * Update order status (Admin)
 */
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentOrder) {
      return res.status(404).json({
        success: false,
        message: 'ບໍ່ພົບລາຍການສັ່ງຊື້',
      });
    }

    // If changing from active to CANCELLED, restore product stock
    let updatedOrder;
    if (status === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
      updatedOrder = await prisma.$transaction(async (tx) => {
        await restoreStock(currentOrder.items, tx);

        return tx.order.update({
          where: { id },
          data: {
            status,
            ...(adminNote !== undefined && { adminNote }),
          },
          include: {
            items: {
              include: { product: true },
            },
          },
        });
      });
    } else {
      updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          status,
          ...(adminNote !== undefined && { adminNote }),
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    // Send Telegram alert about status change
    notifyOrderStatusChanged(updatedOrder).catch((err) =>
      console.error('[Order Controller] Status change notification failed:', err.message)
    );

    res.json({
      success: true,
      message: `ອັບເດດສະຖານະເປັນ ${status} ສຳເລັດແລ້ວ`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Upload or Update payment slip for existing order
 */
async function attachPaymentSlip(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentSlipUrl, paymentSlipPublicId } = req.body;

    if (!paymentSlipUrl) {
      return res.status(400).json({
        success: false,
        message: 'ກະລຸນາລະບຸ URL ຮູບສະລິບ (paymentSlipUrl required)',
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        paymentSlipUrl,
        paymentSlipPublicId: paymentSlipPublicId || null,
      },
      include: { items: true },
    });

    // Notify Telegram with slip image
    notifyNewOrder(order).catch((err) =>
      console.error('[Order Slip] Telegram alert failed:', err.message)
    );

    res.json({
      success: true,
      message: 'ແນບຮູບສະລິບສຳເລັດແລ້ວ',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  attachPaymentSlip,
};
