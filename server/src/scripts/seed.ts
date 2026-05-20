import type { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const DATA = [
  {
    code: 'IT',
    name: 'Công nghệ thông tin',
    subjects: [
      { code: 'IT3040', name: 'Cấu trúc dữ liệu và giải thuật' },
      { code: 'IT3070', name: 'Hệ điều hành' },
      { code: 'IT3080', name: 'Mạng máy tính' },
      { code: 'IT4060', name: 'Trí tuệ nhân tạo' },
      { code: 'IT4409', name: 'Lập trình Web' },
    ],
  },
  {
    code: 'EE',
    name: 'Kỹ thuật điện',
    subjects: [
      { code: 'EE2000', name: 'Mạch điện' },
      { code: 'EE3110', name: 'Điện tử công suất' },
    ],
  },
  {
    code: 'ME',
    name: 'Kỹ thuật cơ khí',
    subjects: [
      { code: 'ME2010', name: 'Cơ học kỹ thuật' },
      { code: 'ME3050', name: 'Chi tiết máy' },
    ],
  },
  {
    code: 'MATH',
    name: 'Toán đại cương',
    subjects: [
      { code: 'MI1111', name: 'Giải tích 1' },
      { code: 'MI1121', name: 'Giải tích 2' },
      { code: 'MI1141', name: 'Đại số tuyến tính' },
    ],
  },
];

// Quà mẫu cho FR-11. Cosmetic (BADGE/AVATAR_FRAME) render bằng CSS — không cần ảnh.
// Voucher/quà thật cần ảnh đặt tại client/public/rewards/<tên-file>.
const GIFTS: Prisma.GiftCreateInput[] = [
  // --- Huy hiệu (BADGE) ---
  {
    name: 'Huy hiệu Người mới đóng góp',
    description: 'Dành cho thành viên vừa bắt đầu hành trình chia sẻ tài liệu.',
    type: 'BADGE',
    pointsCost: 50,
    icon: 'Sparkles',
    accentColor: '#16a34a',
  },
  {
    name: 'Huy hiệu Cây bút chăm chỉ',
    description: 'Ghi nhận những người đóng góp đều đặn cho cộng đồng HUST.',
    type: 'BADGE',
    pointsCost: 150,
    icon: 'PenTool',
    accentColor: '#2563eb',
  },
  {
    name: 'Huy hiệu Huyền thoại HUST',
    description: 'Biểu tượng danh giá cho người đóng góp xuất sắc nhất.',
    type: 'BADGE',
    pointsCost: 500,
    icon: 'Crown',
    accentColor: '#d97706',
  },
  // --- Khung avatar (AVATAR_FRAME) ---
  {
    name: 'Khung Bình minh',
    description: 'Vòng khung gradient cam — hồng rực rỡ quanh ảnh đại diện.',
    type: 'AVATAR_FRAME',
    pointsCost: 100,
    frameGradient: 'linear-gradient(135deg, #f59e0b, #ec4899)',
  },
  {
    name: 'Khung Đại dương',
    description: 'Vòng khung gradient xanh dương — xanh ngọc mát mắt.',
    type: 'AVATAR_FRAME',
    pointsCost: 250,
    frameGradient: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
  },
  {
    name: 'Khung Hoàng kim',
    description: 'Vòng khung ánh kim sang trọng dành cho thành viên kỳ cựu.',
    type: 'AVATAR_FRAME',
    pointsCost: 800,
    frameGradient: 'linear-gradient(135deg, #fcd34d, #d97706, #fcd34d)',
  },
  // --- Voucher kỹ thuật số (VOUCHER) ---
  {
    name: 'Voucher Highlands Coffee 50k',
    description: 'Phiếu giảm giá 50.000đ cho đồ uống tại Highlands Coffee.',
    type: 'VOUCHER',
    pointsCost: 300,
    stock: 20,
    imageUrl: '/rewards/highlands-50k.png',
  },
  {
    name: 'Voucher Phúc Long 50k',
    description: 'Phiếu giảm giá 50.000đ cho đồ uống tại Phúc Long.',
    type: 'VOUCHER',
    pointsCost: 300,
    stock: 20,
    imageUrl: '/rewards/phuclong-50k.png',
  },
  {
    name: 'Steam Wallet Code 100k',
    description: 'Mã nạp ví Steam trị giá 100.000đ.',
    type: 'VOUCHER',
    pointsCost: 600,
    stock: 10,
    imageUrl: '/rewards/steam-100k.png',
  },
  {
    name: 'Thẻ điện thoại 50k',
    description: 'Mã thẻ nạp điện thoại mệnh giá 50.000đ (mọi nhà mạng).',
    type: 'VOUCHER',
    pointsCost: 350,
    stock: 15,
    imageUrl: '/rewards/mobile-card-50k.png',
  },
  // --- Quà vật lý (OFFLINE_GIFT) ---
  {
    name: 'Sổ tay HUST',
    description: 'Sổ tay in logo Bách khoa Hà Nội — nhận trực tiếp tại trường.',
    type: 'OFFLINE_GIFT',
    pointsCost: 200,
    stock: 30,
    imageUrl: '/rewards/hust-notebook.png',
  },
  {
    name: 'Áo thun HUST',
    description: 'Áo thun kỷ niệm HUST Docs — nhận trực tiếp tại trường.',
    type: 'OFFLINE_GIFT',
    pointsCost: 700,
    stock: 15,
    imageUrl: '/rewards/hust-tshirt.png',
  },
];

async function seedGifts() {
  for (const g of GIFTS) {
    const existing = await prisma.gift.findFirst({ where: { name: g.name } });
    if (existing) {
      // Cập nhật phần hiển thị, giữ nguyên stock đang dùng.
      await prisma.gift.update({
        where: { id: existing.id },
        data: {
          description: g.description,
          type: g.type,
          pointsCost: g.pointsCost,
          icon: g.icon ?? null,
          accentColor: g.accentColor ?? null,
          frameGradient: g.frameGradient ?? null,
          imageUrl: g.imageUrl ?? null,
        },
      });
    } else {
      await prisma.gift.create({ data: g });
    }
  }
  console.log(`[seed] ${GIFTS.length} gifts ready`);
}

async function main() {
  for (const m of DATA) {
    const major = await prisma.major.upsert({
      where: { code: m.code },
      update: { name: m.name },
      create: { code: m.code, name: m.name },
    });
    for (const s of m.subjects) {
      await prisma.subject.upsert({
        where: { code_majorId: { code: s.code, majorId: major.id } },
        update: { name: s.name },
        create: { code: s.code, name: s.name, majorId: major.id },
      });
    }
  }
  await seedGifts();
  console.log('[seed] done');
}

main()
  .catch((err) => {
    console.error('[seed] failed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
