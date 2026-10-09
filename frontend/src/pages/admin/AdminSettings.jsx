import React, { useState, useEffect } from 'react';
import {
  Settings,
  QrCode,
  Send,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { settingApi } from '../../api/settingApi';
import { uploadApi } from '../../api/uploadApi';
import { getImageUrl } from '../../utils/format';

export default function AdminSettings() {
  const [formData, setFormData] = useState({
    shopName: '',
    shopPhone: '',
    shopAddress: '',
    bcelQrImage: '',
    bcelAccountName: '',
    bcelAccountNumber: '',
    telegramBotToken: '',
    telegramChatId: '',
    telegramEnabled: true,
    lowStockThreshold: 5,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    settingApi.getSettings()
      .then((res) => {
        if (res.success && res.data) {
          setFormData({
            shopName: res.data.shopName || '',
            shopPhone: res.data.shopPhone || '',
            shopAddress: res.data.shopAddress || '',
            bcelQrImage: res.data.bcelQrImage || '',
            bcelAccountName: res.data.bcelAccountName || '',
            bcelAccountNumber: res.data.bcelAccountNumber || '',
            telegramBotToken: res.data.telegramBotToken || '',
            telegramChatId: res.data.telegramChatId || '',
            telegramEnabled: res.data.telegramEnabled !== undefined ? res.data.telegramEnabled : true,
            lowStockThreshold: res.data.lowStockThreshold || 5,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingQr(true);
    try {
      const res = await uploadApi.uploadSingle(file, 'ecommerce/settings');
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, bcelQrImage: res.data.url }));
        setMessage({ type: 'success', text: 'ອັບໂຫຼດຮູບ BCEL QR Code ສຳເລັດແລ້ວ' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'ອັບໂຫຼດຮູບ QR ບໍ່ສຳເລັດ: ' + err.message });
    } finally {
      setUploadingQr(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await settingApi.updateSettings(formData);
      setMessage({ type: 'success', text: 'ບັນທຶກການຕັ້ງຄ່າຮ້ານຄ້າຮຽບຮ້ອຍແລ້ວ!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setMessage({ type: '', text: '' });

    try {
      // First save current values
      await settingApi.updateSettings(formData);
      const res = await settingApi.testTelegram();
      if (res.success) {
        setMessage({ type: 'success', text: '✅ ສົ່ງຂໍ້ຄວາມທົດສອບຫາ Telegram Bot ສຳເລັດແລ້ວ! ກະລຸນາກວດເບິ່ງໃນ Telegram ຂອງທ່ານ' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ ບໍ່ສາມາດສົ່ງຫາ Telegram ໄດ້: ' + (err.message || 'ກະລຸນາກວດສອບ Bot Token ແລະ Chat ID') });
    } finally {
      setTestingTelegram(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <Loader2 size={36} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>ກຳລັງໂຫຼດການຕັ້ງຄ່າ...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          ⚙️ ຕັ້ງຄ່າລະບົບຮ້ານຄ້າ (Shop Settings)
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          ກຳນົດ QR Code ຊຳລະເງິນ, ບັນຊີທະນາຄານ, ແລະ ການແຈ້ງເຕືອນ Telegram Bot
        </p>
      </div>

      {message.text && (
        <div style={{
          backgroundColor: message.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
          border: `1px solid ${message.type === 'success' ? '#86efac' : '#fca5a5'}`,
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          padding: '0.875rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        
        {/* Section 1: BCEL One Payment Settings */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <QrCode size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
              2. ລະບົບຊຳລະເງິນ BCEL One QR Code
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="settings-qr-grid">
            <style>{`
              @media (min-width: 768px) {
                .settings-qr-grid { grid-template-columns: 200px 1fr !important; }
              }
            `}</style>

            {/* QR Image Box */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem', backgroundColor: '#f8fafc', marginBottom: '0.75rem' }}>
                <img
                  src={getImageUrl(formData.bcelQrImage)}
                  alt="BCEL One QR"
                  style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', margin: '0 auto' }}
                />
              </div>

              <input
                type="file"
                id="qr-upload-input"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleQrUpload}
              />
              <label
                htmlFor="qr-upload-input"
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', cursor: 'pointer' }}
              >
                {uploadingQr ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                <span>{uploadingQr ? 'ກຳລັງອັບໂຫຼດ...' : 'ປ່ຽນຮູບ QR Code'}</span>
              </label>
            </div>

            {/* Bank details inputs */}
            <div>
              <div className="form-group">
                <label className="form-label">ຊື່ບັນຊີຮ້ານ (Account Name):</label>
                <input
                  type="text"
                  required
                  value={formData.bcelAccountName}
                  onChange={(e) => setFormData({ ...formData, bcelAccountName: e.target.value })}
                  className="form-input"
                  placeholder="LAO E-COMMERCE CO., LTD"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ເລກບັນຊີ BCEL (Account Number):</label>
                <input
                  type="text"
                  required
                  value={formData.bcelAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bcelAccountNumber: e.target.value })}
                  className="form-input"
                  placeholder="010-12-00-00898823-001"
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL ຮູບ QR Code:</label>
                <input
                  type="url"
                  value={formData.bcelQrImage}
                  onChange={(e) => setFormData({ ...formData, bcelQrImage: e.target.value })}
                  className="form-input"
                  style={{ fontSize: '0.8125rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Telegram Bot Settings */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={20} color="#0088cc" />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                3. ລະບົບແຈ້ງເຕືອນ Telegram Bot API
              </h2>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.telegramEnabled}
                onChange={(e) => setFormData({ ...formData, telegramEnabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>ເປີດໃຊ້ງານ (Enabled)</span>
            </label>
          </div>

          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.8125rem', lineHeight: 1.7, color: '#1e40af' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              <Info size={16} />
              <span>ວິທີສ້າງ Telegram Bot ໃນ 2 ນາທີ (ຟຣີ 100%):</span>
            </div>
            1. ຄົ້ນຫາ <code>@BotFather</code> ໃນ Telegram ແລ້ວພິມ <code>/newbot</code> ເພື່ອເອົາ <strong>Bot Token</strong><br />
            2. ທັກຫາ Bot ຂອງທ່ານ ຫຼື ເພີ່ມ Bot ເຂົ້າກຸ່ມ ແລ້ວເອົາ <strong>Chat ID</strong> ມາວາງໃສ່ຊ່ອງລຸ່ມນີ້
          </div>

          <div className="form-group">
            <label className="form-label">Telegram Bot Token:</label>
            <input
              type="text"
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
              value={formData.telegramBotToken}
              onChange={(e) => setFormData({ ...formData, telegramBotToken: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telegram Chat ID (ID ສ່ວນຕົວ ຫຼື ID ກຸ່ມ):</label>
            <input
              type="text"
              placeholder="987654321 ຫຼື -100123456789"
              value={formData.telegramChatId}
              onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTelegram || !formData.telegramBotToken || !formData.telegramChatId}
              className="btn btn-secondary btn-sm"
              style={{ color: '#0088cc', borderColor: '#0088cc' }}
            >
              {testingTelegram ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              <span>{testingTelegram ? 'ກຳລັງທົດສອບ...' : 'ທົດສອບສົ່ງຂໍ້ຄວາມຫາ Telegram'}</span>
            </button>
          </div>
        </div>

        {/* Section 3: General Shop Info & Low Stock Threshold */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <Settings size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
              ຂໍ້ມູນຮ້ານຄ້າ & ເກນແຈ້ງເຕືອນສະຕັອກ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">ຊື່ຮ້ານຄ້າ:</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">ເບີໂທລະສັບຮ້ານ:</label>
              <input
                type="text"
                value={formData.shopPhone}
                onChange={(e) => setFormData({ ...formData, shopPhone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ທີ່ຢູ່ຮ້ານຄ້າ:</label>
            <input
              type="text"
              value={formData.shopAddress}
              onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">ເກນແຈ້ງເຕືອນສະຕັອກໃກ້ໝົດ (Low Stock Alert Threshold):</label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              className="form-input"
              style={{ maxWidth: '200px' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ແຈ້ງເຕືອນເມື່ອສິນຄ້າເຫຼືອນ້ອຍກວ່າ ຫຼື ເທົ່າກັບຈຳນວນນີ້ (ຄ່າເລີ່ມຕົ້ນ: 5 ຊິ້ນ)
            </span>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '220px' }}
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <span>ບັນທຶກການຕັ້ງຄ່າທັງໝົດ</span>}
          </button>
        </div>

      </form>

    </div>
  );
}
