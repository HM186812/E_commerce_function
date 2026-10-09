/**
 * Format numbers as Lao Kip (₭)
 * @param {number} amount
 * @returns {string}
 */
export function formatLAK(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 ₭';
  return `${new Intl.NumberFormat('lo-LA').format(amount)} ₭`;
}

/**
 * Format date in Lao or readable format
 * @param {string | Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get human readable status, colors, and labels
 * @param {string} status
 */
export function getStatusInfo(status) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'ລໍຖ້າກວດສອບ',
        labelEn: 'Pending',
        badgeClass: 'badge-pending',
        color: '#b45309',
        bgColor: '#fef3c7',
      };
    case 'PAID':
      return {
        label: 'ຊຳລະເງິນແລ້ວ',
        labelEn: 'Paid',
        badgeClass: 'badge-paid',
        color: '#047857',
        bgColor: '#ecfdf5',
      };
    case 'SHIPPED':
      return {
        label: 'ກຳລັງຈັດສົ່ງ',
        labelEn: 'Shipped',
        badgeClass: 'badge-shipped',
        color: '#1d4ed8',
        bgColor: '#eff6ff',
      };
    case 'COMPLETED':
      return {
        label: 'ສຳເລັດແລ້ວ',
        labelEn: 'Completed',
        badgeClass: 'badge-completed',
        color: '#15803d',
        bgColor: '#f0fdf4',
      };
    case 'CANCELLED':
      return {
        label: 'ຍົກເລີກແລ້ວ',
        labelEn: 'Cancelled',
        badgeClass: 'badge-cancelled',
        color: '#b91c1c',
        bgColor: '#fef2f2',
      };
    default:
      return {
        label: status,
        labelEn: status,
        badgeClass: 'badge-pending',
        color: '#64748b',
        bgColor: '#f1f5f9',
      };
  }
}

/**
 * Helper to ensure image URLs point correctly to backend or external CDN
 * @param {string} url
 */
export function getImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Local static file
  return url.startsWith('/') ? url : `/${url}`;
}
