import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { productApi } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { formatLAK, getImageUrl } from '../utils/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCheckoutOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    productApi.getById(id)
      .then((res) => {
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          setError('ບໍ່ພົບສິນຄ້າ');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'ບໍ່ພົບສິນຄ້າ');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດຂໍ້ມູນສິນຄ້າ...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{error || 'ບໍ່ພົບຂໍ້ມູນສິນຄ້ານີ້'}</h2>
        <Link to="/" className="btn btn-primary">
          <ChevronLeft size={18} />
          <span>ກັບຄືນໜ້າຫຼັກ</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)' }}>ໜ້າຫຼັກ</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link to={`/?category=${product.category.id}`} style={{ color: 'var(--text-secondary)' }}>
              {product.category.nameLao || product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.nameLao || product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="product-detail-layout">
        <style>{`
          @media (min-width: 768px) {
            .product-detail-layout { grid-template-columns: 1fr 1.2fr !important; }
          }
        `}</style>

        {/* Product Image */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            backgroundColor: '#fff',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '90px'
          }}>
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              style={{ width: '100%', height: 'auto', maxHeight: '520px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Product Information */}
        <div>
          
          {/* Category Pill */}
          {product.category && (
            <span style={{
              display: 'inline-block',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '0.75rem',
            }}>
              {product.category.nameLao || product.category.name}
            </span>
          )}

          {/* Title */}
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.5rem' }}>
            {product.nameLao || product.name}
          </h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            {product.name}
          </p>

          {/* Pricing Box */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatLAK(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '1.125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatLAK(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.375rem' }}>
              ສະຖານະສະຕັອກ (Inventory Status):
            </div>
            {isOutOfStock ? (
              <div className="badge badge-stock-out" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                🔴 ສິນຄ້າໝົດສະຕັອກແລ້ວ (Out of Stock)
              </div>
            ) : isLowStock ? (
              <div className="badge badge-stock-low" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                ⚠️ ສິນຄ້າໃກ້ໝົດ! ເຫຼືອພຽງ {product.stock} ຊິ້ນໃນສະຕັອກ
              </div>
            ) : (
              <div className="badge badge-stock-in" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                🟢 ມີສິນຄ້າພ້ອມຈັດສົ່ງ ({product.stock} ຊິ້ນ)
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>ລາຍລະອຽດສິນຄ້າ:</h3>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Quantity Controls & Action Buttons */}
          {!isOutOfStock && (
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">ເລືອກຈຳນວນ:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: '#fff', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.125rem' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 1rem', fontWeight: 700, fontSize: '1rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    style={{ padding: '0.625rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.125rem' }}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  ສັ່ງໄດ້ສູງສຸດ {product.stock} ຊິ້ນ
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  <ShoppingCart size={20} />
                  <span>ໃສ່ກະຕ່າສິນຄ້າ</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn btn-lg"
                  style={{ backgroundColor: '#f59e0b', color: '#fff', flex: 1, minWidth: '180px', fontWeight: 700 }}
                >
                  <span>ສັ່ງຊື້ທັນທີ (Buy Now)</span>
                </button>
              </div>
            </div>
          )}

          {/* Toast Notification */}
          {addedToast && (
            <div style={{
              backgroundColor: 'var(--success-bg)',
              border: '1px solid #86efac',
              color: 'var(--success)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontWeight: 600,
            }}>
              <Check size={18} />
              <span>ເພີ່ມສິນຄ້າໃສ່ກະຕ່າຮຽບຮ້ອຍແລ້ວ!</span>
            </div>
          )}

          {/* Guarantees Box */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <Truck size={18} color="var(--primary)" />
              <span>ຈັດສົ່ງທົ່ວປະເທດລາວ</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={18} color="var(--success)" />
              <span>ຮັບປະກັນສິນຄ້າແທ້ 100%</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
