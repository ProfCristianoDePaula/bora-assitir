import React from 'react';
import { Play, Plus, Check, Heart, Star, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  isFavorite?: boolean;
  onSelect: (movie: Movie) => void;
  onToggleWatchlist?: (movie: Movie, e: React.MouseEvent) => void;
  onToggleFavorite?: (movie: Movie, e: React.MouseEvent) => void;
  onPlayTrailer?: (movie: Movie, e: React.MouseEvent) => void;
  aspect?: 'poster' | 'landscape';
  priority?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isInWatchlist = false,
  isFavorite = false,
  onSelect,
  onToggleWatchlist,
  onToggleFavorite,
  onPlayTrailer,
  aspect = 'poster'
}) => {
  const isPoster = aspect === 'poster';

  return (
    <div
      onClick={() => onSelect(movie)}
      className="group relative flex flex-col bg-[#161B26] border border-white/[0.08] rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-300 hover:border-[#F59E0B]/40 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.8),0_0_20px_-2px_rgba(245,158,11,0.18)] hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* Media Image with 2:3 or 16:9 aspect ratio */}
      <div className={`relative w-full ${isPoster ? 'aspect-[2/3]' : 'aspect-video'} overflow-hidden bg-[#0B0E14]`}>
        <img
          src={isPoster ? movie.posterUrl : movie.backdropUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Ambient Top Shadow & Top Badges */}
        <div className="absolute inset-x-0 top-0 p-2.5 flex items-center justify-between bg-gradient-to-b from-[#0B0E14]/80 via-[#0B0E14]/30 to-transparent pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <BrazilianRatingBadge rating={movie.brazilianRating} reason={movie.brazilianRatingReason} />
            {movie.country === 'Brasil' && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                BR
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-[#0B0E14]/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-xs font-semibold text-amber-400">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{movie.imdbRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Match Affinity Badge if high */}
        {movie.matchAffinity && movie.matchAffinity >= 95 && (
          <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-violet-950/90 border border-violet-500/40 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-violet-300 shadow-sm group-hover:opacity-0 transition-opacity">
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>{movie.matchAffinity}% Match</span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <div className="flex items-center justify-between gap-1.5 mb-2">
            {/* Play Trailer Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayTrailer?.(movie, e);
              }}
              title="Ver Trailer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Trailer</span>
            </button>

            {/* Watchlist Quick Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist?.(movie, e);
              }}
              title={isInWatchlist ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
              className={`p-2 rounded-xl border transition-all ${
                isInWatchlist
                  ? 'bg-amber-500 border-amber-400 text-[#0B0E14]'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
              }`}
            >
              {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Favorite Quick Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite?.(movie, e);
              }}
              title={isFavorite ? 'Remover dos Favoritos' : 'Favoritar'}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-rose-500 border-rose-400 text-white'
                  : 'bg-white/10 hover:bg-white/20 border-white/15 text-white hover:text-rose-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <p className="text-[11px] text-[#94A3B8] line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>
      </div>

      {/* Card Metadata Details */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          <h3 className="font-bold text-[#F8FAFC] text-sm leading-snug line-clamp-1 group-hover:text-[#FBBF24] transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#94A3B8]">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            <span>•</span>
            <span className="truncate max-w-[90px]">{movie.genres[0]}</span>
          </div>
        </div>

        {/* Streaming Providers mini rail */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/[0.06]">
          {movie.providers.slice(0, 2).map((prov) => (
            <StreamingBadge
              key={prov.id}
              id={prov.id}
              name={prov.name}
              size="sm"
            />
          ))}
          {movie.providers.length > 2 && (
            <span className="text-[10px] text-[#94A3B8] font-medium self-center pl-0.5">
              +{movie.providers.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
