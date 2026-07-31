const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
require('dotenv').config();

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new pg.Client({
      connectionString: process.env.DATABASE_URL,
    })
  ),
});

async function main() {
  console.log(' la Seeding database...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Create Categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });
  const clothing = await prisma.category.create({
    data: { name: 'Clothing', slug: 'clothing' },
  });
  const home = await prisma.category.create({
    data: { name: 'Home & Kitchen', slug: 'home-kitchen' },
  });

  // 3. Create Products
  const products = [
    {
      name: 'Premium Wireless Headphones',
      description: 'Experience high-quality sound with noise cancellation and 40-hour battery life.',
      price: 199.99,
      stock: 50,
      categoryId: electronics.id,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c069578?w=500'],
    },
    {
      name: 'Smart Watch Series 7',
      description: 'Track your health and stay connected with the latest smartwatch technology.',
      price: 299.99,
      stock: 30,
      categoryId: electronics.id,
      images: ['https://images.unsplash.com/photo-1523275335827-297797a3028d?w=500'],
    },
    {
      name: 'Cotton Slim Fit T-Shirt',
      description: 'Comfortable, breathable 100% cotton t-shirt for everyday wear.',
      price: 25.00,
      stock: 100,
      categoryId: clothing.id,
      images: ['https://images.unsplash.com/photo-1521572163471-f4e5f7df1153?w=500'],
    },
    {
      name: 'Designer Denim Jacket',
      description: 'Stylish blue denim jacket with a modern fit and durable fabric.',
      price: 89.99,
      stock: 20,
      categoryId: clothing.id,
      images: ['https://images.unsplash.com/photo-1523381210434-27a5fbb7d191?w=500'],
    },
    {
      name: 'Ergonomic Office Chair',
      description: 'Premium office chair with lumbar support and adjustable height.',
      price: 150.00,
      stock: 15,
      categoryId: home.id,
      images: ['https://images.unsplash.com/photo-1586023204430-073f3f657f3d?w=500'],
    },
    {
      name: 'Stainless Steel Coffee Maker',
      description: 'Brews the perfect cup of coffee every morning with a programmable timer.',
      price: 79.99,
      stock: 40,
      categoryId: home.id,
      images: ['https://images.unsplash.com/photo-1544178121-3573a3138b83?w=500'],
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
