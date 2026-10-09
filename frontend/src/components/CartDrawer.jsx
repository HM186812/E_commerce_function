import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatLAK, getImageUrl } from '../utils/format';

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setIsCartOpen(false)}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideLeft 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideLeft {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Drawer Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>ກະຕ່າສິນຄ້າ ({totalItems})</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-muted)' }}>
                <ShoppingBag size={32} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>ຍັງບໍ່ມີສິນຄ້າໃນກະຕ່າ</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                ເລືອກຊື້ສິນຄ້າທີ່ທ່ານມັກ ແລ້ວກົດໃສ່ກະຕ່າໄດ້ເລີຍ!
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn btn-primary btn-sm">
                ເລີ່ມຕົ້ນເລືອກຊື້ສິນຄ້າ
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#f8fafc',
                }}
              >
                {/* Thumbnail */}
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />

                {/* Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                        {item.nameLao || item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}
                        title="ລຶບລາຍການ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
                      {formatLAK(item.price)}
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: '#fff' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{ padding: '0.25rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: item.quantity >= item.stock ? 'var(--text-muted)' : 'var(--text-secondary)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      ລວມ: {formatLAK(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ຍອດລວມທັງໝົດ:</span>
              <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatLAK(totalAmount)}
              </span>
            </div>

            <button
              onClick={handleProceedCheckout}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', gap: '0.75rem' }}
            >
              <span>ສັ່ງຊື້ສິນຄ້າ (Checkout)</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={clearCart}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '0.75rem', color: 'var(--danger)' }}
            >
              <Trash2 size={14} />
              <span>ລ້າງກະຕ່າທັງໝົດ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
