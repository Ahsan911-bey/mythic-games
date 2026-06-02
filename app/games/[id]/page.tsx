import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { addToCartAction } from '@/app/actions/cart';
import { ShoppingCart, Calendar, Tag, CheckCircle } from 'lucide-react';
import { getSessionId } from '@/lib/auth';
import Link from 'next/link';

export default async function GameDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await prisma.game.findUnique({
    where: { id: parseInt(id, 10) },
    include: { category: true },
  });

  if (!game) notFound();

  const userId = await getSessionId();
  let inLibrary = false;
  let inCart = false;
  if (userId) {
    const [lib, cart] = await Promise.all([
      prisma.userLibrary.findUnique({ where: { userId_gameId: { userId, gameId: game.id } } }),
      prisma.cartItem.findUnique({ where: { userId_gameId: { userId, gameId: game.id } } }),
    ]);
    inLibrary = !!lib;
    inCart = !!cart;
  }

  return (
    <div className="fade-up">
      {/* Full-width hero image */}
      <div className="relative w-full" style={{ height: 'clamp(300px, 45vh, 520px)' }}>
        <Image src={game.coverImage} alt={game.title} fill sizes="100vw"
          className="object-cover object-center" priority />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, var(--bg) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(11,15,25,0.5) 0%, transparent 60%)' }} />
      </div>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-6 -mt-24 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left: Cover + Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cover thumbnail */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden"
              style={{ border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
              <Image src={game.coverImage} alt={game.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
            </div>

            {/* Description */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-bold text-white mb-4">About this game</h2>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {game.description}
              </p>
            </div>
          </div>

          {/* Right: Info panel */}
          <div className="space-y-4 lg:sticky lg:top-24">
            {/* Title card */}
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Category tag */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(124,58,237,0.15)', color: '#9D68FF', border: '1px solid rgba(124,58,237,0.25)' }}>
                <Tag className="w-3 h-3" />
                {game.category.name}
              </span>

              <h1 className="text-2xl font-black text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                {game.title}
              </h1>

              {/* Price */}
              <div className="py-4 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Base Price</p>
                <p className="text-3xl font-black text-white">${game.price.toFixed(2)}</p>
              </div>

              {/* CTA */}
              {inLibrary ? (
                <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <CheckCircle className="w-4 h-4" />
                  In Your Library
                </div>
              ) : inCart ? (
                <Link href="/cart" className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all"
                  style={{ background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <ShoppingCart className="w-4 h-4" />
                  View in Cart
                </Link>
              ) : !userId ? (
                <Link href="/login" className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all btn-glow"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                  Sign In to Purchase
                </Link>
              ) : (
                <form action={addToCartAction.bind(null, game.id)}>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all btn-glow"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </form>
              )}
            </div>

            {/* Meta info card */}
            <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Game Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    Release Date
                  </div>
                  <span className="font-medium text-white">
                    {new Date(game.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                    <Tag className="w-3.5 h-3.5" />
                    Genre
                  </div>
                  <span className="font-medium text-white">{game.category.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
