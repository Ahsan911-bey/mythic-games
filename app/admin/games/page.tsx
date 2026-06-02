import { prisma } from '@/lib/prisma';
import { createGameAction, deleteGameAction } from '@/app/actions/games';
import Image from 'next/image';

export default async function AdminGamesPage() {
  const [games, categories] = await Promise.all([
    prisma.game.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany(),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 text-glow">
        Manage Games
      </h1>

      <div className="bg-[hsl(var(--card))] border border-white/10 rounded-xl p-6 mb-12">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Add New Game</h2>
        <form action={createGameAction} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
              <input type="text" name="title" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Price ($)</label>
              <input type="number" step="0.01" name="price" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select name="categoryId" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
              <input type="url" name="coverImage" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Release Date</label>
              <input type="date" name="releaseDate" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea name="description" rows={4} required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"></textarea>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 text-black font-bold py-3 px-8 rounded-lg transition-all hover-glow">
              Add Game
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[hsl(var(--card))] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 border-b border-white/10">
              <th className="p-4 text-gray-400 font-medium">Game</th>
              <th className="p-4 text-gray-400 font-medium">Price</th>
              <th className="p-4 text-gray-400 font-medium">Category</th>
              <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 flex items-center gap-4">
                  <div className="relative w-12 h-16 rounded overflow-hidden">
                    <Image src={game.coverImage} alt={game.title} fill className="object-cover" />
                  </div>
                  <span className="font-bold text-white">{game.title}</span>
                </td>
                <td className="p-4 text-gray-300">${game.price.toFixed(2)}</td>
                <td className="p-4 text-gray-300">{game.category.name}</td>
                <td className="p-4 text-right">
                  <form action={deleteGameAction.bind(null, game.id)}>
                    <button type="submit" className="text-red-500 hover:text-red-400 text-sm font-bold bg-red-500/10 hover:bg-red-500/20 px-3 py-1 rounded transition-colors">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {games.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No games available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
