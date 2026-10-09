import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, QrCode, Upload, CheckCircle2, AlertCircle, Copy, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { settingApi } from '../api/settingApi';
import { uploadApi } from '../api/uploadApi';
import { orderApi } from '../api/orderApi';
import { formatLAK, getImageUrl } from '../utils/format';

export default function CheckoutModal() {
  const { items, totalAmount, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shopSetting, setShopSetting] = useState(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BCEL_ONE_QR');

  // Slip Upload State
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [isUploadingSlip, setIsUploadingSlip] = useState(false);
  const [uploadedSlipUrl, setUploadedSlipUrl] = useState('');

  // Submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
      if (user.address) setCustomerAddress(user.address);
    }
  }, [user]);

  // Load shop settings (QR code, bank info)
  useEffect(() => {
    if (isCheckoutOpen) {
      settingApi.getSettings()
        .then((res) => {
          if (res.success && res.data) {
            setShopSetting(res.data);
          }
        })
        .catch((err) => console.error('Failed to load settings:', err));
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleCopyAccount = () => {
    const acc = shopSetting?.bcelAccountNumber || '010-12-00-00898823-001';
    navigator.clipboard.writeText(acc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview
    setSlipFile(file);
    setSlipPreview(URL.createObjectURL(file));
    setErrorMessage('');

    // Auto upload to server via Multer & Cloudinary
    setIsUploadingSlip(true);
    try {
      const uploadRes = await uploadApi.uploadSingle(file, 'ecommerce/slips');
      if (uploadRes.success && uploadRes.data?.url) {
        setUploadedSlipUrl(uploadRes.data.url);
      }
    } catch (err) {
      console.error('Slip upload failed:', err);
      setErrorMessage(err.message || 'ອັບໂຫຼດຮູບສະລິບບໍ່ສຳເລັດ ກະລຸນາລອງໃໝ່');
    } finally {
      setIsUploadingSlip(false);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setErrorMessage('ກະລຸນາປ້ອນ ຊື່, ເບີໂທ, ແລະ ທີ່ຢູ່ຈັດສົ່ງໃຫ້ຄົບຖ້ວນ');
      return;
    }

    if (paymentMethod === 'BCEL_ONE_QR' && !uploadedSlipUrl) {
      setErrorMessage('ກະລຸນາອັບໂຫຼດຮູບສະລິບໂອນເງິນກ່ອນຢືນຢັນການສັ່ງຊື້');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        customerNote: customerNote.trim() || null,
        paymentMethod,
        paymentSlipUrl: uploadedSlipUrl || null,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      const res = await orderApi.create(orderPayload);

      if (res.success && res.data) {
        clearCart();
        setIsCheckoutOpen(false);
        navigate(`/order-success/${res.data.id || res.data.orderNumber}`, {
          state: { order: res.data },
        });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(
        err.errors?.length ? err.errors.map((e) => e.message).join(', ') : err.message || 'ເກີດຂໍ້ຜິດພາດໃນການສັ່ງຊື້'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              💳 ຊຳລະເງິນ & ສັ່ງຊື້ສິນຄ້າ
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ລະບົບຊຳລະເງິນຜ່ານ BCEL One QR Code ພ້ອມອັບໂຫຼດສະລິບ
            </p>
          </div>
          <button onClick={() => setIsCheckoutOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        {errorMessage && (
          <div style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid #fca5a5', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          
          {/* Order Summary Card */}
          <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ຈຳນວນສິນຄ້າ: <strong>{items.length} ລາຍການ</strong></div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ຕັດສະຕັອກອັດຕະໂນມັດເມື່ອສັ່ງຊື້</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>ຍອດທີ່ຕ້ອງຊຳລະ</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary)' }}>
                {formatLAK(totalAmount)}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">ເລືອກວິທີການຊຳລະເງິນ:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div
                onClick={() => setPaymentMethod('BCEL_ONE_QR')}
                style={{
                  border: `2px solid ${paymentMethod === 'BCEL_ONE_QR' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: paymentMethod === 'BCEL_ONE_QR' ? 'var(--primary-light)' : '#fff',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <QrCode size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>BCEL One QR</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ສະແກນ QR & ແນບສະລິບ</div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                style={{
                  border: `2px solid ${paymentMethod === 'CASH_ON_DELIVERY' ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: paymentMethod === 'CASH_ON_DELIVERY' ? 'var(--primary-light)' : '#fff',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  📦
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>ເກັບເງິນປາຍທາງ (COD)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ຊຳລະຕອນຮັບເຄື່ອງ</div>
                </div>
              </div>
            </div>
          </div>

          {/* BCEL ONE QR Section */}
          {paymentMethod === 'BCEL_ONE_QR' && (
            <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem', alignItems: 'center' }}>
                
                {/* QR Image Box */}
                <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '0.75rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                  <img
                    src={getImageUrl(shopSetting?.bcelQrImage || 'https://images.unsplash.com/photo-1595079672139-5451000f0744?auto=format&fit=crop&w=400&q=80')}
                    alt="BCEL One QR"
                    style={{ width: '100%', maxWidth: '170px', height: 'auto', margin: '0 auto', borderRadius: '4px' }}
                  />
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.375rem', fontWeight: 600 }}>
                    ສະແກນຜ່ານແອັບ BCEL One
                  </div>
                </div>

                {/* Account Details & Upload Slip */}
                <div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ຊື່ບັນຊີ:</div>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--secondary)' }}>
                      {shopSetting?.bcelAccountName || 'LAO E-COMMERCE CO., LTD'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ເລກບັນຊີ:</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <code style={{ fontSize: '0.875rem', fontWeight: 700, backgroundColor: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        {shopSetting?.bcelAccountNumber || '010-12-00-00898823-001'}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        {copied ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                        <span>{copied ? 'ກັອບປີ້ແລ້ວ' : 'ກັອບປີ້'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Upload Slip Box */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8125rem' }}>
                      📸 ອັບໂຫຼດຮູບສະລິບໂອນເງິນ: <span style={{ color: 'var(--danger)' }}>*</span>
                    </label>
                    <input
                      type="file"
                      id="slip-file-input"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    
                    <label
                      htmlFor="slip-file-input"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem',
                        backgroundColor: '#ffffff',
                        border: '2px dashed #93c5fd',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                      }}
                    >
                      {isUploadingSlip ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>ກຳລັງອັບໂຫຼດ...</span>
                        </>
                      ) : slipPreview ? (
                        <>
                          <CheckCircle2 size={16} color="var(--success)" />
                          <span>ເລືອກຮູບໃໝ່ (ແນບແລ້ວ)</span>
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          <span>ກົດເລືອກຮູບສະລິບ (Slip)</span>
                        </>
                      )}
                    </label>

                    {slipPreview && (
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img
                          src={slipPreview}
                          alt="Slip Preview"
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>
                          ✅ ຮູບສະລິບພ້ອມແນບສົ່ງ
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">ຊື່ ແລະ ນາມສະກຸນ: <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="text"
                required
                placeholder="ເຊັ່ນ: ທ້າວ ຄຳຫຼ້າ ພົມມະວົງ"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ເບີໂທລະສັບຕິດຕໍ່: <span style={{ color: 'var(--danger)' }}>*</span></label>
              <input
                type="tel"
                required
                placeholder="ເຊັ່ນ: 020 5555 1234"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ທີ່ຢູ່ຈັດສົ່ງສິນຄ້າລະອຽດ: <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea
              required
              rows={2}
              placeholder="ບ້ານ, ເມືອງ, ແຂວງ ແລະ ຈຸດສັງເກດ..."
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ໝາຍເຫດເພີ່ມເຕີມ (ຖ້າມີ):</label>
            <input
              type="text"
              placeholder="ເຊັ່ນ: ຝາກເຄື່ອງໄວ້ປ້ອມຍາມ, ໂທກ່ອນສົ່ງ"
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="btn btn-secondary"
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              ຍົກເລີກ
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={isSubmitting || isUploadingSlip}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>ກຳລັງສັ່ງຊື້ & ແຈ້ງເຕືອນ Telegram...</span>
                </>
              ) : (
                <span>ຢືນຢັນການສັ່ງຊື້ ({formatLAK(totalAmount)})</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
