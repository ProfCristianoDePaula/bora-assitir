import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieRailProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  movies: Movie[];
  watchlistIds: Set<string>;
  favoriteIds: Set<string>;
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie, e: React.MouseEvent) => void;
  onToggleFavorite: (movie: Movie, e: React.MouseEvent) => void;
  onPlayTrailer: (movie: Movie, e: React.MouseEvent) => void;
  aspect?: 'poster' | 'landscape';
}

export const MovieRail: React.FC<MovieRailProps> = ({
  title,
  subtitle,
  icon,
  badge,
  movies,
  watchlistIds,
  favoriteIds,
  onSelectMovie,
  onToggleWatchlist,
  onToggleFavorite,
  onPlayTrailer,
  aspect = 'poster'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="mb-10 relative">
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-amber-400">{icon}</span>}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              {title}
            </h2>
            {badge && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#94A3B8] font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-full bg-[#161B26] hover:bg-[#212936] text-[#94A3B8] hover:text-white border border-white/10 transition-colors shadow-md active:scale-95"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-full bg-[#161B26] hover:bg-[#212936] text-[#94A3B8] hover:text-white border border-white/10 transition-colors shadow-md active:scale-95"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sweeping Carousel Rail */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className={`shrink-0 snap-start ${
              aspect === 'poster'
                ? 'w-[160px] sm:w-[190px] md:w-[210px] lg:w-[230px]'
                : 'w-[260px] sm:w-[320px] md:w-[360px]'
            }`}
          >
            <MovieCard
              movie={movie}
              aspect={aspect}
              isInWatchlist={watchlistIds.has(movie.id)}
              isFavorite={favoriteIds.has(movie.id)}
              onSelect={onSelectMovie}
              onToggleWatchlist={onToggleWatchlist}
              onToggleFavorite={onToggleFavorite}
              onPlayTrailer={onPlayTrailer}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
