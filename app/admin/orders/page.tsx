import { prisma } from '@/lib/prisma';
import { ShoppingBag, User, Package } from 'lucide-react';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { include: { game: { select: { title: true, coverImage: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>All Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} · Total revenue:{' '}
            <span style={{ color: '#10B981' }}>${totalRevenue.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-4">
                  {/* Order ID */}
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs font-bold font-mono" style={{ color: 'var(--text-muted)' }}>
                      #{String(order.id).padStart(5, '0')}
                    </span>
                  </div>

                  {/* Separator */}
                  <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.08)' }} />

                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #60A5FA)' }}>
                      {order.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-none">{order.user.name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{order.user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Date */}
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Purchased</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</p>
                    <p className="text-lg font-black" style={{ color: '#10B981' }}>${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                  {order.orderItems.length} Item{order.orderItems.length !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2.5 px-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="text-sm font-medium text-white truncate mr-4">{item.game.title}</span>
                      <span className="shrink-0 text-sm font-bold" style={{ color: '#9D68FF' }}>
                        ${item.priceAtPurchase.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
