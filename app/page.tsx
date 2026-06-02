import { prisma } from '@/lib/prisma';
import HeroBanner from '@/components/HeroBanner';
import GameCard from '@/components/GameCard';
import Link from 'next/link';
import { ArrowRight, Flame, Zap, Trophy } from 'lucide-react';

function SectionHeader({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', color: '#9D68FF' }}>
          {icon}
        </div>
        <h2 className="text-xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-white group" style={{ color: 'var(--text-secondary)' }}>
        View All
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

export default async function Home() {
  const [featuredGames, allGames] = await Promise.all([
    prisma.game.findMany({
      where: { isFeatured: true },
      take: 6,
      orderBy: { featuredAt: 'desc' },
      include: { category: true },
    }),
    prisma.game.findMany({
      take: 10,
      orderBy: { releaseDate: 'desc' },
      include: { category: true },
    }),
  ]);

  const newReleases = allGames.slice(0, 5);
  const topSelling = allGames.slice(5, 10);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-16 fade-up">
      {/* Hero */}
      <HeroBanner />

      {/* Featured Games */}
      {featuredGames.length > 0 && (
        <section>
          <SectionHeader icon={<Trophy className="w-4 h-4" />} title="Featured Games" href="/games" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredGames.map((game) => (
              <GameCard key={game.id} id={game.id} title={game.title} price={game.price}
                coverImage={game.coverImage} category={game.category.name} />
            ))}
          </div>
        </section>
      )}

      {/* New Releases */}
      <section>
        <SectionHeader icon={<Zap className="w-4 h-4" />} title="New Releases" href="/games" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {newReleases.map((game) => (
            <GameCard key={game.id} id={game.id} title={game.title} price={game.price}
              coverImage={game.coverImage} category={game.category.name} />
          ))}
        </div>
      </section>

      {/* Top Selling */}
      {topSelling.length > 0 && (
        <section>
          <SectionHeader icon={<Flame className="w-4 h-4" />} title="Top Selling" href="/games" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {topSelling.map((game) => (
              <GameCard key={game.id} id={game.id} title={game.title} price={game.price}
                coverImage={game.coverImage} category={game.category.name} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA Banner */}
      <section className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1117 50%, #0B0F19 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 60%)' }} />
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
              Start Your Collection
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-base max-w-md">
              Register an account to purchase games, track your library, and get personalized recommendations.
            </p>
          </div>
          <Link href="/register"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base transition-all btn-glow"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
