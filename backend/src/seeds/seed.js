const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

async function seedDatabase() {
  console.log('🌱 [Seeding] Starting database seeding...');

  // 1. Create Default Users (Admin and Customer)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shop.la' },
    update: {},
    create: {
      email: 'admin@shop.la',
      password: hashedPassword,
      name: 'Admin Souliya',
      phone: '020 5555 1234',
      address: 'Vientiane Capital, Laos',
      role: 'ADMIN',
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'user@shop.la' },
    update: {},
    create: {
      email: 'user@shop.la',
      password: hashedPassword,
      name: 'Khamla Phommavong',
      phone: '020 9988 7766',
      address: 'Ban Phonxay, Saysettha, Vientiane',
      role: 'USER',
    },
  });

  console.log(`👤 Users seeded: Admin (${adminUser.email}), User (${demoCustomer.email})`);

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Lao Coffee & Beverages',
      nameLao: 'ກາເຟລາວ ແລະ ເຄື່ອງດື່ມ',
      slug: 'coffee-beverages',
      description: 'ກາເຟດາວ, ກາເຟໂບລາເວນ ແລະ ຊາຊັ້ນດີຈາກປະເທດລາວ',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Lao Silk & Fashion',
      nameLao: 'ຜ້າໄໝລາວ ແລະ ແຟຊັນ',
      slug: 'silk-fashion',
      description: 'ສິ້ນໄໝລາວ, ເສື້ອພື້ນເມືອງ ແລະ ແຟຊັນລາວຮ່ວມສະໄໝ',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Electronics & Gadgets',
      nameLao: 'ເຄື່ອງເອເລັກໂຕຣນິກ & ອຸປະກອນໄອທີ',
      slug: 'electronics',
      description: 'ຫູຟັງ Bluetooth, Smartwatch, ອຸປະກອນມືຖືຄຸນນະພາບສູງ',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Handicrafts & Souvenirs',
      nameLao: 'ຫັດຖະກຳ & ຂອງຝາກພື້ນເມືອງ',
      slug: 'handicrafts',
      description: 'ເຄື່ອງຈັກສານ, ໄມ້ແກະສະຫຼັກ ແລະ ເຄື່ອງເງິນແທ້',
      image: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log('📂 Categories seeded:', Object.keys(categoryMap).length);

  // 3. Create Sample Products with realistic Lao Kip prices & stock
  const productsData = [
    {
      name: 'Dao Premium Arabica Bolaven Coffee 500g',
      nameLao: 'ກາເຟ ອາຣາບິກ້າ ດາວ ພູພຽງບໍລະເວນ 500g',
      description: 'ກາເຟອາຣາບິກ້າແທ້ 100% ປູກເທິງພູພຽງບໍລະເວນທີ່ມີຄວາມສູງ 1,200m ກິ່ນຫອມລະມຸນ ລົດຊາດເຂັ້ມຂຸ້ນ.',
      price: 95000,
      originalPrice: 110000,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['coffee-beverages'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Sinouk Organic Robusta Dark Roast 250g',
      nameLao: 'ກາເຟຊີໂນກ ອໍແກນິກ ໂຣບັສຕາ 250g',
      description: 'ກາເຟຄົ້ວເຂັ້ມພິເສດ ໃຫ້ຄວາມຕື່ນໂຕເຕັມທີ່ ເໝາະສຳລັບຄໍ Espresso.',
      price: 65000,
      originalPrice: 75000,
      stock: 28,
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['coffee-beverages'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Handwoven Lao Silk Sin (Luang Prabang Pattern)',
      nameLao: 'ສິ້ນໄໝມ້ອນທໍມື ລາຍຫຼວງພະບາງ ດັ້ງເດີມ',
      description: 'ສິ້ນໄໝແທ້ທໍມືດ້ວຍກີ່ພື້ນເມືອງ ລວດລາຍງົດງາມປານີດ ໃສ່ໄປງານບຸນ ງານດອງຢ່າງສະຫງ່າງາມ.',
      price: 850000,
      originalPrice: 980000,
      stock: 3, // Low stock on purpose to test low stock alert!
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['silk-fashion'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Modern Lao Cotton Shirt (Indigo Dyed)',
      nameLao: 'ເສື້ອເຊີດຝ້າຍຍ້ອມຄາມທຳມະຊາດ',
      description: 'ເສື້ອຝ້າຍແທ້ 100% ຍ້ອມສີຄາມທຳມະຊາດ ລະບາຍອາກາດໄດ້ດີ ໃສ່ສະບາຍທັງຍິງແລະຊາຍ.',
      price: 220000,
      originalPrice: 250000,
      stock: 18,
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['silk-fashion'],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Wireless ANC Noise-Cancelling Headphones Pro',
      nameLao: 'ຫູຟັງໄຮ້ສາຍຕັດສຽງລົບກວນ ANC Pro',
      description: 'ລະບົບຕັດສຽງລົບກວນຂັ້ນສູງ ແບັດເຕີຣີດົນເຖິງ 40 ຊົ່ວໂມງ ສຽງເບສແໜ້ນ ຄົມຊັດ.',
      price: 490000,
      originalPrice: 590000,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['electronics'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Fast Charging Magnetic Power Bank 20,000mAh',
      nameLao: 'ພາວເວີແບັງສາກໄວ 20,000mAh ຮອງຮັບ MagSafe',
      description: 'ຂະໜາດກະທັດຮັດ ຮອງຮັບການສາກໄວ 22.5W ແລະ ສາກໄຮ້ສາຍ 15W ສະດວກສະບາຍ.',
      price: 280000,
      originalPrice: 320000,
      stock: 2, // Low stock on purpose
      image: 'https://images.unsplash.com/photo-1609592426815-520ec2c20a9a?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['electronics'],
      isFeatured: false,
      isActive: true,
    },
    {
      name: 'Handcrafted Lao Bamboo Tea Set & Tray',
      nameLao: 'ຊຸດຈອກຊາ ແລະ ຖາດໄມ້ໄຜ່ຈັກສານຫັດຖະກຳ',
      description: 'ຊຸດນ້ຳຊາໄມ້ໄຜ່ສານມື ລວດລາຍລະອຽດ ປອດສານເຄມີ ເໝາະສຳລັບຕ້ອນຮັບແຂກ ຫຼື ຂອງຂວັນ.',
      price: 180000,
      originalPrice: 210000,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['handicrafts'],
      isFeatured: true,
      isActive: true,
    },
    {
      name: 'Pure Lao Silver Bracelet 92.5%',
      nameLao: 'ສາຍແຂນເງິນແທ້ລາວ 92.5% ລາຍດອກຈຳປາ',
      description: 'ເງິນແທ້ຈາກຊ່າງຝີມືເມືອງຫຼວງພະບາງ ສະຫຼັກລາຍດອກຈຳປາເອກະລັກລາວ.',
      price: 450000,
      originalPrice: 500000,
      stock: 0, // Out of stock on purpose to test disabled cart button
      image: 'https://images.unsplash.com/photo-1611591475102-4a0058b45663?auto=format&fit=crop&w=800&q=80',
      categoryId: categoryMap['handicrafts'],
      isFeatured: false,
      isActive: true,
    },
  ];

  for (const prod of productsData) {
    const existing = await prisma.product.findFirst({ where: { name: prod.name } });
    if (!existing) {
      await prisma.product.create({ data: prod });
    }
  }
  console.log('🛍️ Products seeded:', productsData.length);

  // 4. Create Default Shop Setting with BCEL One QR Code
  await prisma.shopSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      shopName: 'ຮ້ານຄ້າອອນລາຍລາວ (Lao E-Commerce Store)',
      shopPhone: '020 9999 8888',
      shopAddress: 'ຖະໜົນລ້ານຊ້າງ, ບ້ານຫັດສະດີ, ເມືອງຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
      bcelAccountName: 'LAO E-COMMERCE CO., LTD',
      bcelAccountNumber: '010-12-00-00898823-001',
      bcelQrImage: 'https://images.unsplash.com/photo-1595079672139-5451000f0744?auto=format&fit=crop&w=600&q=80',
      telegramBotToken: '',
      telegramChatId: '',
      telegramEnabled: false,
      lowStockThreshold: 5,
    },
  });

  console.log('⚙️ Shop Settings seeded successfully.');
  console.log('🎉 [Seeding Completed] Admin: admin@shop.la / password123 | User: user@shop.la / password123');
}

seedDatabase()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
