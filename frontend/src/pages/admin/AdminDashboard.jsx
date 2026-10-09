import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
  CheckCircle,
  Eye,
  Loader2,
} from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { productApi } from '../../api/productApi';
import { formatLAK, formatDate, getStatusInfo, getImageUrl } from '../../utils/format';
import SlipViewerModal from '../../components/SlipViewerModal';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSlipOrder, setActiveSlipOrder] = useState(null);
  const [updatingStockId, setUpdatingStockId] = useState(null);
  const [restockAmount, setRestockAmount] = useState({});

  const fetchStats = () => {
    setLoading(true);
    dashboardApi.getStats()
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickRestock = async (productId) => {
    const qty = parseInt(restockAmount[productId] || 10, 10);
    if (!qty || qty <= 0) return;

    setUpdatingStockId(productId);
    try {
      const product = stats.lowStockProducts.find((p) => p.id === productId);
      if (product) {
        await productApi.update(productId, {
          stock: product.stock + qty,
        });
        fetchStats();
      }
    } catch (err) {
      alert('ອັບເດດສະຕັອກບໍ່ສຳເລັດ: ' + err.message);
    } finally {
      setUpdatingStockId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດຂໍ້ມູນສະຖິຕິ Dashboard...</p>
      </div>
    );
  }

  const { summary, lowStockProducts, recentOrders, salesTrend } = stats || {};

  return (
    <div>
      
      {/* Page Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          📊 ພາບລວມລະບົບຮ້ານຄ້າ (Dashboard)
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          ສະຫຼຸບຍອດຂາຍ, ສະຖານະ Order, ແລະ ລາຍການແຈ້ງເຕືອນສະຕັອກ
        </p>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        
        {/* Total Revenue */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>ຍອດຂາຍລວມ (Total Revenue)</div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatLAK(summary?.totalRevenue || 0)}
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid #2563eb' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Order ທັງໝົດ (Total Orders)</div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {summary?.totalOrders || 0} ລາຍການ
            </div>
          </div>
        </div>

        {/* Pending Slips */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid #f59e0b', backgroundColor: summary?.pendingOrders > 0 ? '#fffbeb' : '#fff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#b45309', fontWeight: 600 }}>ລໍຖ້າກວດສອບສະລິບ</div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#92400e' }}>
              {summary?.pendingOrders || 0} ລາຍການ
            </div>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderLeft: '4px solid #ef4444', backgroundColor: summary?.lowStockCount > 0 ? '#fef2f2' : '#fff' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#b91c1c', fontWeight: 600 }}>ສິນຄ້າໃກ້ໝົດສະຕັອກ (≤5)</div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#991b1b' }}>
              {summary?.lowStockCount || 0} ລາຍການ
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2.5rem' }} className="dashboard-grid-layout">
        <style>{`
          @media (min-width: 1024px) {
            .dashboard-grid-layout { grid-template-columns: 1.2fr 1fr !important; }
          }
        `}</style>

        {/* Low Stock Items Section (4. Inventory Logic) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--danger)" />
              <h2 style={{ fontSize: '1.0625rem', fontWeight: 800 }}>
                ⚠️ ສິນຄ້າໃກ້ໝົດສະຕັອກ (Inventory Alerts)
              </h2>
            </div>
            <Link to="/admin/products" className="btn btn-secondary btn-sm">
              <span>ຈັດການທັງໝົດ</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {lowStockProducts?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--success)' }}>
              <CheckCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontWeight: 600 }}>ສິນຄ້າທຸກລາຍການມີສະຕັອກພຽງພໍ!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {lowStockProducts?.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: product.stock === 0 ? '#fef2f2' : '#fff7ed',
                    border: `1px solid ${product.stock === 0 ? '#fecaca' : '#fed7aa'}`,
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{product.nameLao || product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ລາຄາ: {formatLAK(product.price)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={product.stock === 0 ? 'badge badge-stock-out' : 'badge badge-stock-low'}>
                      {product.stock === 0 ? 'ໝົດແລ້ວ (0)' : `ເຫຼືອ ${product.stock}`}
                    </span>

                    <button
                      onClick={() => handleQuickRestock(product.id)}
                      disabled={updatingStockId === product.id}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {updatingStockId === product.id ? '...' : '+10 ສະຕັອກ'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7-Day Sales Trend Summary */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <TrendingUp size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '1.0625rem', fontWeight: 800 }}>📈 ຍອດຂາຍ 7 ວັນຜ່ານມາ</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {salesTrend?.map((day, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{day.date} ({day.day})</span>
                <span style={{ fontWeight: 700, color: day.revenue > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {formatLAK(day.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 800 }}>📦 ລາຍການ Order ຫຼ້າສຸດ</h2>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <span>ເບິ່ງ Order ທັງໝົດ</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>ເລກບິນ</th>
                <th>ລູກຄ້າ</th>
                <th>ສະຖານະ</th>
                <th>ຮູບສະລິບ</th>
                <th style={{ textAlign: 'right' }}>ຍອດລວມ</th>
                <th style={{ textAlign: 'center' }}>ຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>#{order.orderNumber}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                    </td>
                    <td>
                      <span className={`badge ${statusInfo.badgeClass}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      {order.paymentSlipUrl ? (
                        <button
                          onClick={() => setActiveSlipOrder(order)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--primary)' }}
                        >
                          <Eye size={12} />
                          <span>ເບິ່ງສະລິບ</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ບໍ່ມີ</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatLAK(order.totalAmount)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link to={`/admin/orders?search=${order.orderNumber}`} className="btn btn-secondary btn-sm">
                        ກວດສອບ
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Slip Viewer Modal */}
      <SlipViewerModal
        order={activeSlipOrder}
        isOpen={Boolean(activeSlipOrder)}
        onClose={() => setActiveSlipOrder(null)}
        onConfirmPaid={async (orderId) => {
          // Will reload dashboard stats after confirming paid
          fetchStats();
        }}
      />

    </div>
  );
}
