import { prisma } from '@/lib/prisma';
import GameCard from '@/components/GameCard';
import Link from 'next/link';

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const whereClause: any = {};
  if (q) {
    whereClause.title = { contains: q };
  }
  if (category) {
    whereClause.categoryId = parseInt(category, 10);
  }

  const [games, categories] = await Promise.all([
    prisma.game.findMany({
      where: whereClause,
      include: { category: true },
      orderBy: { releaseDate: 'desc' },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter text-glow">
          All Games
        </h1>

        <form className="flex gap-4 w-full md:w-auto" action="/games" method="GET">
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search games..."
            className="flex-grow bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
          />
          <select
            name="category"
            defaultValue={category || ''}
            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 text-black font-bold py-2 px-6 rounded-lg transition-colors">
            Filter
          </button>
        </form>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-500">No games found</h2>
          <p className="text-gray-600 mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {games.map((game) => (
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
      )}
    </div>
  );
}
