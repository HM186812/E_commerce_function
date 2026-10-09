import React from 'react';
import { ShoppingBag, ShieldCheck, Send, CreditCard, RefreshCw } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', marginTop: 'auto', borderTop: '1px solid #1e293b' }}>
      
      {/* Feature Highlights */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2rem 0' }}>
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9375rem' }}>BCEL One QR</div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>ຊຳລະເງິນງ່າຍ ຜ່ານ QR Code</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80' }}>
              <Send size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9375rem' }}>Telegram Alerts</div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>ແຈ້ງເຕືອນ Order ທັນທີ 24/7</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#facc15' }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9375rem' }}>Realtime Stock</div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>ຕັດສະຕັອກອັດຕະໂນມັດ</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9375rem' }}>Security & Auth</div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>ປອດໄພດ້ວຍ Bcrypt & JWT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3rem 1.25rem 2rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#fff' }}>LAO E-COMMERCE</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#94a3b8' }}>
              ແພລັດຟອມຮ້ານຄ້າອອນລາຍມາດຕະຖານ ສຳລັບທຸລະກິດຂະໜາດນ້ອຍ ແລະ ກາງໃນປະເທດລາວ. ຮອງຮັບການຊຳລະຜ່ານ BCEL One, ອັບໂຫຼດສະລິບ, ຄຸ້ມຄອງສະຕັອກ ແລະ ແຈ້ງເຕືອນ Telegram Bot.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>6 ລະບົບຫຼັກທີ່ຮອງຮັບ</h4>
            <ul style={{ listStyle: 'none', fontSize: '0.875rem', lineHeight: 2, color: '#94a3b8' }}>
              <li>✅ 1. ລະບົບອັບໂຫຼດຮູບພາບ (Multer + Cloudinary)</li>
              <li>✅ 2. ລະບົບຊຳລະເງິນ (BCEL One QR + ສະລິບໂອນ)</li>
              <li>✅ 3. ລະບົບແຈ້ງເຕືອນ (Telegram Bot & Email)</li>
              <li>✅ 4. ລະບົບຄຸ້ມຄອງສະຕັອກ (Inventory Logic)</li>
              <li>✅ 5. ລະບົບຄົ້ນຫາ, ໝວດໝູ່ & ແບ່ງໜ້າ (Pagination)</li>
              <li>✅ 6. ຄວາມປອດໄພ (Bcrypt, JWT, Zod & Helmet)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1rem' }}>ຂໍ້ມູນຕິດຕໍ່ຮ້ານ</h4>
            <div style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#94a3b8' }}>
              <p>📍 ທີ່ຕັ້ງ: ນະຄອນຫຼວງວຽງຈັນ, ສປປ ລາວ</p>
              <p>📞 ໂທລະສັບ: 020 9999 8888</p>
              <p>💬 Telegram: @LaoEcommerceBot</p>
              <p>💳 ບັນຊີ BCEL: 010-12-00-00898823-001</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
          © 2026 Lao E-Commerce Application. Built with Node.js & React. Ready for GitHub & Production.
        </div>
      </div>
    </footer>
  );
}
