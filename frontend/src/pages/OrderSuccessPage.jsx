import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Send, Printer, Home, User, ExternalLink, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderApi } from '../api/orderApi';
import { formatLAK, formatDate, getStatusInfo, getImageUrl } from '../utils/format';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Fire festive confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!order && id) {
      orderApi.getById(id)
        .then((res) => {
          if (res.success && res.data) {
            setOrder(res.data);
          }
        })
        .catch((err) => console.error('Failed to load order:', err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດຂໍ້ມູນໃບບິນ...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <h2>ບໍ່ພົບຂໍ້ມູນ Order ນີ້</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          ກັບຄືນໜ້າຫຼັກ
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem', maxWidth: '780px' }}>
      
      {/* Success Card Header */}
      <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', marginBottom: '2rem', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)', border: '1px solid #bbf7d0' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#22c55e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 20px rgba(34, 197, 94, 0.35)' }}>
          <CheckCircle size={42} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14532d', marginBottom: '0.5rem' }}>
          ສັ່ງຊື້ສິນຄ້າສຳເລັດແລ້ວ!
        </h1>
        <p style={{ fontSize: '1rem', color: '#166534', marginBottom: '1.25rem' }}>
          ຂອບໃຈສຳລັບການສັ່ງຊື້ ລະຫັດບິນຂອງທ່ານແມ່ນ: <strong style={{ color: '#15803d' }}>#{order.orderNumber}</strong>
        </p>

        {/* Telegram Notification Alert */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1d4ed8', padding: '0.4rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600 }}>
          <Send size={15} color="#2563eb" />
          <span>ລະບົບໄດ້ສົ່ງແຈ້ງເຕືອນຫາ Telegram Bot ຂອງຮ້ານແລ້ວ</span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ວັນທີສັ່ງຊື້:</div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{formatDate(order.createdAt)}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ສະຖານະ:</div>
            <span className={`badge ${statusInfo.badgeClass}`} style={{ fontSize: '0.8125rem', padding: '0.3rem 0.75rem' }}>
              {statusInfo.label} ({statusInfo.labelEn})
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ວິທີຊຳລະເງິນ:</div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
              {order.paymentMethod === 'BCEL_ONE_QR' ? 'BCEL One QR' : 'ເກັບເງິນປາຍທາງ'}
            </div>
          </div>
        </div>

        {/* Customer & Delivery Details */}
        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            📍 ຂໍ້ມູນຜູ້ຮັບ ແລະ ທີ່ຢູ່ຈັດສົ່ງ
          </h3>
          <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p><strong>ຊື່ລູກຄ້າ:</strong> {order.customerName}</p>
            <p><strong>ເບີໂທ:</strong> {order.customerPhone}</p>
            <p><strong>ທີ່ຢູ່:</strong> {order.customerAddress}</p>
            {order.customerNote && <p><strong>ໝາຍເຫດ:</strong> {order.customerNote}</p>}
          </div>
        </div>

        {/* Order Items Table */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.875rem' }}>
          📦 ລາຍການສິນຄ້າ ({order.items?.length || 0})
        </h3>
        <table className="custom-table" style={{ marginBottom: '1.5rem' }}>
          <thead>
            <tr>
              <th>ສິນຄ້າ</th>
              <th style={{ textAlign: 'center' }}>ຈຳນວນ</th>
              <th style={{ textAlign: 'right' }}>ລາຄາ</th>
              <th style={{ textAlign: 'right' }}>ລວມ</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.productName || item.product?.name}</div>
                </td>
                <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{formatLAK(item.price)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                  {formatLAK(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginRight: '1rem' }}>ຍອດລວມທັງໝົດ:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)' }}>
              {formatLAK(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Slip Attachment Display */}
        {order.paymentSlipUrl && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
              🧾 ຮູບສະລິບໂອນເງິນທີ່ແນບ:
            </div>
            <a href={getImageUrl(order.paymentSlipUrl)} target="_blank" rel="noreferrer">
              <img
                src={getImageUrl(order.paymentSlipUrl)}
                alt="Payment Slip"
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
              />
            </a>
          </div>
        )}

      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          <span>ກັບຄືນໜ້າຫຼັກ</span>
        </Link>
        
        <Link to="/my-orders" className="btn btn-secondary">
          <User size={18} />
          <span>ເບິ່ງປະຫວັດການສັ່ງຊື້</span>
        </Link>

        <button onClick={() => window.print()} className="btn btn-secondary">
          <Printer size={18} />
          <span>ພິມໃບບິນ</span>
        </button>
      </div>

    </div>
  );
}
