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
