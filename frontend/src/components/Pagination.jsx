import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, total, limit } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
      
      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        ສະແດງໜ້າ <strong>{currentPage}</strong> ຈາກ <strong>{totalPages}</strong> (ທັງໝົດ {total} ລາຍການ)
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        {/* Prev Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <ChevronLeft size={16} />
          <span>ກ່ອນໜ້າ</span>
        </button>

        {/* First Page if far */}
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="btn btn-secondary btn-sm"
              style={{ minWidth: '32px' }}
            >
              1
            </button>
            {pages[0] > 2 && <span style={{ color: 'var(--text-muted)' }}>...</span>}
          </>
        )}

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-secondary'}`}
            style={{ minWidth: '34px', fontWeight: p === currentPage ? 700 : 500 }}
          >
            {p}
          </button>
        ))}

        {/* Last Page if far */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span style={{ color: 'var(--text-muted)' }}>...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="btn btn-secondary btn-sm"
              style={{ minWidth: '32px' }}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.6rem' }}
        >
          <span>ຕໍ່ໄປ</span>
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
