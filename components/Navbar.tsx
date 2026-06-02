import Link from 'next/link';
import { getSessionId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Gamepad2, ShoppingCart, Library, LayoutDashboard, LogOut, User, Store } from 'lucide-react';
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
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(11,15,25,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #60A5FA)' }}>
            <Gamepad2 className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-black text-lg tracking-tight text-white group-hover:text-gradient transition-all" style={{ letterSpacing: '-0.03em' }}>
            MYTHIC
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/games" icon={<Store className="w-3.5 h-3.5" />} label="Store" />
          {user && <NavLink href="/library" icon={<Library className="w-3.5 h-3.5" />} label="Library" />}
          {user?.role === 'ADMIN' && <NavLink href="/admin" icon={<LayoutDashboard className="w-3.5 h-3.5" />} label="Admin" accent />}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Admin badge - always visible */}
              {user.role === 'ADMIN' && (
                <Link href="/admin"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{ background: 'rgba(124,58,237,0.12)', color: '#9D68FF', border: '1px solid rgba(124,58,237,0.25)' }}>
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:bg-white/8"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 text-[10px] font-bold flex items-center justify-center rounded-full text-white"
                    style={{ background: 'var(--brand)' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="flex items-center gap-2 pl-3 border-l" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #60A5FA)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <form action={logoutAction}>
                  <button type="submit" className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:bg-red-500/10 hover:text-red-400"
                    style={{ color: 'var(--text-muted)' }} title="Sign out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                Sign In
              </Link>
              <Link href="/register"
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all btn-glow"
                style={{ background: 'var(--brand)' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, accent }: { href: string; icon: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <Link href={href}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/6"
      style={{ color: accent ? '#9D68FF' : 'var(--text-secondary)' }}>
      {icon}
      {label}
    </Link>
  );
}
