import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Dices, Play, Sparkles, Clock, Shield, Sliders, RefreshCw, Check } from 'lucide-react';
import { Movie, MovieMood, StreamingProviderId, BrazilianRating } from '../types/movie';
import { MOOD_DEFINITIONS } from '../data/movies';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface RouletteModeProps {
  movies: Movie[];
  userSubscriptions: StreamingProviderId[];
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onStartWatchParty: (movie: Movie) => void;
}

export const RouletteMode: React.FC<RouletteModeProps> = ({
  movies,
  userSubscriptions,
  onSelectMovie,
  onPlayTrailer,
  onStartWatchParty
}) => {
  const [selectedMood, setSelectedMood] = useState<MovieMood | 'qualquer'>('qualquer');
  const [maxRuntime, setMaxRuntime] = useState<number>(0); // 0 = sem limite
  const [ratingFilter, setRatingFilter] = useState<'todos' | 'familia' | 'adulto'>('todos');
  const [onlySubscribed, setOnlySubscribed] = useState<boolean>(true);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winnerMovie, setWinnerMovie] = useState<Movie | null>(null);
  const [displayedCandidate, setDisplayedCandidate] = useState<Movie | null>(null);

  // Filter pool
  const candidatePool = movies.filter(m => {
    if (selectedMood !== 'qualquer' && !m.moods.includes(selectedMood)) return false;
    if (maxRuntime > 0 && m.runtime > maxRuntime) return false;
    if (ratingFilter === 'familia' && (m.brazilianRating === '16' || m.brazilianRating === '18')) return false;
    if (ratingFilter === 'adulto' && (m.brazilianRating === 'L' || m.brazilianRating === '10')) return false;
    if (onlySubscribed && userSubscriptions.length > 0) {
      const hasProvider = m.providers.some(p => userSubscriptions.includes(p.id));
      if (!hasProvider) return false;
    }
    return true;
  });

  const handleSpinRoulette = () => {
    if (candidatePool.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setWinnerMovie(null);

    // Rapid shuffle animation through candidate movies
    let speed = 60;
    let iterations = 0;
    const maxIterations = 28;

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * candidatePool.length);
      setDisplayedCandidate(candidatePool[randomIdx]);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalWinner = candidatePool[Math.floor(Math.random() * candidatePool.length)];
        setDisplayedCandidate(finalWinner);
        setWinnerMovie(finalWinner);
        setIsSpinning(false);

        // Confetti burst
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#F59E0B', '#FBBF24', '#8B5CF6', '#10B981']
        });
      }
    }, speed);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title Header */}
      <div className="bg-[#161B26] p-6 rounded-3xl border border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <Dices className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Roleta da Decisão
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Cansou de discutir o que assistir? Deixe a roleta decidir por vocês!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Parameters */}
      <div className="bg-[#161B26] p-6 rounded-3xl border border-white/[0.08] space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Filtros da Rodada</span>
          <span className="text-xs font-normal text-[#94A3B8] lowercase">
            ({candidatePool.length} filmes disponíveis no sorteio)
          </span>
        </div>

        {/* Mood Selection */}
        <div>
          <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
            Vibe ou Humor Desejado:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMood('qualquer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedMood === 'qualquer'
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-[#10131A] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              🎲 Surpreenda-me (Qualquer vibe)
            </button>
            {MOOD_DEFINITIONS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id as MovieMood)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  selectedMood === m.id
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-[#10131A] text-slate-300 border-white/10 hover:border-white/20'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Age Rating Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Tempo Máximo de Duração:
            </label>
            <div className="flex gap-2">
              {[
                { label: 'Sem limite', value: 0 },
                { label: 'Até 100m (Curto)', value: 100 },
                { label: 'Até 130m (Médio)', value: 130 }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setMaxRuntime(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    maxRuntime === opt.value
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#10131A] text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Classificação Indicativa:
            </label>
            <div className="flex gap-2">
              {[
                { label: 'Qualquer', value: 'todos' },
                { label: 'Família (Até 12)', value: 'familia' },
                { label: 'Adulto (16+)', value: 'adulto' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setRatingFilter(opt.value as any)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    ratingFilter === opt.value
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#10131A] text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roulette Stage */}
      <div className="bg-[#161B26] p-6 sm:p-8 rounded-3xl border border-white/[0.08] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Candidate or Winner Preview Frame */}
        {displayedCandidate ? (
          <div className={`relative w-full max-w-md bg-[#10131A] rounded-2xl overflow-hidden border-2 transition-all duration-300 mb-6 ${
            winnerMovie ? 'border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.35)] scale-105' : 'border-white/20'
          }`}>
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src={displayedCandidate.backdropUrl}
                alt={displayedCandidate.title}
                className="w-full h-full object-cover filter brightness-[0.8]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10131A] via-transparent to-transparent" />
              <div className="absolute top-3 left-3">
                <BrazilianRatingBadge rating={displayedCandidate.brazilianRating} size="md" />
              </div>
              <div className="absolute top-3 right-3 flex gap-1">
                {displayedCandidate.providers.map(p => (
                  <StreamingBadge key={p.id} id={p.id} name={p.name} size="sm" />
                ))}
              </div>
            </div>

            <div className="p-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">
                  {displayedCandidate.title}
                </h3>
                <span className="text-xs text-amber-400 font-bold">
                  ★ {displayedCandidate.imdbRating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2">
                {displayedCandidate.synopsis}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-dashed border-amber-500/30 flex flex-col items-center justify-center mb-6 text-slate-500">
            <Dices className="w-16 h-16 text-amber-400/60 mb-2 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">Pronto para rodar</span>
          </div>
        )}

        {/* Spin Button */}
        <div className="space-y-4">
          <button
            onClick={handleSpinRoulette}
            disabled={isSpinning || candidatePool.length === 0}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:from-[#d97706] hover:to-[#f59e0b] text-[#0B0E14] font-black text-lg shadow-[0_0_40px_rgba(245,158,11,0.4)] disabled:opacity-50 transition-all active:scale-95 flex items-center gap-3 mx-auto"
          >
            <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Sorteando o Filme...' : winnerMovie ? 'Girar a Roleta Novamente' : 'Girar a Roleta da Decisão!'}</span>
          </button>

          {winnerMovie && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onSelectMovie(winnerMovie)}
                className="py-2.5 px-5 rounded-xl bg-amber-500 text-black font-black text-xs shadow-md hover:bg-amber-400 transition-all"
              >
                Bora Assistir Este Filme! 🍿
              </button>
              <button
                onClick={() => onPlayTrailer(winnerMovie)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all"
              >
                Ver Trailer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
