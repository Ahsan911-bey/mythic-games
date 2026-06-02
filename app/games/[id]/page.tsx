import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { addToCartAction } from '@/app/actions/cart';
import { ShoppingCart } from 'lucide-react';
import { getSessionId } from '@/lib/auth';

export default async function GameDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await prisma.game.findUnique({
    where: { id: parseInt(id, 10) },
    include: { category: true },
  });

  if (!game) {
    notFound();
  }

  const userId = await getSessionId();
  let inLibrary = false;
  if (userId) {
    const libraryEntry = await prisma.userLibrary.findUnique({
      where: { userId_gameId: { userId, gameId: game.id } },
    });
    inLibrary = !!libraryEntry;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-12">
        {/* Left Col: Image */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src={game.coverImage}
              alt={game.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {game.description}
            </p>
          </div>
        </div>

        {/* Right Col: Info & Action */}
        <div className="space-y-6">
          <div className="bg-[hsl(var(--card))] p-6 rounded-xl border border-white/10">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 text-glow">
              {game.title}
            </h1>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-[hsl(var(--primary))]/20 text-[hsl(var(--primary))] px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-[hsl(var(--primary))]/30">
                {game.category.name}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-gray-400 text-sm">Price</span>
              <p className="text-3xl font-bold text-white">${game.price.toFixed(2)}</p>
            </div>

            {inLibrary ? (
              <div className="bg-white/10 border border-white/20 text-white text-center py-4 rounded-lg font-bold">
                In Library
              </div>
            ) : (
              <form action={addToCartAction.bind(null, game.id)}>
                <button
                  type="submit"
                  className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 text-black font-black py-4 rounded-lg transition-all hover-glow flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
              </form>
            )}

            <div className="mt-8 space-y-3 pt-6 border-t border-white/10 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Release Date</span>
                <span className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
