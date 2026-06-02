import { prisma } from '@/lib/prisma';
import { getSessionId } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { removeFromCartAction, checkoutAction } from '@/app/actions/cart';
import { Trash2, CreditCard } from 'lucide-react';

export default async function CartPage() {
  const userId = await getSessionId();
  if (!userId) {
    redirect('/login');
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { game: true },
  });

  const total = cartItems.reduce((acc, item) => acc + item.game.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-8 text-glow">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
          <Link href="/games" className="text-[hsl(var(--primary))] hover:underline font-semibold">
            Browse Games
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-4 flex gap-4 items-center">
                <div className="relative w-24 h-32 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.game.coverImage} alt={item.game.title} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-white">{item.game.title}</h3>
                  <p className="text-[hsl(var(--primary))] font-semibold mt-1">${item.game.price.toFixed(2)}</p>
                </div>
                <form action={removeFromCartAction.bind(null, item.id)}>
                  <button type="submit" className="text-gray-500 hover:text-red-500 transition-colors p-2" title="Remove">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-6 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
            <div className="flex justify-between mb-4 text-gray-300">
              <span>Items ({cartItems.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-white pt-4 border-t border-white/10 mb-8">
              <span>Total</span>
              <span className="text-[hsl(var(--primary))]">${total.toFixed(2)}</span>
            </div>
            <form action={checkoutAction}>
              <button type="submit" className="w-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-white font-black py-4 rounded-lg transition-all hover-glow flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Checkout
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
