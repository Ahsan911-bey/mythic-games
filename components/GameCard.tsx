import Image from 'next/image';
import Link from 'next/link';

interface GameCardProps {
  id: number;
  title: string;
  price: number;
  coverImage: string;
  category?: string;
}

export default function GameCard({ id, title, price, coverImage, category }: GameCardProps) {
  return (
    <Link href={`/games/${id}`} className="group block">
      {/* Cover image container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-xl card-glow"
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
        }}
      >
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Bottom gradient always visible */}
        <div className="absolute inset-0 gradient-bottom opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Price badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold text-white"
          style={{ background: 'rgba(11,15,25,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ${price.toFixed(2)}
        </div>

        {/* Category tag */}
        {category && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: 'rgba(124,58,237,0.8)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,0.9)' }}
          >
            {category}
          </div>
        )}

        {/* Hover overlay with title */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-bold text-sm leading-tight truncate drop-shadow-lg">{title}</p>
        </div>

        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.5)' }}
        />
      </div>

      {/* Card info below image */}
      <div className="mt-3 px-0.5 space-y-0.5">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#9D68FF] transition-colors duration-200" style={{ lineHeight: '1.3' }}>
          {title}
        </h3>
        <p className="text-sm font-bold" style={{ color: 'var(--brand-light)' }}>
          ${price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
