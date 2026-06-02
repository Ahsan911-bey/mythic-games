import { prisma } from '@/lib/prisma';
import HeroBanner from '@/components/HeroBanner';
import GameCard from '@/components/GameCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const featuredGames = await prisma.game.findMany({
    take: 8,
    orderBy: { releaseDate: 'desc' },
    include: { category: true },
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <HeroBanner />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-[hsl(var(--primary))] pl-3">
            Featured Games
          </h2>
          <Link href="/games" className="text-sm font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition-colors group">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredGames.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              price={game.price}
              coverImage={game.coverImage}
              category={game.category.name}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
