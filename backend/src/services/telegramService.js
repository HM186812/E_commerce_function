const axios = require('axios');
const prisma = require('../config/db');

/**
 * Get active Telegram credentials from settings or environment variables
 */
async function getTelegramConfig() {
  try {
    const setting = await prisma.shopSetting.findUnique({
      where: { id: 'default' },
    });

    const botToken = setting?.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = setting?.telegramChatId || process.env.TELEGRAM_CHAT_ID;
    const isEnabled = setting ? setting.telegramEnabled : (process.env.TELEGRAM_ENABLED === 'true');

    return {
      botToken,
      chatId,
      isEnabled: Boolean(isEnabled && botToken && chatId),
    };
  } catch (error) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const isEnabled = process.env.TELEGRAM_ENABLED === 'true';

    return {
      botToken,
      chatId,
      isEnabled: Boolean(isEnabled && botToken && chatId),
    };
  }
}

/**
 * Send a text notification to Telegram
 * @param {string} text - Message text (HTML formatted)
 */
async function sendTelegramMessage(text) {
  const { botToken, chatId, isEnabled } = await getTelegramConfig();

  if (!isEnabled || !botToken || !chatId) {
    console.log('[Telegram Service] Notification skipped (not configured or disabled)');
    return { success: false, reason: 'not_configured' };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('[Telegram Service] Send error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

/**
 * Send a photo with caption to Telegram (for Payment Slips)
 * @param {string} photoUrl - Public URL of the image
 * @param {string} caption - Message caption (HTML formatted)
 */
async function sendTelegramPhoto(photoUrl, caption) {
  const { botToken, chatId, isEnabled } = await getTelegramConfig();

  if (!isEnabled || !botToken || !chatId) {
    return { success: false, reason: 'not_configured' };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendPhoto`;
    const response = await axios.post(url, {
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
      parse_mode: 'HTML',
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('[Telegram Photo] Send error:', error.response?.data || error.message);
    // Fallback to text message if photo sending fails
    return sendTelegramMessage(`${caption}\n\n📷 <i>ຮູບສະລິບ: ${photoUrl}</i>`);
  }
}

/**
 * Send New Order Notification to Admin
 * @param {Object} order - Complete order object with items
 */
async function notifyNewOrder(order) {
  const formattedTotal = new Intl.NumberFormat('lo-LA').format(order.totalAmount);
  const itemsList = order.items
    ?.map(
      (item, idx) =>
        `   ${idx + 1}. <b>${item.productName || item.product?.name}</b> x ${item.quantity} (${new Intl.NumberFormat('lo-LA').format(item.price)} ₭)`
    )
    .join('\n') || '   - ບໍ່ມີຂໍ້ມູນລາຍການ';

  const message = `
🛍️ <b>【 ມີ ORDER ໃໝ່ເຂົ້າມາແລ້ວ! 】</b> 🛍️
━━━━━━━━━━━━━━━━━━━━
🆔 <b>ເລກບິນ:</b> <code>${order.orderNumber}</code>
👤 <b>ລູກຄ້າ:</b> ${order.customerName}
📞 <b>ເບີໂທ:</b> <code>${order.customerPhone}</code>
📍 <b>ທີ່ຢູ່ຈັດສົ່ງ:</b> ${order.customerAddress}
📝 <b>ໝາຍເຫດ:</b> ${order.customerNote || 'ບໍ່ມີ'}
💳 <b>ວິທີຊຳລະ:</b> ${order.paymentMethod === 'BCEL_ONE_QR' ? 'BCEL One QR Code' : 'ເກັບເງິນປາຍທາງ (COD)'}
⚡ <b>ສະຖານະ:</b> <b>⏳ ${order.status}</b>

📦 <b>ລາຍການສິນຄ້າ:</b>
${itemsList}

💰 <b>ຍອດລວມທັງໝົດ:</b> <b>${formattedTotal} ₭ (LAK)</b>
━━━━━━━━━━━━━━━━━━━━
${order.paymentSlipUrl ? '🧾 <b>ມີການແນບຮູບສະລິບໂອນເງິນແລ້ວ</b> ກະລຸນາກວດສອບ!' : '⚠️ <b>ຍັງບໍ່ທັນແນບສະລິບ</b>'}
🕒 ເວລາ: ${new Date().toLocaleString('lo-LA', { timeZone: 'Asia/Vientiane' })}
`;

  if (order.paymentSlipUrl && (order.paymentSlipUrl.startsWith('http://') || order.paymentSlipUrl.startsWith('https://'))) {
    return sendTelegramPhoto(order.paymentSlipUrl, message);
  } else {
    return sendTelegramMessage(message);
  }
}

/**
 * Send Low Stock Alert to Admin
 * @param {Object} product - Product object
 */
async function notifyLowStock(product) {
  const message = `
⚠️ <b>【 ແຈ້ງເຕືອນສະຕັອກສິນຄ້າໃກ້ໝົດ! 】</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>ສິນຄ້າ:</b> ${product.name} (${product.nameLao || ''})
🆔 <b>ID:</b> <code>${product.id}</code>
📉 <b>ຈຳນວນທີ່ເຫຼືອໃນສະຕັອກ:</b> <b>${product.stock} ຊິ້ນ</b> (ຕໍ່າກວ່າ 5 ຊິ້ນ)
💰 <b>ລາຄາ:</b> ${new Intl.NumberFormat('lo-LA').format(product.price)} ₭

👉 <i>ກະລຸນາເພີ່ມສະຕັອກສິນຄ້າໃນ Dashboard Admin!</i>
━━━━━━━━━━━━━━━━━━━━
`;
  return sendTelegramMessage(message);
}

/**
 * Send Order Status Update Alert to Customer or Admin
 * @param {Object} order - Updated order
 */
async function notifyOrderStatusChanged(order) {
  const statusLabels = {
    PENDING: '⏳ ລໍຖ້າກວດສອບ (Pending)',
    PAID: '✅ ຊຳລະເງິນສຳເລັດ (Paid)',
    SHIPPED: '🚚 ກຳລັງຈັດສົ່ງ (Shipped)',
    COMPLETED: '🎉 ສຳເລັດແລ້ວ (Completed)',
    CANCELLED: '❌ ຍົກເລີກແລ້ວ (Cancelled)',
  };

  const message = `
🔔 <b>【 ອັບເດດສະຖານະ Order #${order.orderNumber} 】</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>ລູກຄ້າ:</b> ${order.customerName}
📞 <b>ເບີໂທ:</b> ${order.customerPhone}
🔄 <b>ສະຖານະໃໝ່:</b> <b>${statusLabels[order.status] || order.status}</b>
${order.adminNote ? `📌 <b>ໝາຍເຫດຈາກຮ້ານ:</b> ${order.adminNote}` : ''}
💰 <b>ຍອດລວມ:</b> ${new Intl.NumberFormat('lo-LA').format(order.totalAmount)} ₭
━━━━━━━━━━━━━━━━━━━━
`;
  return sendTelegramMessage(message);
}

module.exports = {
  getTelegramConfig,
  sendTelegramMessage,
  sendTelegramPhoto,
  notifyNewOrder,
  notifyLowStock,
  notifyOrderStatusChanged,
};
