import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
} from 'lucide-react';
import { productApi } from '../../api/productApi';
import { categoryApi } from '../../api/categoryApi';
import { uploadApi } from '../../api/uploadApi';
import { formatLAK, getImageUrl } from '../../utils/format';
import Pagination from '../../components/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameLao: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    categoryId: '',
    isFeatured: false,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    productApi.getProducts({
      page: currentPage,
      limit: 10,
      search,
      categoryId: selectedCategory,
    })
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoryApi.getAll().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, selectedCategory]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameLao: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '10',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      categoryId: categories[0]?.id || '',
      isFeatured: false,
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameLao: product.nameLao,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      stock: product.stock.toString(),
      image: product.image,
      categoryId: product.categoryId || '',
      isFeatured: Boolean(product.isFeatured),
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadApi.uploadSingle(file, 'ecommerce/products');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      alert('ອັບໂຫຼດຮູບບໍ່ສຳເລັດ: ' + (err.message || 'Error'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, formData);
      } else {
        await productApi.create(formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setModalError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບສິນຄ້າ "${name}"?`)) {
      try {
        await productApi.delete(id);
        fetchProducts();
      } catch (err) {
        alert('ລຶບສິນຄ້າບໍ່ສຳເລັດ: ' + err.message);
      }
    }
  };

  return (
    <div>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            📦 ຈັດການສິນຄ້າ (Product Management)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            ເພີ່ມ, ແກ້ໄຂ, ລຶບສິນຄ້າ ແລະ ຄຸ້ມຄອງສະຕັອກ
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          <span>ເພີ່ມສິນຄ້າໃໝ່ (Add Product)</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="form-select"
          style={{ width: 'auto', minWidth: '180px', fontSize: '0.875rem' }}
        >
          <option value="">-- ທຸກໝວດໝູ່ --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameLao || c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດລາຍການສິນຄ້າ...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            ບໍ່ພົບສິນຄ້າທີ່ກົງກັບເງື່ອນໄຂ
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ຮູບພາບ</th>
                  <th>ຊື່ສິນຄ້າ</th>
                  <th>ໝວດໝູ່</th>
                  <th>ລາຄາ</th>
                  <th>ສະຕັອກ (Stock)</th>
                  <th style={{ textAlign: 'center' }}>ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;
                  return (
                    <tr key={product.id}>
                      <td style={{ width: '60px' }}>
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{product.nameLao || product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.name}</div>
                      </td>
                      <td>
                        <span className="badge" style={{ backgroundColor: '#eff6ff', color: 'var(--primary)' }}>
                          {product.category?.nameLao || product.category?.name || 'ທົ່ວໄປ'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatLAK(product.price)}</span>
                      </td>
                      <td>
                        <span className={isOutOfStock ? 'badge badge-stock-out' : isLowStock ? 'badge badge-stock-low' : 'badge badge-stock-in'}>
                          {isOutOfStock ? '🔴 ໝົດແລ້ວ (0)' : isLowStock ? `⚠️ ເຫຼືອ ${product.stock}` : `🟢 ${product.stock} ຊິ້ນ`}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.375rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => openEditModal(product)}
                            className="btn btn-secondary btn-sm"
                            title="ແກ້ໄຂ"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="btn btn-danger btn-sm"
                            title="ລຶບ"
                            style={{ padding: '0.4rem 0.5rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={(p) => setCurrentPage(p)} />
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingProduct ? '✏️ ແກ້ໄຂຂໍ້ມູນສິນຄ້າ' : '➕ ເພີ່ມສິນຄ້າໃໝ່'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid #fca5a5', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">ຊື່ສິນຄ້າ (ພາສາລາວ): <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="ເຊັ່ນ: ກາເຟອາຣາບິກ້າ 500g"
                    value={formData.nameLao}
                    onChange={(e) => setFormData({ ...formData, nameLao: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ຊື່ສິນຄ້າ (ພາສາອັງກິດ): <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Dao Arabica Coffee 500g"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="form-label">ລາຄາຂາຍ (ກີບ): <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="95000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ລາຄາເກົ່າ/ປົກກະຕິ:</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="110000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ຈຳນວນໃນສະຕັອກ: <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">ໝວດໝູ່ສິນຄ້າ:</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="form-select"
                >
                  <option value="">-- ເລືອກໝວດໝູ່ --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameLao || c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload Box */}
              <div className="form-group">
                <label className="form-label">📸 ຮູບພາບສິນຄ້າ: <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  {formData.image && (
                    <img
                      src={getImageUrl(formData.image)}
                      alt="Preview"
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    />
                  )}
                  <input
                    type="file"
                    id="prod-image-upload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="prod-image-upload"
                    className="btn btn-secondary btn-sm"
                    style={{ cursor: 'pointer' }}
                  >
                    {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>{uploadingImage ? 'ກຳລັງອັບໂຫຼດ...' : 'ອັບໂຫຼດຮູບຈາກເຄື່ອງ (Multer)'}</span>
                  </label>
                </div>
                <input
                  type="url"
                  placeholder="ຫຼື ວາງລິ້ງ URL ຮູບພາບໂດຍກົງ (https://...)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '0.8125rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ລາຍລະອຽດສິນຄ້າ:</label>
                <textarea
                  rows={3}
                  placeholder="ຄຸນສົມບັດ, ຂະໜາດ, ວິທີໃຊ້..."
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
                  disabled={submitting || uploadingImage}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <span>ບັນທຶກສິນຄ້າ</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
