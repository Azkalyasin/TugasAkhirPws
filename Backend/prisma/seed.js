const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateApiKey } = require('../src/utils/apiKeyGenerator');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockapi.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@stockapi.com',
      password: adminPassword,
      role: 'ADMIN',
      plan: 'ENTERPRISE'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create Test Users
  const userPassword = await bcrypt.hash('user123', 10);
  
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: 'USER',
      plan: 'FREE',
      apiKey: generateApiKey(),
      monthlyQuota: 1000,
      dailyQuota: 100
    }
  });
  console.log('✅ User created:', user1.email, '| API Key:', user1.apiKey);

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: userPassword,
      role: 'USER',
      plan: 'STARTER',
      apiKey: generateApiKey(),
      monthlyQuota: 50000,
      dailyQuota: 5000
    }
  });
  console.log('✅ User created:', user2.email, '| API Key:', user2.apiKey);

  // Create Sample Stocks
  const stocks = [
    {
      symbol: 'BBCA',
      name: 'Bank Central Asia Tbk',
      sector: 'Banking',
      subsector: 'Bank',
      price: 9875,
      open: 9800,
      high: 9900,
      low: 9750,
      close: 9875,
      change: 125,
      changePercent: 1.28,
      volume: BigInt(45678900),
      value: BigInt(451234567890),
      marketCap: BigInt(1234567890000),
      shares: BigInt(125000000000)
    },
    {
      symbol: 'BBRI',
      name: 'Bank Rakyat Indonesia Tbk',
      sector: 'Banking',
      subsector: 'Bank',
      price: 5250,
      open: 5300,
      high: 5350,
      low: 5200,
      close: 5250,
      change: -50,
      changePercent: -0.94,
      volume: BigInt(89234500),
      value: BigInt(468481125000),
      marketCap: BigInt(987654321000),
      shares: BigInt(188000000000)
    },
    {
      symbol: 'BMRI',
      name: 'Bank Mandiri Tbk',
      sector: 'Banking',
      subsector: 'Bank',
      price: 6500,
      open: 6475,
      high: 6550,
      low: 6450,
      close: 6500,
      change: 25,
      changePercent: 0.39,
      volume: BigInt(67890123),
      value: BigInt(441285799500),
      marketCap: BigInt(1567890123000),
      shares: BigInt(241000000000)
    },
    {
      symbol: 'TLKM',
      name: 'Telkom Indonesia Tbk',
      sector: 'Telecommunication',
      subsector: 'Telecommunication',
      price: 3850,
      open: 3800,
      high: 3900,
      low: 3775,
      close: 3850,
      change: 75,
      changePercent: 1.99,
      volume: BigInt(123456789),
      value: BigInt(475308637150),
      marketCap: BigInt(385000000000),
      shares: BigInt(100000000000)
    },
    {
      symbol: 'ASII',
      name: 'Astra International Tbk',
      sector: 'Automotive',
      subsector: 'Automotive',
      price: 5100,
      open: 5050,
      high: 5150,
      low: 5000,
      close: 5100,
      change: 50,
      changePercent: 0.99,
      volume: BigInt(34567890),
      value: BigInt(176296239000),
      marketCap: BigInt(204000000000),
      shares: BigInt(40000000000)
    },
    {
      symbol: 'UNVR',
      name: 'Unilever Indonesia Tbk',
      sector: 'Consumer Goods',
      subsector: 'Consumer Goods',
      price: 2650,
      open: 2625,
      high: 2675,
      low: 2610,
      close: 2650,
      change: 25,
      changePercent: 0.95,
      volume: BigInt(12345678),
      value: BigInt(32715546700),
      marketCap: BigInt(198750000000),
      shares: BigInt(75000000000)
    },
    {
      symbol: 'GOTO',
      name: 'GoTo Gojek Tokopedia Tbk',
      sector: 'Technology',
      subsector: 'E-commerce',
      price: 125,
      open: 100,
      high: 135,
      low: 98,
      close: 125,
      change: 25,
      changePercent: 25.00,
      volume: BigInt(987654321),
      value: BigInt(123456790125),
      marketCap: BigInt(25000000000),
      shares: BigInt(200000000000)
    },
    {
      symbol: 'INDF',
      name: 'Indofood Sukses Makmur Tbk',
      sector: 'Consumer Goods',
      subsector: 'Food & Beverages',
      price: 6775,
      open: 6750,
      high: 6800,
      low: 6725,
      close: 6775,
      change: 25,
      changePercent: 0.37,
      volume: BigInt(23456789),
      value: BigInt(158934644775),
      marketCap: BigInt(59581250000),
      shares: BigInt(8793850000)
    }
  ];

  for (const stockData of stocks) {
    const stock = await prisma.stock.upsert({
      where: { symbol: stockData.symbol },
      update: stockData,
      create: stockData
    });
    console.log('✅ Stock created:', stock.symbol, '-', stock.name);

    // Create sample history data
    const historyData = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const variance = Math.random() * 0.1 - 0.05; // -5% to +5%
      const dayOpen = stockData.price * (1 + variance);
      const dayHigh = dayOpen * (1 + Math.random() * 0.03);
      const dayLow = dayOpen * (1 - Math.random() * 0.03);
      const dayClose = dayLow + Math.random() * (dayHigh - dayLow);
      const dayVolume = BigInt(Math.floor(Number(stockData.volume) * (0.7 + Math.random() * 0.6)));

      historyData.push({
        stockId: stock.id,
        date,
        open: dayOpen,
        high: dayHigh,
        low: dayLow,
        close: dayClose,
        volume: dayVolume
      });
    }

    await prisma.stockHistory.createMany({
      data: historyData,
      skipDuplicates: true
    });
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });