import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl noise" style={{ height: 'clamp(400px, 55vh, 680px)' }}>
      {/* Background image */}
      <Image
        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
        alt="Featured Game"
        fill
        sizes="100vw"
        className="object-cover object-center scale-105"
        priority
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 gradient-left" />
      <div className="absolute inset-0 gradient-bottom" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,15,25,0.6) 0%, transparent 60%)' }} />

      {/* Purple accent glow */}
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 max-w-2xl">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: 'rgba(124,58,237,0.9)', border: '1px solid rgba(157,104,255,0.3)' }}>
            <Star className="w-3 h-3 fill-current" />
            Featured Game
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-3 leading-none" style={{ letterSpacing: '-0.03em' }}>
          Discover Your<br />
          <span className="text-gradient">Next Adventure</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg mb-8 max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Explore a universe of games — from epic RPGs to intense shooters. Find your next obsession.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all btn-glow"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}
          >
            Browse Store
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </div>
  );
}
