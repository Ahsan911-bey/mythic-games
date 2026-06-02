import { getSessionId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Gamepad2, ShoppingBag, Terminal, ChevronRight } from 'lucide-react';
import SqlTerminal from '@/components/admin/SqlTerminal';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/games', label: 'Manage Games', icon: Gamepad2 },
  { href: '/admin/orders', label: 'All Orders', icon: ShoppingBag },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSessionId();
  if (!userId) redirect('/login');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== 'ADMIN') redirect('/');

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex gap-7 fade-up">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            {/* Admin badge */}
            <div className="flex items-center gap-2.5 px-3 py-3 mb-4 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
                <span className="text-white text-xs font-black">{user?.name?.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#9D68FF' }}>Admin</p>
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
              Management
            </p>

            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}>
                <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:text-[#9D68FF]" />
                <span className="flex-grow">{label}</span>
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}

            <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
                Developer Tools
              </p>
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium"
                style={{ color: '#22C55E', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}>
                <Terminal className="w-4 h-4" />
                SQL Terminal
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-grow min-w-0">{children}</main>
      </div>

      <SqlTerminal />
    </>
  );
}
