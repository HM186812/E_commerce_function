import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { formatLAK, getImageUrl } from '../utils/format';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Product Image Container */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '80%', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
        <Link to={`/product/${product.id}`} style={{ position: 'absolute', inset: 0 }}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            loading="lazy"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent && (
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#ef4444',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            -{discountPercent}%
          </span>
        )}

        {/* Category Pill */}
        {product.category && (
          <span style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontSize: '0.6875rem',
            fontWeight: 600,
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-full)'
          }}>
            {product.category.nameLao || product.category.name}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '0.25rem',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.nameLao || product.name}
            </h3>
            <p style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {product.name}
            </p>
          </Link>

          {/* Stock Indicator */}
          <div style={{ marginBottom: '0.875rem' }}>
            {isOutOfStock ? (
              <span className="badge badge-stock-out">
                🔴 ສິນຄ້າໝົດ (Out of stock)
              </span>
            ) : isLowStock ? (
              <span className="badge badge-stock-low">
                ⚠️ ເຫຼືອພຽງ {product.stock} ຊິ້ນ!
              </span>
            ) : (
              <span className="badge badge-stock-in">
                🟢 ມີສິນຄ້າ ({product.stock} ຊິ້ນ)
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add To Cart Button */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatLAK(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                {formatLAK(product.originalPrice)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to={`/product/${product.id}`}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.5rem 0.625rem' }}
              title="ເບິ່ງລາຍລະອຽດ"
            >
              <Eye size={16} />
            </Link>
            
            <button
              onClick={() => addToCart(product, 1)}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              <ShoppingCart size={16} />
              <span>{isOutOfStock ? 'ສິນຄ້າໝົດ' : 'ໃສ່ກະຕ່າ'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
