import React from 'react';
import { X, CheckCircle, ExternalLink, Download } from 'lucide-react';
import { getImageUrl } from '../utils/format';

export default function SlipViewerModal({ order, isOpen, onClose, onConfirmPaid }) {
  if (!isOpen || !order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px', padding: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
              🧾 ກວດສອບສະລິບໂອນເງິນ (#{order.orderNumber})
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ລູກຄ້າ: {order.customerName} ({order.customerPhone})
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {/* Image Content */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center', minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {order.paymentSlipUrl ? (
            <img
              src={getImageUrl(order.paymentSlipUrl)}
              alt="Payment Slip"
              style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
            />
          ) : (
            <div style={{ color: '#94a3b8' }}>ບໍ່ພົບຮູບສະລິບ</div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          {order.paymentSlipUrl && (
            <a
              href={getImageUrl(order.paymentSlipUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <ExternalLink size={14} />
              <span>ເປີດຮູບເຕັມຈໍ</span>
            </a>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm">
              ປິດ
            </button>
            {order.status === 'PENDING' && onConfirmPaid && (
              <button
                onClick={() => {
                  onConfirmPaid(order.id);
                  onClose();
                }}
                className="btn btn-success btn-sm"
              >
                <CheckCircle size={16} />
                <span>ຢືນຢັນເງິນເຂົ້າແລ້ວ (Mark as Paid)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
