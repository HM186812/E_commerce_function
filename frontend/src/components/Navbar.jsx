import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, LogOut, Shield, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1.5rem' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--secondary)', lineHeight: 1.1 }}>
              LAO <span style={{ color: 'var(--primary)' }}>STORE</span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ເວັບໄຊຂາຍເຄື່ອງອອນລາຍ
            </div>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '460px', position: 'relative', display: 'none' }} className="search-form-desktop">
          <input
            type="text"
            placeholder="ຄົ້ນຫາສິນຄ້າ (ເຊັ່ນ: ກາເຟ, ຜ້າໄໝ, ຫູຟັງ)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              paddingRight: '4.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#f1f5f9',
              border: '1px solid transparent',
              fontSize: '0.875rem'
            }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <button type="submit" className="btn btn-primary btn-sm" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', borderRadius: 'var(--radius-full)', padding: '0 0.875rem' }}>
            ຄົ້ນຫາ
          </button>
        </form>

        <style>{`
          @media (min-width: 768px) {
            .search-form-desktop { display: block !important; }
          }
        `}</style>

        {/* Nav Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          
          {/* Admin Dashboard Link */}
          {isAdmin && (
            <Link to="/admin" className="btn btn-secondary btn-sm" style={{ borderColor: '#3b82f6', color: '#1d4ed8', backgroundColor: '#eff6ff' }}>
              <Shield size={16} />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {/* User Menu */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/my-orders" className="btn btn-secondary btn-sm" title="ລາຍການສັ່ງຊື້ຂອງຂ້ອຍ">
                <User size={16} />
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button onClick={logout} className="btn btn-secondary btn-sm" title="ອອກຈາກລະບົບ" style={{ color: 'var(--danger)', padding: '0.375rem 0.5rem' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <User size={16} />
              <span>ເຂົ້າສູ່ລະບົບ</span>
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn btn-primary"
            style={{ position: 'relative', padding: '0.625rem 1rem' }}
            title="ກະຕ່າສິນຄ້າ"
          >
            <ShoppingBag size={18} />
            <span style={{ display: 'none' }} className="cart-text-desktop">ກະຕ່າ</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #fff',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {totalItems}
              </span>
            )}
          </button>

          <style>{`
            @media (min-width: 640px) {
              .cart-text-desktop { display: inline !important; }
            }
          `}</style>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', display: 'flex' }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="ຄົ້ນຫາສິນຄ້າ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </form>

          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
            🏠 ໜ້າຫຼັກ (Home)
          </Link>
          <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600 }}>
            📦 ລາຍການສັ່ງຊື້ຂອງຂ້ອຍ (My Orders)
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--primary)' }}>
              🛡️ ລະບົບຈັດການ Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
