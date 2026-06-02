import { getSessionId } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getSessionId();
  if (!userId) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role !== 'ADMIN') redirect('/');

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-4 sticky top-24">
          <h2 className="font-black text-xl text-white uppercase tracking-wider mb-6 px-4">Admin Panel</h2>
          <nav className="space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/games" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              Manage Games
            </Link>
            <Link href="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
              All Orders
            </Link>
          </nav>
        </div>
      </aside>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}
