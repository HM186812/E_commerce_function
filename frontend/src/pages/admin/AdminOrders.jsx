import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Eye,
  Search,
  Filter,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  Loader2,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import { formatLAK, formatDate, getStatusInfo, getImageUrl } from '../../utils/format';
import Pagination from '../../components/Pagination';
import SlipViewerModal from '../../components/SlipViewerModal';

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusFilter = searchParams.get('status') || 'ALL';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [activeSlipOrder, setActiveSlipOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    orderApi.getAllAdmin({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: searchQuery || undefined,
      page: currentPage,
      limit: 12,
    })
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data.orders);
          setPagination(res.data.pagination);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery, currentPage]);

  const updateParam = (key, val) => {
    const updated = new URLSearchParams(searchParams);
    if (val === undefined || val === null || val === '' || val === 'ALL') {
      updated.delete(key);
    } else {
      updated.set(key, val);
    }
    if (key !== 'page') updated.set('page', '1');
    setSearchParams(updated);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('ອັບເດດສະຖານະບໍ່ສຳເລັດ: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          📑 ຈັດການລາຍການສັ່ງຊື້ & ສະລິບໂອນ (Orders)
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          ກວດສອບສະລິບ, ປ່ຽນສະຖານະ, ແລະ ແຈ້ງເຕືອນລູກຄ້າ/Telegram
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        
        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.25rem' }}>
          {[
            { key: 'ALL', label: 'ທັງໝົດ' },
            { key: 'PENDING', label: '⏳ ລໍຖ້າກວດສະລິບ (Pending)' },
            { key: 'PAID', label: '✅ ຈ່າຍແລ້ວ (Paid)' },
            { key: 'SHIPPED', label: '🚚 ສົ່ງແລ້ວ (Shipped)' },
            { key: 'COMPLETED', label: '🎉 ສຳເລັດ (Completed)' },
            { key: 'CANCELLED', label: '❌ ຍົກເລີກ (Cancelled)' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => updateParam('status', tab.key)}
              className={`btn btn-sm ${statusFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="ຄົ້ນຫາເລກບິນ (#ORD), ຊື່, ເບີໂທ..."
            value={searchQuery}
            onChange={(e) => updateParam('search', e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດລາຍການ Order...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            ບໍ່ພົບລາຍການ Order
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ເລກບິນ / ວັນທີ</th>
                  <th>ຂໍ້ມູນລູກຄ້າ</th>
                  <th>ສິນຄ້າ</th>
                  <th>ຍອດລວມ</th>
                  <th>ຮູບສະລິບ</th>
                  <th>ສະຖານະ</th>
                  <th style={{ textAlign: 'center' }}>ປ່ຽນສະຖານະ</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  return (
                    <tr key={order.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>#{order.orderNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>📞 {order.customerPhone}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          📍 {order.customerAddress}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8125rem' }}>
                          {order.items?.map((item) => (
                            <div key={item.id} style={{ color: 'var(--text-secondary)' }}>
                              • {item.productName || item.product?.name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                          {formatLAK(order.totalAmount)}
                        </span>
                      </td>
                      <td>
                        {order.paymentSlipUrl ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                              src={getImageUrl(order.paymentSlipUrl)}
                              alt="Slip"
                              onClick={() => setActiveSlipOrder(order)}
                              style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                              title="ກົດເພື່ອເບິ່ງຮູບໃຫຍ່"
                            />
                            <button
                              onClick={() => setActiveSlipOrder(order)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.25rem 0.4rem', fontSize: '0.75rem' }}
                            >
                              <Eye size={12} />
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ຍັງບໍ່ແນບ</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${statusInfo.badgeClass}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="form-select"
                          style={{
                            fontSize: '0.8125rem',
                            padding: '0.35rem 0.6rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <option value="PENDING">⏳ ລໍຖ້າກວດສອບ (Pending)</option>
                          <option value="PAID">✅ ຊຳລະແລ້ວ (Paid)</option>
                          <option value="SHIPPED">🚚 ສົ່ງແລ້ວ (Shipped)</option>
                          <option value="COMPLETED">🎉 ສຳເລັດ (Completed)</option>
                          <option value="CANCELLED">❌ ຍົກເລີກ (Cancelled)</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={(p) => updateParam('page', p.toString())} />
      </div>

      {/* Slip Viewer Modal */}
      <SlipViewerModal
        order={activeSlipOrder}
        isOpen={Boolean(activeSlipOrder)}
        onClose={() => setActiveSlipOrder(null)}
        onConfirmPaid={async (orderId) => {
          await handleStatusChange(orderId, 'PAID');
        }}
      />

    </div>
  );
}
