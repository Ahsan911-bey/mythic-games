import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mythicgames.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@mythicgames.com',
      password: 'adminpassword', // Simple plain text password as required
      role: 'ADMIN',
    },
  });

  // Create some Categories
  const categoriesData = ['Action', 'RPG', 'Strategy', 'Shooter', 'Adventure'];
  const categories = [];

  for (const name of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories.push(category);
  }

  // Create Games
  const gamesData = [
    {
      title: 'Cyber Strike 2077',
      description: 'A futuristic action RPG with stunning visuals.',
      price: 59.99,
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      releaseDate: new Date('2023-10-27'),
      categoryId: categories.find(c => c.name === 'RPG')?.id || categories[0].id,
    },
    {
      title: 'Galactic Warfare',
      description: 'Epic space battles in a massive multiplayer universe.',
      price: 39.99,
      coverImage: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1969&auto=format&fit=crop',
      releaseDate: new Date('2024-01-15'),
      categoryId: categories.find(c => c.name === 'Shooter')?.id || categories[0].id,
    },
    {
      title: 'Medieval Conquest',
      description: 'Build your kingdom and conquer enemy territories.',
      price: 29.99,
      coverImage: 'https://images.unsplash.com/photo-1599304918296-6e4aee7a4628?q=80&w=1974&auto=format&fit=crop',
      releaseDate: new Date('2022-05-10'),
      categoryId: categories.find(c => c.name === 'Strategy')?.id || categories[0].id,
    },
    {
      title: 'Mystery of the Ancients',
      description: 'An atmospheric adventure full of puzzles.',
      price: 19.99,
      coverImage: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
      releaseDate: new Date('2023-12-01'),
      categoryId: categories.find(c => c.name === 'Adventure')?.id || categories[0].id,
    },
  ];

  for (const game of gamesData) {
    await prisma.game.create({
      data: game,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
