import React, { useState } from 'react';
import { Bookmark, Heart, CheckCircle2, Clock, Trash2, Star, Play, Sparkles, Popcorn } from 'lucide-react';
import { Movie, WatchlistItem } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface WatchlistModeProps {
  movies: Movie[];
  watchlist: Map<string, WatchlistItem>;
  favoriteIds: Set<string>;
  onSelectMovie: (movie: Movie) => void;
  onPlayTrailer: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  onToggleWatched: (movieId: string) => void;
  onRateMovie: (movieId: string, rating: number) => void;
}

export const WatchlistMode: React.FC<WatchlistModeProps> = ({
  movies,
  watchlist,
  favoriteIds,
  onSelectMovie,
  onPlayTrailer,
  onToggleWatchlist,
  onToggleFavorite,
  onToggleWatched,
  onRateMovie
}) => {
  const [tab, setTab] = useState<'para_ver' | 'assistidos' | 'favoritos'>('para_ver');

  // Filter movies
  const watchlistMovies = movies.filter(m => watchlist.has(m.id));
  const pendingMovies = watchlistMovies.filter(m => !watchlist.get(m.id)?.watched);
  const watchedMovies = watchlistMovies.filter(m => watchlist.get(m.id)?.watched);
  const favoriteMovies = movies.filter(m => favoriteIds.has(m.id));

  const currentList = 
    tab === 'para_ver' ? pendingMovies :
    tab === 'assistidos' ? watchedMovies : favoriteMovies;

  // Total runtime of saved movies
  const totalSavedMinutes = watchlistMovies.reduce((acc, m) => acc + m.runtime, 0);
  const totalWatchedMinutes = watchedMovies.reduce((acc, m) => acc + m.runtime, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Title Banner */}
        <div className="md:col-span-2 bg-[#161B26] p-6 rounded-3xl border border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Bookmark className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Minha Lista & Citações
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Gerencie seus filmes salvos, avalie com pipocas e nunca mais esqueça uma recomendação!
            </p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-[#161B26] p-5 rounded-3xl border border-white/[0.08] flex items-center justify-around text-center">
          <div>
            <span className="block text-2xl font-black text-amber-400">{watchlistMovies.length}</span>
            <span className="text-[11px] text-[#94A3B8] font-medium">Na Lista</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="block text-2xl font-black text-emerald-400">{watchedMovies.length}</span>
            <span className="text-[11px] text-[#94A3B8] font-medium">Já Vistos</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <span className="block text-2xl font-black text-violet-400">{Math.round(totalWatchedMinutes / 60)}h</span>
            <span className="text-[11px] text-[#94A3B8] font-medium">Assistidas</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setTab('para_ver')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'para_ver'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-[#161B26] text-[#94A3B8] hover:text-white border border-white/5'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Quero Assistir ({pendingMovies.length})</span>
        </button>

        <button
          onClick={() => setTab('assistidos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'assistidos'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-[#161B26] text-[#94A3B8] hover:text-white border border-white/5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Já Assisti ({watchedMovies.length})</span>
        </button>

        <button
          onClick={() => setTab('favoritos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            tab === 'favoritos'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-[#161B26] text-[#94A3B8] hover:text-white border border-white/5'
          }`}
        >
          <Heart className="w-4 h-4 fill-current text-rose-500" />
          <span>Favoritos ({favoriteMovies.length})</span>
        </button>
      </div>

      {/* Movie List Grid */}
      {currentList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentList.map(movie => {
            const item = watchlist.get(movie.id);
            const isFav = favoriteIds.has(movie.id);

            return (
              <div
                key={movie.id}
                className="flex gap-4 p-4 rounded-2xl bg-[#161B26] border border-white/[0.08] hover:border-amber-400/30 transition-all group"
              >
                {/* Poster */}
                <div
                  onClick={() => onSelectMovie(movie)}
                  className="w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden shrink-0 bg-black cursor-pointer relative"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <BrazilianRatingBadge rating={movie.brazilianRating} size="sm" />
                  </div>
                </div>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => onSelectMovie(movie)}
                        className="font-black text-white text-base hover:text-amber-400 cursor-pointer line-clamp-1"
                      >
                        {movie.title}
                      </h3>
                      <button
                        onClick={() => onToggleFavorite(movie)}
                        className={`p-1 text-slate-400 hover:text-rose-400 transition-colors ${
                          isFav ? 'text-rose-500' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {movie.year} • {movie.runtime} min • {movie.genres[0]}
                    </p>

                    <p className="text-xs text-[#94A3B8] mt-1.5 line-clamp-2">
                      {movie.synopsis}
                    </p>

                    {/* Streaming Badges */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {movie.providers.map(p => (
                        <StreamingBadge key={p.id} id={p.id} name={p.name} size="sm" />
                      ))}
                    </div>
                  </div>

                  {/* Rating with Popcorns & Actions */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/[0.06]">
                    {/* Mark as Watched toggle */}
                    <button
                      onClick={() => onToggleWatched(movie.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        item?.watched
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item?.watched ? 'Assistido' : 'Marcar Visto'}</span>
                    </button>

                    {/* Popcorn Rating if watched */}
                    {item?.watched && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[10px] text-[#94A3B8]">Nota:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => onRateMovie(movie.id, star)}
                            className="text-amber-400 hover:scale-125 transition-transform"
                            title={`Avaliar ${star} pipocas`}
                          >
                            🍿
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectMovie(movie)}
                        className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all"
                        title="Bora Assistir"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>

                      <button
                        onClick={() => onToggleWatchlist(movie)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remover da lista"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#161B26] rounded-3xl border border-white/[0.08]">
          <Popcorn className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Nenhum filme nesta lista ainda</h3>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1">
            Explore a aba "Descobrir" e clique em "Minha Lista" nos filmes que você quer assistir!
          </p>
        </div>
      )}
    </div>
  );
};
