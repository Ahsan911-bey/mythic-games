import { prisma } from '@/lib/prisma';
import { createGameAction, deleteGameAction, toggleFeaturedAction } from '@/app/actions/games';
import Image from 'next/image';
import { Plus, Star, Trash2, Gamepad2 } from 'lucide-react';

export default async function AdminGamesPage() {
  const [games, categories] = await Promise.all([
    prisma.game.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }),
    prisma.category.findMany(),
  ]);

  const featuredCount = games.filter((g) => g.isFeatured).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Manage Games</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {games.length} games · <span style={{ color: '#9D68FF' }}>{featuredCount} featured</span>
          </p>
        </div>
      </div>

      {/* Add game form */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <Plus className="w-4 h-4" style={{ color: '#9D68FF' }} />
          </div>
          <h2 className="text-sm font-bold text-white">Add New Game</h2>
        </div>

        <form action={createGameAction} className="p-6 grid md:grid-cols-2 gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Title</label>
            <input type="text" name="title" required placeholder="Game title"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-[var(--text-muted)]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Price (USD)</label>
            <input type="number" step="0.01" name="price" required placeholder="59.99"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-[var(--text-muted)]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
            <select name="categoryId" required
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Release date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Release Date</label>
            <input type="date" name="releaseDate" required
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }} />
          </div>

          {/* Cover image URL — full width */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Cover Image URL</label>
            <input type="url" name="coverImage" required placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-[var(--text-muted)]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          {/* Description — full width */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea name="description" rows={4} required placeholder="Game description..."
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none placeholder-[var(--text-muted)] resize-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all btn-glow"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              <Plus className="w-4 h-4" /> Add Game
            </button>
          </div>
        </form>
      </div>

      {/* Games table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Gamepad2 className="w-4 h-4" style={{ color: '#9D68FF' }} />
          <h2 className="text-sm font-bold text-white">All Games</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)' }}>
                {['Game', 'Category', 'Price', 'Featured', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-5 py-3 text-left text-xs font-bold uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="group transition-colors hover:bg-white/2"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {/* Game info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Image src={game.coverImage} alt={game.title} fill sizes="40px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white leading-tight max-w-[200px] truncate">{game.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>ID #{game.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(124,58,237,0.1)', color: '#9D68FF', border: '1px solid rgba(124,58,237,0.2)' }}>
                      {game.category.name}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 text-sm font-bold text-white">${game.price.toFixed(2)}</td>

                  {/* Featured toggle */}
                  <td className="px-5 py-4">
                    <form action={toggleFeaturedAction.bind(null, game.id, !game.isFeatured)}>
                      <button type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={game.isFeatured
                          ? { background: 'rgba(124,58,237,0.15)', color: '#9D68FF', border: '1px solid rgba(124,58,237,0.3)' }
                          : { background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.06)' }
                        }>
                        <Star className={`w-3 h-3 ${game.isFeatured ? 'fill-current' : ''}`} />
                        {game.isFeatured ? 'Featured' : 'Feature'}
                      </button>
                    </form>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <form action={deleteGameAction.bind(null, game.id)}>
                      <button type="submit"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto"
                        style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {games.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No games yet. Add your first game above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
