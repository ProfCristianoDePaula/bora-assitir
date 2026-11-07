import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Sparkles, Users, Info, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Movie } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface HeroBannerProps {
  featuredMovies: Movie[];
  isInWatchlist: (movieId: string) => boolean;
  onSelectMovie: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onStartWatchParty: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredMovies,
  isInWatchlist,
  onSelectMovie,
  onToggleWatchlist,
  onPlayTrailer,
  onStartWatchParty
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const activeMovie = featuredMovies[currentIndex] || featuredMovies[0];

  // Auto rotate featured hero every 10 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (!activeMovie) return null;

  const inWatchlist = isInWatchlist(activeMovie.id);

  return (
    <div className="relative w-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-end pb-12 sm:pb-16 overflow-hidden">
      {/* Background Backdrop Artwork with Multi-layer Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          key={activeMovie.id}
          src={activeMovie.backdropUrl}
          alt={activeMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.72] transform scale-105 transition-all duration-1000 ease-out"
        />
        {/* Soft theatrical atmospheric glow overlay */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[140px] pointer-events-none" />

        {/* Master Cinema Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/70 to-[#0B0E14]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 sm:via-[#0B0E14]/50 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl lg:max-w-3xl space-y-4">
          {/* Metadata Row: Rating, Affinity, Year, Genre */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Destaque do Dia
            </span>

            <BrazilianRatingBadge
              rating={activeMovie.brazilianRating}
              reason={activeMovie.brazilianRatingReason}
              showTooltip
              size="md"
            />

            <div className="flex items-center gap-1 text-amber-400 font-bold bg-[#161B26]/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{activeMovie.imdbRating.toFixed(1)}</span>
            </div>

            <span className="text-[#94A3B8] font-medium">{activeMovie.year}</span>
            <span className="text-white/30">•</span>
            <span className="text-[#94A3B8] font-medium">
              {Math.floor(activeMovie.runtime / 60)}h {activeMovie.runtime % 60}m
            </span>

            {activeMovie.matchAffinity && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-violet-300 font-bold text-xs bg-violet-950/80 border border-violet-500/40 px-2 py-0.5 rounded-md">
                  {activeMovie.matchAffinity}% de Match
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] drop-shadow-md leading-none sm:leading-tight">
              {activeMovie.title}
            </h1>
            {activeMovie.tagline && (
              <p className="mt-2 text-sm sm:text-base font-semibold text-amber-400/90 italic tracking-wide">
                "{activeMovie.tagline}"
              </p>
            )}
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-[#94A3B8] line-clamp-3 leading-relaxed max-w-2xl font-normal">
            {activeMovie.synopsis}
          </p>

          {/* Streaming Availability Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-[#94A3B8] font-medium mr-1">
              Disponível em:
            </span>
            {activeMovie.providers.map((prov) => (
              <StreamingBadge
                key={prov.id}
                id={prov.id}
                name={prov.name}
                quality={prov.quality}
                size="md"
              />
            ))}
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* Primary "Bora Assistir" Button */}
            <button
              onClick={() => onSelectMovie(activeMovie)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0B0E14] font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all duration-200 active:scale-[0.97]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Bora Assistir</span>
            </button>

            {/* Trailer Secondary Button */}
            <button
              onClick={() => onPlayTrailer(activeMovie)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-[#F8FAFC] font-semibold text-sm transition-all duration-200 active:scale-[0.97]"
            >
              <Play className="w-4 h-4 text-white" />
              <span>Ver Trailer</span>
            </button>

            {/* Watchlist Toggle Button */}
            <button
              onClick={() => onToggleWatchlist(activeMovie)}
              className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border font-semibold text-sm transition-all duration-200 active:scale-[0.97] ${
                inWatchlist
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] border-white/[0.12] text-[#F8FAFC]'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Na Minha Lista</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Minha Lista</span>
                </>
              )}
            </button>

            {/* Watch Party Social Highlight Button */}
            <button
              onClick={() => onStartWatchParty(activeMovie)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-semibold text-sm shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-200 active:scale-[0.97]"
            >
              <Users className="w-4 h-4" />
              <span>Sessão em Grupo</span>
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-2 pt-6 sm:pt-8">
          {featuredMovies.map((movie, idx) => (
            <button
              key={movie.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-8 bg-[#F59E0B]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ver destaque ${idx + 1}: ${movie.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
