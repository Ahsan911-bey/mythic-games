import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[60vh] min-h-[400px] bg-black overflow-hidden group rounded-2xl border border-white/10">
      <Image
        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
        alt="Hero Banner"
        fill
        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter text-glow">
          Discover Your Next Adventure
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
          Explore a vast universe of games. From epic RPGs to competitive shooters, Mythic Games has it all.
        </p>
        <div className="flex gap-4">
          <Link href="/games" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/80 text-black font-bold py-3 px-8 rounded-lg transition-all hover-glow">
            Browse Store
          </Link>
          <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg backdrop-blur-sm transition-colors border border-white/20">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
