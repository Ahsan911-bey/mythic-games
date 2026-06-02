import { prisma } from '@/lib/prisma';
import { Users, Gamepad2, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const [userCount, gameCount, orderCount, revenue, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.game.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, orderItems: true },
    }),
  ]);

  const stats = [
    { label: 'Total Users', value: userCount, icon: Users, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
    { label: 'Total Games', value: gameCount, icon: Gamepad2, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
    { label: 'Total Orders', value: orderCount, icon: ShoppingBag, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
    { label: 'Total Revenue', value: `$${(revenue._sum.totalAmount || 0).toFixed(2)}`, icon: DollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Welcome back, here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl p-5 transition-all hover:border-white/10"
            style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 opacity-40" style={{ color: stat.color }} />
            </div>
            <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-sm font-bold text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-semibold transition-colors hover:text-white"
            style={{ color: '#9D68FF' }}>
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center" style={{ color: 'var(--text-muted)' }}>
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">{order.user.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-bold" style={{ color: '#10B981' }}>
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/games"
          className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:border-[#7C3AED]/40 group"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <Gamepad2 className="w-5 h-5" style={{ color: '#9D68FF' }} />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-white">Manage Games</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Add, edit, and feature games</p>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#9D68FF' }} />
        </Link>
        <Link href="/admin/orders"
          className="flex items-center gap-4 p-5 rounded-2xl transition-all hover:border-[#F59E0B]/40 group"
          style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <ShoppingBag className="w-5 h-5" style={{ color: '#F59E0B' }} />
          </div>
          <div className="flex-grow">
            <p className="text-sm font-bold text-white">View Orders</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Track and review all purchases</p>
          </div>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#F59E0B' }} />
        </Link>
      </div>
    </div>
  );
}
