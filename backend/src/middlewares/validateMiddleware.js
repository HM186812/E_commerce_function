const { z } = require('zod');

/**
 * Generic middleware generator to validate request body against a Zod schema
 * @param {z.ZodSchema} schema
 */
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'ຂໍ້ມູນທີ່ສົ່ງມາບໍ່ຖືກຕ້ອງຕາມຮູບແບບ (Validation Error)',
          errors,
        });
      }
      next(error);
    }
  };
}

// ==================== Zod Validation Schemas ====================

// 1. Auth Schemas
const registerSchema = z.object({
  name: z.string().min(2, 'ຊື່ຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'),
  email: z.string().email('ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ'),
  password: z.string().min(6, 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ'),
  password: z.string().min(1, 'ກະລຸນາປ້ອນລະຫັດຜ່ານ'),
});

// 2. Product Schemas
const productSchema = z.object({
  name: z.string().min(2, 'ຊື່ສິນຄ້າຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'),
  nameLao: z.string().min(2, 'ຊື່ສິນຄ້າພາສາລາວຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'),
  description: z.string().optional(),
  price: z.coerce.number().positive('ລາຄາຕ້ອງຫຼາຍກວ່າ 0 ກີບ'),
  originalPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'ຈຳນວນສະຕັອກຕ້ອງບໍ່ຕິດລົບ'),
  image: z.string().min(1, 'ຕ້ອງມີຮູບພາບຫຼັກຂອງສິນຄ້າ'),
  images: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),
});

// 3. Category Schemas
const categorySchema = z.object({
  name: z.string().min(2, 'ຊື່ໝວດໝູ່ຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'),
  nameLao: z.string().min(2, 'ຊື່ໝວດໝູ່ພາສາລາວຕ້ອງມີຢ່າງໜ້ອຍ 2 ຕົວອັກສອນ'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

// 4. Order Item Schema
const orderItemSchema = z.object({
  productId: z.string().min(1, 'ລະຫັດສິນຄ້າບໍ່ຖືກຕ້ອງ'),
  quantity: z.number().int().positive('ຈຳນວນສິນຄ້າຕ້ອງຫຼາຍກວ່າ 0'),
});

// 5. Create Order Schema
const createOrderSchema = z.object({
  customerName: z.string().min(2, 'ກະລຸນາປ້ອນຊື່ລູກຄ້າ'),
  customerPhone: z.string().min(6, 'ກະລຸນາປ້ອນເບີໂທລະສັບຕິດຕໍ່'),
  customerAddress: z.string().min(5, 'ກະລຸນາປ້ອນທີ່ຢູ່ຈັດສົ່ງລະອຽດ'),
  customerNote: z.string().optional().nullable(),
  paymentMethod: z.enum(['BCEL_ONE_QR', 'CASH_ON_DELIVERY']).default('BCEL_ONE_QR'),
  paymentSlipUrl: z.string().optional().nullable(),
  paymentSlipPublicId: z.string().optional().nullable(),
  items: z.array(orderItemSchema).min(1, 'ຕ້ອງມີສິນຄ້າຢ່າງໜ້ອຍ 1 ລາຍການ'),
});

// 6. Update Order Status Schema
const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED']),
  adminNote: z.string().optional().nullable(),
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  productSchema,
  categorySchema,
  createOrderSchema,
  updateOrderStatusSchema,
};
