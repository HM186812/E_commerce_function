# 🛍️ Lao E-Commerce Full-Stack Platform (Node.js + React.js)

ລະບົບເວັບໄຊຂາຍເຄື່ອງອອນລາຍ (E-Commerce) ຂະໜາດນ້ອຍ-ກາງ ທີ່ສົມບູນແບບ, ໃຊ້ງານໄດ້ຈິງ, ປອດໄພ ແລະ ສາມາດນຳໄປຕໍ່ຍອດໃນໂປຣເຈັກທຸກປະເພດສິນຄ້າ.

---

## 🌟 6 ພາກສ່ວນຫຼັກໃນລະບົບ (Core Modules)

### 1. 🖼️ ລະບົບຈັດການຮູບພາບ (Image / File Upload)
- **Multer (Node.js)**: ຮັບໄຟລ໌ຮູບພາບສິນຄ້າ ແລະ ສະລິບໂອນເງິນຈາກ Frontend ພ້ອມກວດສອບປະເພດໄຟລ໌ (JPG, PNG, WEBP, GIF) ແລະ ຈຳກັດຂະໜາດສູງສຸດ 5MB.
- **Cloudinary Integration**: ອັບໂຫຼດຂຶ້ນ Cloud Storage ຟຣີ ແລະ ມີລະບົບ Fallback ບັນທຶກລົງ local `/uploads` ອັດຕະໂນມັດຫາກຍັງບໍ່ທັນໃສ່ Cloudinary Keys.

### 2. 💳 ລະບົບການຊຳລະເງິນ (Lao Payment Workflow)
- **BCEL One QR Code**: ສະແດງຮູບ QR Code ບັນຊີຮ້ານຄ້າ ພ້ອມປຸ່ມກັອບປີ້ເລກບັນຊີ ແລະ ຊື່ບັນຊີ 1-Click.
- **Upload Payment Slip**: ລູກຄ້າອັບໂຫຼດຮູບສະລິບໂອນເງິນພ້ອມ Live Preview.
- **Status Lifecycle**: 
  `PENDING` (ລໍຖ້າກວດສອບ) ➔ Admin ກວດສະລິບຜ່ານ Lightbox Modal ➔ ກົດປ່ຽນເປັນ `PAID` (ຈ່າຍແລ້ວ) ➔ `SHIPPED` (ກຳລັງສົ່ງ) ➔ `COMPLETED` (ສຳເລັດ).

### 3. 🔔 ລະບົບແຈ້ງເຕືອນ (Telegram Bot & Email Notification)
- **Telegram Bot API (100% Free)**: ເວລາລູກຄ້າກົດສັ່ງຊື້ສຳເລັດ, Node.js ຈະສົ່ງຂໍ້ຄວາມ ແລະ ຮູບສະລິບເຂົ້າ Telegram ຂອງເຈົ້າຂອງຮ້ານທັນທີ:
  - ແຈ້ງເລກບິນ (#ORD), ຊື່ລູກຄ້າ, ເບີໂທ, ທີ່ຢູ່, ລາຍການສິນຄ້າ, ແລະ ຍອດລວມ (₭ LAK).
  - ແຈ້ງເຕືອນເມື່ອສິນຄ້າໃກ້ໝົດສະຕັອກ (Low Stock Alert).
- **Email Receipt (Nodemailer)**: ສົ່ງໃບຢືນຢັນການສັ່ງຊື້ ແລະ ໃບບິນຫາອີເມວລູກຄ້າອັດຕະໂນມັດ.

### 4. 📦 ລະບົບຄຸ້ມຄອງສະຕັອກ (Inventory Logic)
- **Atomic Stock Deduction**: ຕັດສະຕັອກທັນທີເມື່ອສັ່ງຊື້ (`stock = stock - quantity`) ຜ່ານ Prisma Database Transaction ເພື່ອປ້ອງກັນການຂາຍເກີນ.
- **Out of Stock Protection**: ຖ້າ `stock <= 0` ປຸ່ມ "ໃສ່ກະຕ່າ" ຈະກາຍເປັນ Disable (ສິນຄ້າໝົດ) ທັນທີ.
- **Low Stock Alerts**: ແຈ້ງເຕືອນສິນຄ້າທີ່ເຫຼືອ $\le 5$ ຊິ້ນໃນ Admin Dashboard ພ້ອມປຸ່ມເຕີມສະຕັອກດ່ວນ (+10 ສະຕັອກ).
- **Stock Restoration**: ຖ້າ Admin ຍົກເລີກ Order (`CANCELLED`), ລະບົບຈະຄືນສະຕັອກສິນຄ້າເຂົ້າສາງອັດຕະໂນມັດ.

### 5. 🔍 ລະບົບຄົ້ນຫາ, ໝວດໝູ່ & ແບ່ງໜ້າ (Search, Category & Pagination)
- **Category Filter**: ແບ່ງສິນຄ້າຕາມໝວດໝູ່ (ກາເຟ, ຜ້າໄໝ, ເຄື່ອງໄອທີ, ຫັດຖະກຳ).
- **Search & Sort**: ຄົ້ນຫາຊື່ສິນຄ້າ (ພາສາລາວ/ອັງກິດ), ລຽງຕາມລາຄາ (ຕ່ຳ-ສູງ, ສູງ-ຕ່ຳ), ມາໃໝ່ລ່າສຸດ.
- **Pagination**: ແບ່ງໜ້າສິນຄ້າລະອຽດ 12 ລາຍການ/ໜ້າ ເພື່ອຄວາມໄວສູງສຸດ.

### 6. 🔒 ຄວາມປອດໄພ & ການກວດສອບຂໍ້ມູນ (Security & Validation)
- **Bcrypt Password Hashing**: ເຂົ້າລະຫັດລະຫັດຜ່ານ 10 Salt Rounds.
- **JWT & Role-Based Access Control**: ແບ່ງສິດລະຫວ່າງ `USER` (ລູກຄ້າ) ແລະ `ADMIN` (ຜູ້ດູແລລະບົບ).
- **Zod Data Validation**: ກວດສອບ Schema ຂອງຂໍ້ມູນທຸກ Endpoint.
- **Helmet, CORS & Rate Limiting**: ປ້ອງກັນ Web Vulnerabilities ແລະ ການຍິງ Request ຜິດປົກກະຕິ.

---

## 🛠️ ເທັກໂນໂລຢີທີ່ນຳໃຊ້ (Tech Stack)

| ພາກສ່ວນ | ເທັກໂນໂລຢີ |
|---|---|
| **Backend** | Node.js, Express.js, Prisma ORM, SQLite (ປ່ຽນເປັນ PostgreSQL ໄດ້ງ່າຍ) |
| **Frontend** | React 19, Vite, React Router 7, Lucide Icons, Canvas Confetti |
| **Media & Storage**| Multer, Cloudinary API, Local Disk Storage |
| **Notification** | Telegram Bot API, Axios, Nodemailer |
| **Security** | Bcryptjs, JsonWebToken, Zod, Helmet, Express Rate Limit, CORS |

---

## 🚀 ວິທີຕິດຕັ້ງ ແລະ ເລີ່ມຕົ້ນໃຊ້ງານ (Quick Start)

### ຂັ້ນຕອນທີ 1: Clone Repository
```bash
git clone https://github.com/HM186812/E_commerce_function.git
cd E_commerce_function
```

### ຂັ້ນຕອນທີ 2: ຕິດຕັ້ງ Backend
```bash
cd backend
npm install

# ສ້າງ Database SQLite ແລະ Seed ຂໍ້ມູນສິນຄ້າຕົວຢ່າງ
npx prisma db push
npm run seed

# ເລີ່ມຕົ້ນ Backend Server
npm start
```
> ເຊີບເວີ Backend ຈະເຮັດວຽກຢູ່: `http://localhost:5000`

---

### ຂັ້ນຕອນທີ 3: ຕິດຕັ້ງ Frontend
ເປີດ Terminal ໃໝ່ ແລ້ວເຂົ້າໂຟນເດີ `frontend`:
```bash
cd frontend
npm install

# ເລີ່ມຕົ້ນ Frontend Dev Server
npm run dev
```
> ເວັບໄຊ Frontend ຈະເຮັດວຽກຢູ່: `http://localhost:5173`

---

## 👤 ບັນຊີທົດສອບລະບົບ (Demo Accounts)

ລະບົບມີປຸ່ມ **1-Click Demo Login** ໃນໜ້າເຂົ້າສູ່ລະບົບ ຫຼື ໃຊ້ຂໍ້ມູນດັ່ງນີ້:

| ປະເພດບັນຊີ | Email | ລະຫັດຜ່ານ | ສິດການໃຊ້ງານ |
|---|---|---|---|
| 🛡️ **Admin** | `admin@shop.la` | `password123` | ເຂົ້າ Dashboard, ຈັດການສິນຄ້າ, ກວດສະລິບ, ຕັ້ງຄ່າ QR/Telegram |
| 👤 **Customer** | `user@shop.la` | `password123` | ສັ່ງຊື້ສິນຄ້າ, ອັບໂຫຼດສະລິບ, ເບິ່ງປະຫວັດ Order |

---

## ⚙️ ວິທີຕັ້ງຄ່າ Telegram Bot (ຟຣີ 100%)

1. ເຂົ້າແອັບ Telegram ແລ້ວຄົ້ນຫາ **`@BotFather`**
2. ພິມຄຳສັ່ງ `/newbot` ແລ້ວຕັ້ງຊື່ Bot ເພື່ອຮັບ **Bot Token** (ຕົວຢ່າງ: `7123456789:AAH...`)
3. ທັກຫາ Bot ທີ່ຫາກໍ່ສ້າງ ແລ້ວກົດ **Start**
4. ດຶງ **Chat ID** ຂອງທ່ານ (ສາມາດໃຊ້ Bot ເຊັ່ນ `@userinfobot` ຫຼື ເປີດ `https://api.telegram.org/bot<TOKEN>/getUpdates`)
5. ເຂົ້າ **Admin Panel ➔ ຕັ້ງຄ່າ QR & Telegram** ແລ້ວວາງ Token + Chat ID ພ້ອມກົດ **"ທົດສອບສົ່ງຂໍ້ຄວາມ"** ໄດ້ທັນທີ!

---

## 📤 ວິທີເອົາໂປຣເຈັກຂຶ້ນ GitHub (Git Push Guide)

ຫາກທ່ານຕ້ອງການ Push ໂປຣເຈັກນີ້ຂຶ້ນ Repository: `https://github.com/HM186812/E_commerce_function.git` ໃຫ້ຮັນຄຳສັ່ງດັ່ງນີ້ໃນ Root Directory:

```bash
# 1. ກວດສອບ ແລະ Initialize Git (ຖ້າຍັງບໍ່ທັນມີ)
git init

# 2. ເພີ່ມໄຟລ໌ທັງໝົດ
git add .

# 3. Commit ໂຄງສ້າງລະບົບ
git commit -m "feat: complete production-ready Lao e-commerce full-stack system"

# 4. ຕັ້ງຊື່ Branch ເປັນ main
git branch -M main

# 5. ເຊື່ອມຕໍ່ຫາ Remote Repository
git remote add origin https://github.com/HM186812/E_commerce_function.git

# 6. Push ຂຶ້ນ GitHub (ຫາກມີ origin ແລ້ວ ໃຫ້ໃຊ້ git push -u origin main --force ຖ້າຕ້ອງການຂຽນທັບ)
git push -u origin main
```

---

## 📁 ໂຄງສ້າງໂຟນເດີ (Folder Structure)

```text
E_commerce_function/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (User, Product, Category, Order, ShopSetting)
│   ├── src/
│   │   ├── config/                # Prisma, Cloudinary, Telegram configs
│   │   ├── controllers/           # Auth, Product, Order, Category, Upload, Dashboard, Settings
│   │   ├── middlewares/           # Auth (JWT), Upload (Multer), Validation (Zod), Errors
│   │   ├── routes/                # API Endpoints
│   │   ├── services/              # Telegram notification, Email receipt, Stock logic
│   │   ├── seeds/                 # Database seed script with sample Lao products
│   │   ├── app.js                 # Express App config (Helmet, CORS, Rate Limit)
│   │   └── server.js              # Server entrypoint
│   ├── uploads/                   # Local uploads storage fallback
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/                   # Axios API services
│   │   ├── components/            # Navbar, Footer, ProductCard, CartDrawer, CheckoutModal, SlipViewerModal
│   │   ├── context/               # AuthContext, CartContext
│   │   ├── pages/                 # HomePage, ProductDetailPage, MyOrdersPage, OrderSuccessPage, Auth pages
│   │   │   └── admin/             # AdminDashboard, AdminProducts, AdminOrders, AdminCategories, AdminSettings
│   │   ├── utils/                 # Currency format (₭ LAK), Date, Status badges
│   │   ├── index.css              # Premium responsive design system
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📄 License
MIT License - ສາມາດນຳໃຊ້, ດັດແປງ ແລະ ພັດທະນາຕໍ່ຍອດໄດ້ຢ່າງອິດສະຫຼະ.
