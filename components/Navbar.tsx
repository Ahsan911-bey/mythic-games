import Link from 'next/link';
import { getSessionId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Gamepad2, ShoppingCart, User, LogOut, LayoutDashboard, Library } from 'lucide-react';
import { logoutAction } from '@/app/actions/auth';

export default async function Navbar() {
  const userId = await getSessionId();
  let user = null;
  let cartCount = 0;

  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, role: true },
    });
    const items = await prisma.cartItem.findMany({ where: { userId } });
    cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  }

  return (
    <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Gamepad2 className="w-8 h-8 text-[hsl(var(--primary))] group-hover:scale-110 transition-transform text-glow" />
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-glow transition-all">MYTHIC</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/games" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Store</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-gray-300 hover:text-[hsl(var(--primary))] transition-colors flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link href="/library" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                <Library className="w-4 h-4" /> Library
              </Link>
              <Link href="/cart" className="relative text-gray-300 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[hsl(var(--secondary))] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
                <span className="text-sm font-medium text-gray-400">Hi, {user.name}</span>
                <form action={logoutAction}>
                  <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Sign In</Link>
              <Link href="/register" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 text-black font-bold py-2 px-4 rounded-md transition-colors text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
