import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { uploadApi } from '../api/uploadApi';
import { formatLAK, formatDate, getStatusInfo, getImageUrl } from '../utils/format';
import { useAuth } from '../context/AuthContext';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingSlipId, setUploadingSlipId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    orderApi.getMyOrders()
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUploadSlip = async (orderId, file) => {
    if (!file) return;
    setUploadingSlipId(orderId);
    try {
      const uploadRes = await uploadApi.uploadSingle(file, 'ecommerce/slips');
      if (uploadRes.success && uploadRes.data?.url) {
        await orderApi.attachSlip(orderId, {
          paymentSlipUrl: uploadRes.data.url,
          paymentSlipPublicId: uploadRes.data.publicId,
        });
        fetchOrders();
      }
    } catch (err) {
      alert('ອັບໂຫຼດສະລິບບໍ່ສຳເລັດ: ' + (err.message || 'Error'));
    } finally {
      setUploadingSlipId(null);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <ShoppingBag size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>ກະລຸນາເຂົ້າສູ່ລະບົບ</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>ເຂົ້າສູ່ລະບົບເພື່ອເບິ່ງປະຫວັດການສັ່ງຊື້ ແລະ ສະຖານະສິນຄ້າຂອງທ່ານ</p>
        <Link to="/login" className="btn btn-primary">
          ເຂົ້າສູ່ລະບົບດຽວນີ້
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.25rem 5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            📦 ປະຫວັດການສັ່ງຊື້ຂອງຂ້ອຍ
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ຕິດຕາມສະຖານະ Order ແລະ ແນບສະລິບໂອນເງິນ
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>ທ່ານຍັງບໍ່ມີລາຍການສັ່ງຊື້ເທື່ອ</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            ເລືອກຊື້ສິນຄ້າ ແລະ ສັ່ງຊື້ໄດ້ງ່າຍໆຜ່ານເວັບໄຊຂອງພວກເຮົາ
          </p>
          <Link to="/" className="btn btn-primary">
            ເລີ່ມຕົ້ນເລືອກຊື້ສິນຄ້າ
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
                
                {/* Order Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginRight: '0.75rem' }}>
                      #{order.orderNumber}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  <span className={`badge ${statusInfo.badgeClass}`} style={{ fontSize: '0.8125rem', padding: '0.35rem 0.75rem' }}>
                    {statusInfo.label} ({statusInfo.labelEn})
                  </span>
                </div>

                {/* Items preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {order.items?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={getImageUrl(item.product?.image)}
                          alt={item.productName}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.productName || item.product?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ຈຳນວນ: {item.quantity} ຊິ້ນ</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {formatLAK(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Bar: Total & Slip Upload if needed */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {order.paymentSlipUrl ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>
                        <CheckCircle2 size={16} />
                        <span>ແນບສະລິບແລ້ວ</span>
                      </div>
                    ) : order.paymentMethod === 'BCEL_ONE_QR' && order.status === 'PENDING' ? (
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', backgroundColor: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600 }}>
                        <Upload size={14} />
                        <span>{uploadingSlipId === order.id ? 'ກຳລັງອັບໂຫຼດ...' : 'ແນບຮູບສະລິບດຽວນີ້'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleUploadSlip(order.id, e.target.files[0])}
                          disabled={uploadingSlipId === order.id}
                        />
                      </label>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>ຍອດລວມ:</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {formatLAK(order.totalAmount)}
                      </span>
                    </div>

                    <Link to={`/order-success/${order.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={14} />
                      <span>ໃບບິນ</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
