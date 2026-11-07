import React, { useState } from 'react';
import { X, Play, Plus, Check, Heart, Star, Film, Users, ExternalLink, Calendar, Clock, Award, ShieldAlert, Sparkles, Popcorn } from 'lucide-react';
import { Movie } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  isInWatchlist: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleWatchlist: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onStartWatchParty: (movie: Movie) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  isOpen,
  isInWatchlist,
  isFavorite,
  onClose,
  onToggleWatchlist,
  onToggleFavorite,
  onPlayTrailer,
  onStartWatchParty
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isWatchedCelebration, setIsWatchedCelebration] = useState(false);

  if (!isOpen || !movie) return null;

  const handleStartWatching = (providerName: string) => {
    setSelectedProvider(providerName);
    setIsWatchedCelebration(true);
    setTimeout(() => setIsWatchedCelebration(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <div
        className="relative w-full max-w-3xl my-auto bg-[#161B26]/95 border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.85)] text-[#E1E2EB]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Backdrop Header with Close Button */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-[#161B26]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#161B26]/80 via-transparent to-transparent" />

          {/* Close Action */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 transition-all active:scale-95"
            aria-label="Fechar detalhes"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Play Trailer overlay icon */}
          <button
            onClick={() => onPlayTrailer(movie)}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/80 hover:bg-amber-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-transform hover:scale-110 active:scale-95 group"
            title="Assistir Trailer"
          >
            <Play className="w-7 h-7 fill-black ml-1 transition-transform group-hover:scale-110" />
          </button>

          {/* Content title over backdrop */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <BrazilianRatingBadge rating={movie.brazilianRating} size="md" />
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>IMDb {movie.imdbRating.toFixed(1)}</span>
              </div>
              {movie.rottenScore && (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 text-xs font-bold text-rose-400">
                  <span>🍅 {movie.rottenScore}%</span>
                </div>
              )}
              {movie.matchAffinity && (
                <div className="flex items-center gap-1 bg-violet-900/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-violet-400/30 text-xs font-bold text-violet-300">
                  <Sparkles className="w-3 h-3" />
                  <span>{movie.matchAffinity}% de Afinidade</span>
                </div>
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {movie.title}
            </h2>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-xs text-[#94A3B8]">
                Título original: <span className="italic">{movie.originalTitle}</span>
              </p>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Quick Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 bg-[#1D2026] rounded-2xl border border-white/[0.06] text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m ({movie.runtime} min)</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Direção: <strong className="text-white">{movie.director}</strong></span>
            </div>
          </div>

          {/* Classification Indicativa Detailed Card */}
          <div className="flex items-start gap-3 p-3.5 bg-black/30 border border-white/[0.08] rounded-xl text-xs">
            <BrazilianRatingBadge rating={movie.brazilianRating} size="lg" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Classificação Indicativa Oficial (Brasil)</span>
              </div>
              <p className="text-[#94A3B8] mt-0.5">
                {movie.brazilianRatingReason}
              </p>
            </div>
          </div>

          {/* Where to Watch Streaming Section */}
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Popcorn className="w-4 h-4 text-amber-400" />
              Onde Assistir Agora
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {movie.providers.map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => handleStartWatching(prov.name)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#1D2026] hover:bg-[#272A31] border border-white/[0.08] hover:border-amber-400/40 cursor-pointer transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center gap-2.5">
                    <StreamingBadge id={prov.id} name={prov.name} size="md" />
                    <div>
                      <span className="block text-xs font-semibold text-white">
                        {prov.type === 'subscription' ? 'Incluso na assinatura' : 'Aluguel disponível'}
                      </span>
                      <span className="text-[10px] text-amber-400/90 font-medium">
                        {prov.quality}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Assistir</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>

            {/* Notification alert if user launched a streaming link */}
            {isWatchedCelebration && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Abrindo sessão no <strong>{selectedProvider}</strong>! Prepare a pipoca e bom filme! 🍿
                </span>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider mb-2">
              Sinopse
            </h4>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Genres Chips */}
          <div>
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Gêneros
            </h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#1D2026] border border-white/[0.08] text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div>
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
              Elenco Principal
            </h4>
            <div className="flex flex-wrap gap-2">
              {movie.cast.map((actor) => (
                <span
                  key={actor}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-black/40 border border-white/[0.06] text-white"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-white/[0.08] bg-[#10131a] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                isInWatchlist
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] border-white/10 text-white'
              }`}
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-amber-400" />
                  <span>Na Minha Lista</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Salvar na Lista</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleFavorite(movie)}
              className={`p-2.5 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] border-white/10 text-white hover:text-rose-400'
              }`}
              title={isFavorite ? 'Remover dos Favoritos' : 'Favoritar'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartWatchParty(movie)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95"
            >
              <Users className="w-4 h-4" />
              <span>Assistir com Amigos</span>
            </button>

            <button
              onClick={() => handleStartWatching(movie.providers[0]?.name || 'Streaming')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0B0E14] font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bora Assistir!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
