import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function LibraryPage() {
  const userId = await getSessionId();
  if (!userId) {
    redirect('/login');
  }

  const libraryItems = await prisma.userLibrary.findMany({
    where: { userId },
    include: { game: true },
    orderBy: { purchasedAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 text-glow">
        My Library
      </h1>

      {libraryItems.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-500 mb-4">No games in your library</h2>
          <Link href="/games" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 text-black font-bold py-3 px-8 rounded-lg transition-all hover-glow">
            Go to Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {libraryItems.map((item) => (
            <Link key={item.id} href={`/games/${item.gameId}`} className="group block">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-900 border border-white/10 group-hover:border-[hsl(var(--primary))] transition-colors">
                <Image
                  src={item.game.coverImage}
                  alt={item.game.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <span className="font-bold text-white text-lg tracking-wider">PLAY</span>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-white truncate text-sm">{item.game.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
