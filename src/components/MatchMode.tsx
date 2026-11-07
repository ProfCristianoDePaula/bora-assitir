import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, X, Star, Play, Sparkles, RefreshCw, Copy, Check, Users, Film, ArrowRight } from 'lucide-react';
import { Movie, StreamingProviderId } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface MatchModeProps {
  movies: Movie[];
  userSubscriptions: StreamingProviderId[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onStartWatchParty: (movie: Movie) => void;
}

export const MatchMode: React.FC<MatchModeProps> = ({
  movies,
  userSubscriptions,
  onSelectMovie,
  onPlayTrailer,
  onStartWatchParty
}) => {
  // Filter movies by available subscriptions if selected
  const availableMovies = movies.filter(m => 
    userSubscriptions.length === 0 || m.providers.some(p => userSubscriptions.includes(p.id))
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [partnerName, setPartnerName] = useState('Mariana');
  const [sessionCode, setSessionCode] = useState('BORA-9421');
  const [copiedCode, setCopiedCode] = useState(false);
  const [matches, setMatches] = useState<Movie[]>([]);
  const [lastMatch, setLastMatch] = useState<Movie | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const currentMovie = availableMovies[currentIndex];

  const triggerMatchCelebration = (matchedMovie: Movie) => {
    setLastMatch(matchedMovie);
    setMatches(prev => [matchedMovie, ...prev]);

    // Fire golden and violet confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#8B5CF6', '#ffffff']
    });
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentMovie) return;

    setSwipeDirection(direction);

    // Simulate partner interaction:
    // If user swipes right or up, 60% chance partner also wanted to watch!
    setTimeout(() => {
      if (direction === 'right' || direction === 'up') {
        const isPartnerMatch = Math.random() > 0.35 || currentMovie.matchAffinity! > 95;
        if (isPartnerMatch) {
          triggerMatchCelebration(currentMovie);
        }
      }

      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 280);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(sessionCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-[#161B26] p-4 sm:p-5 rounded-2xl border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-600/20 text-violet-400">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Modo Match • Decisão a Dois
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Dê like nos filmes que toparia ver. Quando <strong>{partnerName}</strong> também der like, dá Match!
          </p>
        </div>

        {/* Session Code & Partner pill */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex items-center gap-2 bg-[#10131A] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="text-[#94A3B8]">Código:</span>
            <span className="font-mono font-bold text-amber-400">{sessionCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Copiar código para convidar amigo"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-violet-950/60 border border-violet-500/30 px-3 py-1.5 rounded-xl text-xs text-violet-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Com {partnerName}</span>
          </div>
        </div>
      </div>

      {/* Main Deck Container */}
      <div className="relative min-h-[540px] flex flex-col items-center justify-center">
        {currentMovie ? (
          <div
            className={`relative w-full max-w-sm sm:max-w-md bg-[#161B26] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 ${
              swipeDirection === 'left' ? '-translate-x-32 -rotate-12 opacity-0' :
              swipeDirection === 'right' ? 'translate-x-32 rotate-12 opacity-0' :
              swipeDirection === 'up' ? '-translate-y-32 scale-90 opacity-0' : 'translate-x-0 rotate-0 opacity-100'
            }`}
          >
            {/* Poster Media */}
            <div className="relative h-64 sm:h-72 w-full bg-black overflow-hidden">
              <img
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                className="w-full h-full object-cover filter brightness-[0.9]"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#161B26] via-[#161B26]/30 to-transparent" />
              <div className="absolute inset-x-0 top-0 p-3.5 flex items-center justify-between z-10">
                <BrazilianRatingBadge rating={currentMovie.brazilianRating} size="md" />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{currentMovie.imdbRating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayTrailer(currentMovie);
                    }}
                    className="p-1.5 rounded-full bg-black/70 hover:bg-amber-500 hover:text-black text-white border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-[11px] font-semibold px-2.5"
                    title="Assistir Trailer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Trailer</span>
                  </button>
                </div>
              </div>

              {/* Bottom Title on Card */}
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-2xl font-black text-white leading-tight drop-shadow-md">
                  {currentMovie.title}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#94A3B8]">
                  <span>{currentMovie.year}</span>
                  <span>•</span>
                  <span>{currentMovie.runtime} min</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{currentMovie.genres.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Synopsis & Providers */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed">
                {currentMovie.synopsis}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-[#94A3B8] font-medium">Onde ver:</span>
                {currentMovie.providers.map(p => (
                  <StreamingBadge key={p.id} id={p.id} name={p.name} size="sm" />
                ))}
              </div>
            </div>

            {/* Action Buttons: Pass, Super Bora, Bora */}
            <div className="p-4 pt-1 border-t border-white/[0.08] flex items-center justify-around gap-4 bg-[#10131A]/60">
              {/* Pass Button */}
              <button
                onClick={() => handleSwipe('left')}
                className="p-4 rounded-full bg-[#1F2430] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 transition-all shadow-md active:scale-90"
                title="Passar (Não quero)"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Super Like Button */}
              <button
                onClick={() => handleSwipe('up')}
                className="p-3.5 rounded-full bg-[#1F2430] hover:bg-amber-950/60 text-slate-400 hover:text-amber-400 border border-white/10 hover:border-amber-500/40 transition-all shadow-md active:scale-90"
                title="Super Like! (Quero muito ver hoje)"
              >
                <Star className="w-5 h-5 fill-current" />
              </button>

              {/* Like / Bora Button */}
              <button
                onClick={() => handleSwipe('right')}
                className="p-4 rounded-full bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] text-[#0B0E14] font-black hover:scale-105 transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-90"
                title="Bora! (Topo assistir)"
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          /* Deck Completed View */
          <div className="text-center p-8 bg-[#161B26] rounded-3xl border border-white/10 max-w-md w-full space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Você viu todos os filmes do catálogo!
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Você encontrou {matches.length} {matches.length === 1 ? 'match' : 'matches'} com {partnerName}.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleResetDeck}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recomeçar Cartas</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Matches Gallery Rail if matches found */}
      {matches.length > 0 && (
        <div className="mt-8 p-5 bg-[#161B26] rounded-2xl border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                Seus Matches com {partnerName} ({matches.length})
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              Ambos deram Bora! 🍿
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {matches.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectMovie(m)}
                className="group relative bg-[#10131A] rounded-xl overflow-hidden border border-white/10 hover:border-amber-400/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-2.5">
                  <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                  <p className="text-[10px] text-amber-400 font-semibold mt-0.5">{m.providers[0]?.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DEU MATCH Celebration Pop-up Overlay */}
      {lastMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#1F172E] to-[#121620] border-2 border-violet-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(139,92,246,0.5)]">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/30 border border-violet-400/40 text-violet-300 font-black text-xs uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Vocês dois toparam!
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
              DEU MATCH! 🎉
            </h2>
            <p className="text-xs text-slate-300 mb-6">
              Você e <strong>{partnerName}</strong> querem assistir ao mesmo filme hoje!
            </p>

            {/* Poster & details */}
            <div className="relative w-40 aspect-[2/3] mx-auto rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl mb-5">
              <img src={lastMatch.posterUrl} alt={lastMatch.title} className="w-full h-full object-cover" />
            </div>

            <h3 className="text-xl font-bold text-white">{lastMatch.title}</h3>
            <p className="text-xs text-amber-400 font-medium mt-1">
              {lastMatch.year} • {lastMatch.runtime} min • {lastMatch.providers[0]?.name}
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  const m = lastMatch;
                  setLastMatch(null);
                  onSelectMovie(m);
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0B0E14] font-black text-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all"
              >
                Bora Assistir Agora! 🍿
              </button>

              <button
                onClick={() => {
                  const m = lastMatch;
                  setLastMatch(null);
                  onStartWatchParty(m);
                }}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Abrir Sala de Sessão Pipoca</span>
              </button>

              <button
                onClick={() => setLastMatch(null)}
                className="text-xs text-[#94A3B8] hover:text-white py-2"
              >
                Continuar dando likes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
