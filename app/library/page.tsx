import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Library, ArrowRight, Play } from 'lucide-react';

export default async function LibraryPage() {
  const userId = await getSessionId();
  if (!userId) redirect('/login');

  const libraryItems = await prisma.userLibrary.findMany({
    where: { userId },
    include: { game: { include: { category: true } } },
    orderBy: { purchasedAt: 'desc' },
  });

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 fade-up">
      <div className="flex items-center gap-3 mb-10">
        <Library className="w-6 h-6" style={{ color: '#9D68FF' }} />
        <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>My Library</h1>
        {libraryItems.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'var(--brand)' }}>
            {libraryItems.length}
          </span>
        )}
      </div>

      {libraryItems.length === 0 ? (
        <div className="text-center py-28 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Library className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold text-white mb-2">Your library is empty</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Purchase games to add them to your personal library.</p>
          <Link href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white btn-glow transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            Go to Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {libraryItems.map((item) => (
            <Link key={item.id} href={`/games/${item.gameId}`} className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl"
                style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'var(--surface)' }}>
                <Image
                  src={item.game.coverImage}
                  alt={item.game.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ background: 'rgba(11,15,25,0.7)', backdropFilter: 'blur(4px)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--brand)' }}>
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(124,58,237,0.85)', color: 'white' }}>
                  {item.game.category.name}
                </div>
              </div>
              <div className="mt-3 space-y-0.5">
                <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#9D68FF] transition-colors">
                  {item.game.title}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Added {new Date(item.purchasedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
