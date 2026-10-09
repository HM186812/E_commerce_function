import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderTree, Loader2, X, AlertCircle } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameLao: '',
    description: '',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = () => {
    setLoading(true);
    categoryApi.getAll()
      .then((res) => {
        if (res.success && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', nameLao: '', description: '', image: '' });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      nameLao: cat.nameLao,
      description: cat.description || '',
      image: cat.image || '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, formData);
      } else {
        await categoryApi.create(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໝວດໝູ່ "${name}"?`)) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (err) {
        alert(err.message || 'ລຶບໝວດໝູ່ບໍ່ສຳເລັດ');
      }
    }
  };

  return (
    <div>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            📂 ຈັດການໝວດໝູ່ສິນຄ້າ (Categories)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ສ້າງໝວດໝູ່ສຳລັບແບ່ງແຍກປະເພດສິນຄ້າ
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>ເພີ່ມໝວດໝູ່ໃໝ່ (Add Category)</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດ...</p>
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            ຍັງບໍ່ມີໝວດໝູ່ເທື່ອ
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ຊື່ໝວດໝູ່ (ພາສາລາວ)</th>
                  <th>ຊື່ໝວດໝູ່ (English)</th>
                  <th>Slug</th>
                  <th style={{ textAlign: 'center' }}>ຈຳນວນສິນຄ້າ</th>
                  <th style={{ textAlign: 'center' }}>ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{cat.nameLao}</div>
                      {cat.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.description}</div>}
                    </td>
                    <td>{cat.name}</td>
                    <td><code>{cat.slug}</code></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge" style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
                        {cat.productCount} ລາຍການ
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.nameLao || cat.name)}
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.4rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingCategory ? '✏️ ແກ້ໄຂໝວດໝູ່' : '➕ ເພີ່ມໝວດໝູ່ໃໝ່'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {error && (
              <div style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid #fca5a5', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ຊື່ໝວດໝູ່ (ພາສາລາວ): <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  required
                  placeholder="ເຊັ່ນ: ກາເຟລາວ ແລະ ເຄື່ອງດື່ມ"
                  value={formData.nameLao}
                  onChange={(e) => setFormData({ ...formData, nameLao: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ຊື່ໝວດໝູ່ (English): <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Lao Coffee & Beverages"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ຄຳອະທິບາຍ:</label>
                <textarea
                  rows={2}
                  placeholder="ລາຍລະອຽດກ່ຽວກັບໝວດໝູ່ນີ້..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <span>ບັນທຶກ</span>}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
