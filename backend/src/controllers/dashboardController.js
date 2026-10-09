const prisma = require('../config/db');

/**
 * Get comprehensive Admin Dashboard statistics
 */
async function getDashboardStats(req, res, next) {
  try {
    const setting = await prisma.shopSetting.findUnique({
      where: { id: 'default' },
    });
    const threshold = setting?.lowStockThreshold || 5;

    // Run parallel aggregation queries
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      lowStockProducts,
      totalProducts,
      recentOrders,
      allCompletedOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } } }),
      prisma.product.findMany({
        where: { stock: { lte: threshold }, isActive: true },
        include: { category: true },
        orderBy: { stock: 'asc' },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true },
          },
        },
      }),
      prisma.order.findMany({
        where: { status: { in: ['PAID', 'SHIPPED', 'COMPLETED'] } },
        select: { totalAmount: true, createdAt: true },
      }),
    ]);

    // Calculate total revenue
    const totalRevenue = allCompletedOrders.reduce((sum, ord) => sum + ord.totalAmount, 0);

    // Group sales by past 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('lo-LA', { weekday: 'short' });

      const dayRevenue = allCompletedOrders
        .filter((o) => o.createdAt.toISOString().slice(0, 10) === dateKey)
        .reduce((sum, o) => sum + o.totalAmount, 0);

      last7Days.push({
        date: dateKey,
        day: dayName,
        revenue: dayRevenue,
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          pendingOrders,
          paidOrders,
          lowStockCount: lowStockProducts.length,
          totalProducts,
        },
        lowStockProducts,
        recentOrders,
        salesTrend: last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboardStats,
};
