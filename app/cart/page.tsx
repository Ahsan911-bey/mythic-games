import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { removeFromCartAction, checkoutAction } from '@/app/actions/cart';
import { Trash2, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';

export default async function CartPage() {
  const userId = await getSessionId();
  if (!userId) redirect('/login');

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { game: true },
  });

  const total = cartItems.reduce((acc, item) => acc + item.game.price * item.quantity, 0);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-12 fade-up">
      <div className="flex items-center gap-3 mb-10">
        <ShoppingBag className="w-6 h-6" style={{ color: '#9D68FF' }} />
        <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>Your Cart</h1>
        {cartItems.length > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'var(--brand)' }}>
            {cartItems.length}
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-28 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ShoppingBag className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Looks like you haven&apos;t added any games yet.</p>
          <Link href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white btn-glow transition-all"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
            Browse Store <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl transition-all hover:border-white/10"
                style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative w-20 h-28 rounded-lg overflow-hidden shrink-0"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Image src={item.game.coverImage} alt={item.game.title} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <Link href={`/games/${item.gameId}`} className="font-bold text-white hover:text-[#9D68FF] transition-colors line-clamp-2">
                    {item.game.title}
                  </Link>
                  <p className="text-xs mt-1 mb-3" style={{ color: 'var(--text-muted)' }}>Base Game</p>
                  <p className="text-lg font-black" style={{ color: '#9D68FF' }}>${item.game.price.toFixed(2)}</p>
                </div>
                <form action={removeFromCartAction.bind(null, item.id)} className="shrink-0">
                  <button type="submit"
                    className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-400"
                    style={{ color: 'var(--text-muted)' }} title="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="rounded-2xl p-6 space-y-5 sticky top-24"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-base font-bold text-white">Order Summary</h3>

            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="truncate mr-4" style={{ color: 'var(--text-secondary)' }}>{item.game.title}</span>
                  <span className="shrink-0 text-white font-medium">${item.game.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Total</span>
                <span className="text-2xl font-black" style={{ color: '#9D68FF' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <form action={checkoutAction}>
              <button type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all btn-glow"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                <CreditCard className="w-4 h-4" />
                Complete Purchase
              </button>
            </form>

            <Link href="/games"
              className="flex items-center justify-center text-xs font-medium transition-colors hover:text-white"
              style={{ color: 'var(--text-muted)' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
