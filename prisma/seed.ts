import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create an Admin user
  // const admin = await prisma.user.upsert({
  //   where: { email: 'admin@mythicgames.com' },
  //   update: {},
  //   create: {
  //     name: 'Admin User',
  //     email: 'admin@mythicgames.com',
  //     password: 'adminpassword', 
  //     role: 'ADMIN',
  //   },
  // });

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
  // Create Games
  const gamesData = [
    {
      title: 'Red Dead Redemption 2',
      description: 'Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, Red Dead Redemption 2 is an epic tale of honor and loyalty at the dawn of the modern age. Follow Arthur Morgan and the Van der Linde gang as they rob, steal, and fight their way across the rugged heartland of America in order to survive.',
      price: 59.99,
      coverImage: 'https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png',
      releaseDate: new Date('2018-10-26'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Forza Horizon 6 Standard Edition',
      description: 'The award-winning open-world driving series makes its highly anticipated debut in Japan. Explore breathtaking neon-lit Tokyo streets, serene mountain passes, and historic shrines while building your legacy at the Horizon Festival. Features an unprecedented roster of over 550 highly detailed real-world sports cars, supercars, and hypercars with dynamic weather systems.',
      price: 69.99,
      coverImage: 'https://image.api.playstation.com/vulcan/ap/rnd/202601/1616/9e09677388a2f815ab02fe08cc918d945b822d4041a55023.png',
      releaseDate: new Date('2026-05-19'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Resident Evil Requiem',
      description: 'A groundbreaking dual-protagonist survival horror masterpiece from Capcom. Players balance psychological tension and meticulous investigation as FBI analyst Grace Ashcroft, while engaging in desperate, heavy-hitting tactical action as veteran operative Leon S. Kennedy. Their paths collide in an immersive, terrifyingly dark journey.',
      price: 69.99,
      coverImage: 'https://image.api.playstation.com/vulcan/ap/rnd/202512/1205/79661d7a2bdb9784749b4e57e1456ca89f7ac7bed8615aee.png',
      releaseDate: new Date('2026-02-27'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Cyberpunk 2077 Complete Edition',
      description: 'An open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification. Take on the role of V, a mercenary outlaw, and navigate deep cybernetic upgrades, lethal street combat, and world-shaping narrative choices across an expansive neon playground.',
      price: 59.99,
      coverImage: 'https://image.api.playstation.com/vulcan/ap/rnd/202008/0416/6Bo40lnWU0BhgrOUm7Cb6by3.png',
      releaseDate: new Date('2020-12-10'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Grand Theft Auto V',
      description: 'Head to the neon-soaked state of Leonida, home to the sun-drenched streets of Vice City and beyond. Follow the chaotic, high-stakes story of Lucia and Jason in the most immersive, dynamic, and detail-rich open-world evolution the series has ever seen. From high-speed chases to deep criminal enterprises, it sets a new benchmark for open-world action.',
      price: 69.99,
      coverImage: 'https://image.api.playstation.com/vulcan/ap/rnd/202202/2816/mYn2ETBKFct26V9mJnZi4aSS.png',
      releaseDate: new Date('2025-11-18'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Ghost of Yotei',
      description: 'Set in 1603 Japan, follow a new protagonist, Atsu, on a gripping tale of under-the-radar vengeance across the rugged lands surrounding Mount Yotei. Master the lethal art of the samurai, precise counter-attacks, and stealth tactics while exploring sweeping tundras, dangerous forests, and stunning vistas built from the ground up for next-gen hardware.',
      price: 69.99,
      coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzdgk66R0aCDKCagPz58yvkchKDTbgwVUe8w&s',
      releaseDate: new Date('2025-10-24'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Monster Hunter Wilds',
      description: 'Enter a living, unforgiving ecosystem where massive monster herds adapt dynamically to extreme changing weather. Hunt colossal beasts utilizing an evolved combat system, 14 unique weapon types, and your agile Seikret mount. Collect rare materials to craft powerful weapons and armor in this ultimate cooperative hunting experience.',
      price: 69.99,
      coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2025-02-28'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Elden Ring: Shadow of the Erdtree Edition',
      description: "The definitive edition combining FromSoftware's masterpiece open-world action RPG with its massive expansion. Rise, Tarnished, and navigate the treacherous Lands Between and the enigmatic Realm of Shadow. Defeat demigods in challenging, precise melee combat, wield powerful magic, and piece together a rich, fragmented lore.",
      price: 79.99,
      coverImage: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2024-06-21'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: "Marvel's Spider-Man 2",
      description: 'Swing, jump, and utilize the new Web Wings to travel across an expanded Marvel’s New York. Quickly switch between Peter Parker and Miles Morales to experience different stories and epic new abilities. Battle iconic villains including Kraven the Hunter and the symbiotic terror, Venom, to save the city from total collapse.',
      price: 69.99,
      coverImage: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2023-10-20'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'DOOM: The Dark Ages',
      description: "Experience the cinematic, brutal origin story of the Doom Slayer's rage. Trading high-tech sci-fi corridors for dark, medieval hellscapes, this intense prequel introduces devastating siege combat, a lethal shield saw, and explosive dragon-riding mechanics. Obliterate massive demonic armies in a blood-soaked campaign built on unstoppable momentum.",
      price: 69.99,
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2026-05-12'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Phantom Blade Zero',
      description: 'A dark, lightning-fast "Kung-Fu Punk" action-adventure game. Players step into the shoes of Soul, an elite assassin framed for the murder of his clan’s patriarch. Left with only 66 days to live, you must hunt down those responsible using smooth, hyper-kinetic martial arts combos and supernatural blade work in a bleak, rain-slicked world.',
      price: 69.99,
      coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2026-09-09'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Borderlands 4 Super Deluxe Edition',
      description: 'The ultimate looter-shooter returns with four brand-new Vault Hunters navigating a hostile, uncharted planet outside of Pandora. This expanded edition delivers billions of bizarre weapon combinations, totally overhauled procedural destruction systems, and a fully optimized cooperative multiplayer campaign built for relentless, chaotic fun with friends.',
      price: 89.99,
      coverImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2026-03-13'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'Nioh 3: Blood of the Yokai',
      description: 'Team Ninja delivers its most ambitious samurai epic yet, evolving the series’ signature, punishing stance-based combat into a vast "open-field" design. Explore massive, folklore-infused battlegrounds of ancient Japan, master lethal new weapon classes, and manipulate a deeper Yokai transformation system to conquer terrifying mythological bosses.',
      price: 69.99,
      coverImage: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2026-04-17'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
    },
    {
      title: 'S.T.A.L.K.E.R. 2: Heart of Chornobyl',
      description: 'Explore the vast Chornobyl Exclusion Zone, a hyper-immersive open world teeming with deadly anomalies, radioactive ruins, and desperate factions. As a lone stalker, every choice you make impacts a branching survival story. Master tactical, unforgiving gunplay and navigate a shifting ecosystem where both human and mutant threats stalk you from the shadows.',
      price: 59.99,
      coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
      releaseDate: new Date('2024-11-20'),
      categoryId: categories.find(c => c.name === 'Action')?.id || categories[0].id,
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
