import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, ShoppingBag, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { productApi } from '../api/productApi';
import { categoryApi } from '../api/categoryApi';
import ProductCard from '../components/ProductCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter States synced with URL query
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch Categories
  useEffect(() => {
    categoryApi.getAll()
      .then((res) => {
        if (res.success && res.data) setCategories(res.data);
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch Products based on filters
  useEffect(() => {
    setLoading(true);
    const params = {
      page: currentPage,
      limit: 12,
      sort,
      ...(searchQuery && { search: searchQuery }),
      ...(selectedCategory && { categoryId: selectedCategory }),
      ...(inStockOnly && { inStock: 'true' }),
    };

    productApi.getProducts(params)
      .then((res) => {
        if (res.success && res.data) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      })
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedCategory, sort, inStockOnly, currentPage]);

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    // Reset to page 1 on filter changes unless page is explicitly changed
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div>
      
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)',
        color: '#ffffff',
        padding: '3.5rem 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr', alignItems: 'center', gap: '2rem' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1rem' }}>
              <Sparkles size={16} color="#facc15" />
              <span>ແພລັດຟອມຂາຍເຄື່ອງອອນລາຍມາດຕະຖານສຳລັບທຸລະກິດລາວ</span>
            </div>
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: '#fff' }}>
              ຊື້-ຂາຍງ່າຍ ຊຳລະສະດວກ <br />
              <span style={{ color: '#93c5fd' }}>ຜ່ານ BCEL One QR Code</span>
            </h1>

            <p style={{ fontSize: '1rem', color: '#dbeafe', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              ລະບົບຂາຍເຄື່ອງຄົບວົງຈອນ: ຕັດສະຕັອກອັດຕະໂນມັດ, ອັບໂຫຼດສະລິບ, ແລະ ແຈ້ງເຕືອນ Order ເຂົ້າ Telegram Bot ຂອງຮ້ານທັນທີ!
            </p>

            <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-lg"
                style={{ backgroundColor: '#ffffff', color: '#1e3a8a', fontWeight: 700 }}
              >
                <span>ເລືອກຊື້ສິນຄ້າ</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => updateFilters({ category: categories[0]?.id || '' })}
                className="btn btn-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <span>ກາເຟ ແລະ ຜ້າໄໝລາວ</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="products-section" className="container" style={{ padding: '3rem 1.25rem 4rem' }}>
        
        {/* Filter Bar Component */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => updateFilters({ category: catId })}
          searchQuery={searchQuery}
          onSearchChange={(val) => updateFilters({ search: val })}
          sort={sort}
          onSortChange={(val) => updateFilters({ sort: val })}
          inStockOnly={inStockOnly}
          onInStockToggle={(val) => updateFilters({ inStock: val ? 'true' : '' })}
          onResetFilters={handleResetFilters}
        />

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {selectedCategory
                ? `ໝວດໝູ່: ${categories.find((c) => c.id === selectedCategory)?.nameLao || 'ສິນຄ້າ'}`
                : searchQuery
                ? `ຜົນການຄົ້ນຫາ: "${searchQuery}"`
                : 'ສິນຄ້າທັງໝົດ (All Products)'}
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              ພົບທັງໝົດ {pagination?.total || 0} ລາຍການ
            </p>
          </div>
        </div>

        {/* Product Grid / Loading / Empty State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>ກຳລັງໂຫຼດລາຍການສິນຄ້າ...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>ບໍ່ພົບສິນຄ້າທີ່ທ່ານຄົ້ນຫາ</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ລອງປ່ຽນຄຳຄົ້ນຫາ ຫຼື ລ້າງຕົວກັ່ນຕອງເພື່ອເບິ່ງສິນຄ້າທັງໝົດ
            </p>
            <button onClick={handleResetFilters} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} />
              <span>ລ້າງຕົວກັ່ນຕອງ</span>
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              pagination={pagination}
              onPageChange={(page) => updateFilters({ page: page.toString() })}
            />
          </>
        )}

      </section>

    </div>
  );
}
