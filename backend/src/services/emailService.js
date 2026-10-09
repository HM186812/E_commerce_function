const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer Transporter
 */
function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Send order receipt email to customer
 * @param {string} toEmail
 * @param {Object} order
 */
async function sendOrderReceiptEmail(toEmail, order) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Service] Skipped: SMTP not configured');
    return { success: false, reason: 'smtp_not_configured' };
  }

  const formattedTotal = new Intl.NumberFormat('lo-LA').format(order.totalAmount);
  const itemsHtml = order.items
    ?.map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName || item.product?.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${new Intl.NumberFormat('lo-LA').format(item.price)} ₭</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${new Intl.NumberFormat('lo-LA').format(item.price * item.quantity)} ₭</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px;">
        <h2 style="color: #1e3a8a; margin: 0;">ໃບຢືນຢັນການສັ່ງຊື້ສິນຄ້າ / Order Confirmation</h2>
        <p style="color: #666; margin: 5px 0 0;">ຂອບໃຈທີ່ໃຊ້ບໍລິການກັບຮ້ານຂອງພວກເຮົາ!</p>
      </div>

      <div style="margin: 20px 0; background-color: #f8fafc; padding: 15px; border-radius: 6px;">
        <p style="margin: 4px 0;"><strong>ເລກບິນ / Order ID:</strong> <span style="color: #2563eb;">#${order.orderNumber}</span></p>
        <p style="margin: 4px 0;"><strong>ຊື່ລູກຄ້າ / Customer:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0;"><strong>ເບີໂທ / Phone:</strong> ${order.customerPhone}</p>
        <p style="margin: 4px 0;"><strong>ທີ່ຢູ່ຈັດສົ່ງ / Address:</strong> ${order.customerAddress}</p>
        <p style="margin: 4px 0;"><strong>ສະຖານະ / Status:</strong> <span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${order.status}</span></p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f1f5f9;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1;">ລາຍການ</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #cbd5e1;">ຈຳນວນ</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e1;">ລາຄາ/ຊິ້ນ</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e1;">ລວມ</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 15px; padding-top: 10px; border-top: 2px solid #e2e8f0;">
        <h3 style="margin: 0; color: #1e3a8a;">ຍອດຊຳລະທັງໝົດ: <span style="color: #dc2626;">${formattedTotal} ₭</span></h3>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
        <p>ຫາກມີຂໍ້ສົງໄສ ກະລຸນາຕິດຕໍ່ພວກເຮົາ ຫຼື ຕອບກັບອີເມວນີ້.</p>
        <p>© 2026 Lao E-Commerce. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Lao E-Commerce" <noreply@lao-ecommerce.com>',
      to: toEmail,
      subject: `[Lao E-Commerce] ຢືນຢັນການສັ່ງຊື້ #${order.orderNumber}`,
      html: html,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Service] Error sending receipt:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOrderReceiptEmail,
};
