import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Settings,
  ArrowLeft,
  Shield,
  LogOut,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      
      {/* Admin Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
      }}>
        
        {/* Brand Header */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Shield size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.0625rem', color: '#fff', lineHeight: 1.2 }}>ADMIN PANEL</div>
            <div style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>ລະບົບຈັດການຫຼັງບ້ານ</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
            style={({ isActive }) => ({
              justifyContent: 'flex-start',
              color: isActive ? '#fff' : '#cbd5e1',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
            })}
          >
            <LayoutDashboard size={18} />
            <span>ໜ້າພາບລວມ (Dashboard)</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
            style={({ isActive }) => ({
              justifyContent: 'flex-start',
              color: isActive ? '#fff' : '#cbd5e1',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
            })}
          >
            <Package size={18} />
            <span>ຈັດການສິນຄ້າ (Products)</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
            style={({ isActive }) => ({
              justifyContent: 'flex-start',
              color: isActive ? '#fff' : '#cbd5e1',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
            })}
          >
            <ShoppingBag size={18} />
            <span>ຈັດການ Order & ສະລິບ</span>
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
            style={({ isActive }) => ({
              justifyContent: 'flex-start',
              color: isActive ? '#fff' : '#cbd5e1',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
            })}
          >
            <FolderTree size={18} />
            <span>ໝວດໝູ່ສິນຄ້າ (Categories)</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `btn ${isActive ? 'btn-primary' : ''}`}
            style={({ isActive }) => ({
              justifyContent: 'flex-start',
              color: isActive ? '#fff' : '#cbd5e1',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              padding: '0.65rem 1rem',
              fontSize: '0.875rem',
            })}
          >
            <Settings size={18} />
            <span>ຕັ້ງຄ່າ QR & Telegram</span>
          </NavLink>

        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b' }}>
          <Link
            to="/"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', marginBottom: '0.5rem', backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
          >
            <ArrowLeft size={14} />
            <span>ກັບຄືນໜ້າຮ້ານ (View Shop)</span>
          </Link>

          <button
            onClick={handleLogout}
            className="btn btn-sm"
            style={{ width: '100%', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444' }}
          >
            <LogOut size={14} />
            <span>ອອກຈາກລະບົບ</span>
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ຍິນດີຕ້ອນຮັບ:</span>
            <strong style={{ fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{user?.name}</strong>
            <span className="badge badge-paid" style={{ fontSize: '0.6875rem' }}>ADMIN</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/admin/orders?status=PENDING" className="btn btn-secondary btn-sm" style={{ color: '#b45309', backgroundColor: '#fef3c7', borderColor: '#fde68a' }}>
              <Bell size={14} />
              <span>Order ລໍຖ້າກວດສອບສະລິບ</span>
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}
