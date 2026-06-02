import { prisma } from '@/lib/prisma';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { include: { game: { select: { title: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 text-glow">
        All Orders
      </h1>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-12 bg-[hsl(var(--card))] border border-white/10 rounded-xl">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-6">
              <div className="flex flex-wrap justify-between items-start mb-6 pb-6 border-b border-white/10 gap-4">
                <div>
                  <h3 className="font-bold text-white text-lg">Order #{order.id}</h3>
                  <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="font-medium text-white">{order.user.name}</p>
                  <p className="text-xs text-gray-500">{order.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-xl font-bold text-[hsl(var(--primary))]">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Items</h4>
                <ul className="space-y-2">
                  {order.orderItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                      <span className="text-white font-medium">{item.game.title}</span>
                      <span className="text-gray-400">${item.priceAtPurchase.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
