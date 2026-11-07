import React from 'react';
import { X, ExternalLink, Play, Film } from 'lucide-react';
import { Movie } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl transition-all duration-300">
      <div 
        className="relative w-full max-w-4xl bg-[#161B26] border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#10131a]">
          <div className="flex items-center gap-2.5">
            <Film className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                Trailer Oficial • {movie.title}
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {movie.year} • {movie.director}
              </p>
            </div>
            <BrazilianRatingBadge rating={movie.brazilianRating} size="sm" className="ml-2" />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 transition-colors"
            aria-label="Fechar trailer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`Trailer de ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#10131a] flex flex-wrap items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <span className="italic">
            "{movie.tagline || movie.synopsis.slice(0, 80) + '...'}"
          </span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Disponível em:</span>
            {movie.providers.map(p => (
              <span key={p.id} className="text-amber-400 font-semibold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
