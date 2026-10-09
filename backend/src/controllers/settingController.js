const prisma = require('../config/db');
const { sendTelegramMessage } = require('../services/telegramService');

/**
 * Get shop public settings (BCEL QR, Shop Info)
 */
async function getSettings(req, res, next) {
  try {
    let setting = await prisma.shopSetting.findUnique({
      where: { id: 'default' },
    });

    if (!setting) {
      setting = await prisma.shopSetting.create({
        data: {
          id: 'default',
          shopName: 'My Lao E-Commerce Store',
          shopPhone: '020 9999 8888',
          shopAddress: 'Vientiane Capital, Laos',
          bcelAccountName: 'LAO SHOP CO., LTD',
          bcelAccountNumber: '010-12-00-12345678-001',
          bcelQrImage: 'https://images.unsplash.com/photo-1595079672139-5451000f0744?auto=format&fit=crop&w=400&q=80',
          telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
          telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
          telegramEnabled: true,
          lowStockThreshold: 5,
        },
      });
    }

    // Mask sensitive Telegram token for non-admin requests
    const isAdmin = req.user && req.user.role === 'ADMIN';
    const safeData = {
      ...setting,
      telegramBotToken: isAdmin
        ? setting.telegramBotToken
        : setting.telegramBotToken
        ? '••••••••'
        : '',
    };

    res.json({
      success: true,
      data: safeData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update shop settings (Admin)
 */
async function updateSettings(req, res, next) {
  try {
    const {
      shopName,
      shopPhone,
      shopAddress,
      bcelQrImage,
      bcelAccountName,
      bcelAccountNumber,
      telegramBotToken,
      telegramChatId,
      telegramEnabled,
      lowStockThreshold,
    } = req.body;

    const updated = await prisma.shopSetting.upsert({
      where: { id: 'default' },
      update: {
        ...(shopName && { shopName }),
        ...(shopPhone && { shopPhone }),
        ...(shopAddress && { shopAddress }),
        ...(bcelQrImage !== undefined && { bcelQrImage }),
        ...(bcelAccountName && { bcelAccountName }),
        ...(bcelAccountNumber && { bcelAccountNumber }),
        ...(telegramBotToken !== undefined && { telegramBotToken }),
        ...(telegramChatId !== undefined && { telegramChatId }),
        ...(telegramEnabled !== undefined && { telegramEnabled: Boolean(telegramEnabled) }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold: parseInt(lowStockThreshold, 10) }),
      },
      create: {
        id: 'default',
        shopName: shopName || 'My Lao E-Commerce Store',
        shopPhone: shopPhone || '020 9999 8888',
        shopAddress: shopAddress || 'Vientiane Capital, Laos',
        bcelQrImage: bcelQrImage || null,
        bcelAccountName: bcelAccountName || 'LAO SHOP CO., LTD',
        bcelAccountNumber: bcelAccountNumber || '010-12-00-12345678-001',
        telegramBotToken: telegramBotToken || null,
        telegramChatId: telegramChatId || null,
        telegramEnabled: telegramEnabled !== undefined ? Boolean(telegramEnabled) : true,
        lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold, 10) : 5,
      },
    });

    res.json({
      success: true,
      message: 'ອັບເດດການຕັ້ງຄ່າຮ້ານສຳເລັດ',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Test Telegram Bot connection
 */
async function testTelegram(req, res, next) {
  try {
    const testMsg = `
🔔 <b>【 ທົດສອບການແຈ້ງເຕືອນ Telegram Bot 】</b>
━━━━━━━━━━━━━━━━━━━━
✅ ລະບົບເຊື່ອມຕໍ່ Telegram Bot ສຳເລັດແລ້ວ!
🕒 ເວລາ: ${new Date().toLocaleString('lo-LA', { timeZone: 'Asia/Vientiane' })}
━━━━━━━━━━━━━━━━━━━━
<i>ລະບົບພ້ອມຮັບການແຈ້ງເຕືອນ Order ໃໝ່ ແລະ ສິນຄ້າໃກ້ໝົດສະຕັອກ</i>
`;

    const result = await sendTelegramMessage(testMsg);

    if (result.success) {
      res.json({
        success: true,
        message: 'ສົ່ງຂໍ້ຄວາມທົດສອບຫາ Telegram ສຳເລັດແລ້ວ!',
      });
    } else {
      res.status(400).json({
        success: false,
        message: `ບໍ່ສາມາດສົ່ງຂໍ້ຄວາມໄດ້: ${result.error || result.reason || 'Unknown error'}`,
      });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateSettings,
  testTelegram,
};
