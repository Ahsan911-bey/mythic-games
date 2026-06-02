import { prisma } from '@/lib/prisma';
import GameCard from '@/components/GameCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const whereClause: any = {};
  if (q) whereClause.title = { contains: q };
  if (category) whereClause.categoryId = parseInt(category, 10);

  const [games, categories] = await Promise.all([
    prisma.game.findMany({ where: whereClause, include: { category: true }, orderBy: { releaseDate: 'desc' } }),
    prisma.category.findMany(),
  ]);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 fade-up">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-1" style={{ letterSpacing: '-0.03em' }}>Store</h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          {games.length} games available
        </p>
      </div>

      {/* Search & Filter bar */}
      <form action="/games" method="GET" className="flex flex-col sm:flex-row gap-3 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            name="q"
            defaultValue={q || ''}
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium text-white placeholder-[--text-muted] outline-none transition-all focus:border-[--brand]"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
          <select
            name="category"
            defaultValue={category || ''}
            className="pl-10 pr-10 py-2.5 rounded-xl text-sm font-medium text-white outline-none appearance-none cursor-pointer transition-all"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)', minWidth: '160px' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <button type="submit"
          className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all btn-glow"
          style={{ background: 'var(--brand)' }}>
          Filter
        </button>

        {(q || category) && (
          <a href="/games" className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5 flex items-center justify-center"
            style={{ color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Clear
          </a>
        )}
      </form>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        <a href="/games" className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${!category ? 'text-white' : 'hover:bg-white/5'}`}
          style={!category ? { background: 'var(--brand)' } : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}>
          All
        </a>
        {categories.map((c) => (
          <a key={c.id} href={`/games?category=${c.id}`}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${category === String(c.id) ? 'text-white' : 'hover:bg-white/5'}`}
            style={category === String(c.id)
              ? { background: 'var(--brand)' }
              : { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }
            }>
            {c.name}
          </a>
        ))}
      </div>

      {/* Games grid */}
      {games.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-5xl mb-4">🎮</p>
          <h2 className="text-xl font-bold text-white mb-2">No games found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Try different search terms or categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {games.map((game) => (
            <GameCard key={game.id} id={game.id} title={game.title} price={game.price}
              coverImage={game.coverImage} category={game.category.name} />
          ))}
        </div>
      )}
    </div>
  );
}
