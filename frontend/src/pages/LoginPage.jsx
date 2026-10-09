import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Shield, User, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.25rem 6rem', maxWidth: '480px' }}>
      <div className="card" style={{ padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}>
            <Lock size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            ເຂົ້າສູ່ລະບົບ
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ຍິນດີຕ້ອນຮັບສູ່ລະບົບຮ້ານຄ້າ Lao E-Commerce
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid #fca5a5', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ອີເມວ (Email):</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ລະຫັດຜ່ານ (Password):</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1.5rem' }}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <span>ເຂົ້າສູ່ລະບົບ</span>}
          </button>
        </form>

        {/* Quick Demo Login Fill Buttons */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center', textTransform: 'uppercase' }}>
            ⚡ ທົດສອບໄວດ້ວຍບັນຊີຕົວຢ່າງ (1-Click Demo)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fillDemo('admin@shop.la', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', color: '#1d4ed8', backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}
            >
              <Shield size={14} />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo('user@shop.la', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              <User size={14} />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          ຍັງບໍ່ມີບັນຊີເທື່ອບໍ?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            ລົງທະບຽນໃໝ່
          </Link>
        </div>

      </div>
    </div>
  );
}
