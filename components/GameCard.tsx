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
    <Link href={`/games/${id}`} className="group game-card-hover block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-900 border border-white/5">
        <Image
          src={coverImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-3 space-y-1">
        {category && <p className="text-xs text-gray-400 uppercase tracking-wider">{category}</p>}
        <h3 className="font-semibold text-white group-hover:text-glow truncate">{title}</h3>
        <p className="text-sm font-medium text-gray-300">${price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
