import React from 'react';
import { Search, SlidersHorizontal, Check, RefreshCw } from 'lucide-react';

export default function FilterBar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sort,
  onSortChange,
  inStockOnly,
  onInStockToggle,
  onResetFilters,
}) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
      
      {/* Top row: Search & Sort */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <input
            type="text"
            placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ, ລາຍລະອຽດ..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {/* Sort & In-Stock filter */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockToggle(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <span>ສະເພາະທີ່ມີສິນຄ້າ</span>
          </label>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
          >
            <option value="newest">✨ ມາໃໝ່ລ່າສຸດ</option>
            <option value="price_asc">📈 ລາຄາ: ຕ່ຳ ຫາ ສູງ</option>
            <option value="price_desc">📉 ລາຄາ: ສູງ ຫາ ຕ່ຳ</option>
            <option value="name_asc">🔤 ຊື່: A ຫາ Z</option>
          </select>

          <button
            onClick={onResetFilters}
            className="btn btn-secondary btn-sm"
            title="ລ້າງຕົວກັ່ນຕອງທັງໝົດ"
            style={{ color: 'var(--text-secondary)' }}
          >
            <RefreshCw size={14} />
            <span>ລ້າງ</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          ໝວດໝູ່ສິນຄ້າ (Categories)
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => onSelectCategory('')}
            className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
          >
            🌟 ທັງໝົດ
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
              >
                {cat.nameLao || cat.name}
                {cat.productCount !== undefined && (
                  <span style={{ marginLeft: '0.25rem', opacity: 0.75, fontSize: '0.75rem' }}>
                    ({cat.productCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
