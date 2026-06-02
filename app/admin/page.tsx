import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const [userCount, gameCount, orderCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.game.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
  ]);

  const stats = [
    { label: 'Total Users', value: userCount },
    { label: 'Total Games', value: gameCount },
    { label: 'Total Orders', value: orderCount },
    { label: 'Total Revenue', value: `$${(totalRevenue._sum.totalAmount || 0).toFixed(2)}` },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 text-glow">
        Dashboard Overview
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-6 hover:border-[hsl(var(--primary))] transition-colors">
            <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
