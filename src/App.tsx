import React, { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Sparkles,
  Flame,
  Clapperboard,
  Laugh,
  Award,
  Zap,
  Filter,
  Tv,
  Heart,
  Search,
  SlidersHorizontal,
  Popcorn,
  ChevronRight
} from 'lucide-react';
import { Movie, StreamingProviderId, WatchlistItem } from './types/movie';
import { MOVIES, GENRES, STREAMING_PLATFORMS } from './data/movies';
import { BrazilianRatingBadge } from './components/BrazilianRatingBadge';
import { StreamingBadge } from './components/StreamingBadge';
import { MovieCard } from './components/MovieCard';
import { MovieRail } from './components/MovieRail';
import { HeroBanner } from './components/HeroBanner';
import { Navbar, AppScreen } from './components/Navbar';
import { TrailerModal } from './components/TrailerModal';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { StreamFilterDrawer } from './components/StreamFilterDrawer';
import { MatchMode } from './components/MatchMode';
import { RouletteMode } from './components/RouletteMode';
import { WatchPartyMode } from './components/WatchPartyMode';
import { WatchlistMode } from './components/WatchlistMode';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('descobrir');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');

  // Streaming subscriptions filter
  const [activeSubscriptions, setActiveSubscriptions] = useState<StreamingProviderId[]>([
    'netflix',
    'prime',
    'max',
    'globoplay'
  ]);
  const [isSubscriptionDrawerOpen, setIsSubscriptionDrawerOpen] = useState(false);

  // Active modals
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState<Movie | null>(null);
  const [selectedMovieForTrailer, setSelectedMovieForTrailer] = useState<Movie | null>(null);

  // Watch party movie
  const [watchPartyMovie, setWatchPartyMovie] = useState<Movie>(MOVIES[0]);

  // Watchlist & Favorites state
  const [watchlist, setWatchlist] = useState<Map<string, WatchlistItem>>(() => {
    // Initial seeded watchlist for immediate delight
    const initial = new Map<string, WatchlistItem>();
    initial.set('ainda-estou-aqui', { movieId: 'ainda-estou-aqui', addedAt: '2024-11-01', watched: false });
    initial.set('duna-parte-2', { movieId: 'duna-parte-2', addedAt: '2024-11-02', watched: true, userRating: 5 });
    initial.set('auto-da-compadecida-2', { movieId: 'auto-da-compadecida-2', addedAt: '2024-11-03', watched: false });
    return initial;
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    return new Set(['cidade-de-deus', 'ainda-estou-aqui', 'divertida-mente-2']);
  });

  // Watchlist Actions
  const toggleWatchlist = (movie: Movie) => {
    setWatchlist((prev) => {
      const next = new Map(prev);
      if (next.has(movie.id)) {
        next.delete(movie.id);
      } else {
        next.set(movie.id, {
          movieId: movie.id,
          addedAt: new Date().toISOString(),
          watched: false
        });
      }
      return next;
    });
  };

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(movie.id)) {
        next.delete(movie.id);
      } else {
        next.add(movie.id);
      }
      return next;
    });
  };

  const toggleWatched = (movieId: string) => {
    setWatchlist((prev) => {
      const next = new Map(prev);
      const current = next.get(movieId);
      if (current) {
        next.set(movieId, { ...current, watched: !current.watched });
      }
      return next;
    });
  };

  const rateMovie = (movieId: string, rating: number) => {
    setWatchlist((prev) => {
      const next = new Map(prev);
      const current = next.get(movieId);
      if (current) {
        next.set(movieId, { ...current, userRating: rating });
      }
      return next;
    });
  };

  // Streaming filters
  const toggleSubscription = (id: StreamingProviderId) => {
    setActiveSubscriptions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAllSubscriptions = () => {
    setActiveSubscriptions(STREAMING_PLATFORMS.map((p) => p.id));
  };

  const clearAllSubscriptions = () => {
    setActiveSubscriptions([]);
  };

  // Start watch party handler
  const handleStartWatchParty = (movie: Movie) => {
    setWatchPartyMovie(movie);
    setSelectedMovieForDetails(null);
    setCurrentScreen('watch_party');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter movies based on active subscriptions & genre
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Subscriptions filter
      if (activeSubscriptions.length > 0) {
        const matchesSub = movie.providers.some((p) =>
          activeSubscriptions.includes(p.id)
        );
        if (!matchesSub) return false;
      }

      // Genre filter
      if (selectedGenre !== 'Todos') {
        if (!movie.genres.includes(selectedGenre)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesOriginal = movie.originalTitle?.toLowerCase().includes(q);
        const matchesDirector = movie.director.toLowerCase().includes(q);
        const matchesCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        const matchesGenre = movie.genres.some((g) => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesOriginal && !matchesDirector && !matchesCast && !matchesGenre) {
          return false;
        }
      }

      return true;
    });
  }, [activeSubscriptions, selectedGenre, searchQuery]);

  // Rails categorization
  const trendingMovies = useMemo(
    () => filteredMovies.filter((m) => (m.trendingRank || 99) <= 8),
    [filteredMovies]
  );

  const nationalMovies = useMemo(
    () => filteredMovies.filter((m) => m.country === 'Brasil' || m.genres.includes('Nacional')),
    [filteredMovies]
  );

  const actionMovies = useMemo(
    () => filteredMovies.filter((m) => m.genres.includes('Ação') || m.genres.includes('Aventura')),
    [filteredMovies]
  );

  const mindBendingMovies = useMemo(
    () => filteredMovies.filter((m) => m.moods.includes('explodir_cabeca') || m.genres.includes('Suspense') || m.genres.includes('Ficção Científica')),
    [filteredMovies]
  );

  const comedyMovies = useMemo(
    () => filteredMovies.filter((m) => m.genres.includes('Comédia') || m.moods.includes('chorar_de_rir')),
    [filteredMovies]
  );

  const awardWinners = useMemo(
    () => filteredMovies.filter((m) => m.imdbRating >= 8.2),
    [filteredMovies]
  );

  // Featured Spotlight Hero Movies
  const featuredSpotlights = useMemo(() => {
    return MOVIES.filter((m) => m.featured || m.trendingRank === 1 || m.trendingRank === 2);
  }, []);

  const watchlistSet = useMemo(() => new Set(watchlist.keys()), [watchlist]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E1E2EB] flex flex-col font-sans pb-16 md:pb-0">
      {/* Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSubscriptions={activeSubscriptions}
        onToggleSubscriptionDrawer={() => setIsSubscriptionDrawerOpen(true)}
        watchlistCount={watchlist.size}
      />

      {/* Main Screen Views */}
      <main className="flex-1">
        {/* SCREEN 1: DESCOBRIR (Home / Streaming Rails) */}
        {currentScreen === 'descobrir' && (
          <div>
            {/* If user is searching, show Live Search Results */}
            {searchQuery.trim() ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      Resultados para "{searchQuery}"
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {filteredMovies.length} {filteredMovies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-amber-400 font-bold hover:underline"
                  >
                    Limpar busca
                  </button>
                </div>

                {filteredMovies.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        isInWatchlist={watchlistSet.has(movie.id)}
                        isFavorite={favorites.has(movie.id)}
                        onSelect={setSelectedMovieForDetails}
                        onToggleWatchlist={toggleWatchlist}
                        onToggleFavorite={toggleFavorite}
                        onPlayTrailer={setSelectedMovieForTrailer}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#161B26] rounded-3xl border border-white/[0.08]">
                    <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">Nenhum título encontrado</h3>
                    <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mt-1">
                      Tente buscar por outro termo, ou verifique se seus filtros de streaming estão restringindo a busca.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Hero Spotlight Banner */}
                <HeroBanner
                  featuredMovies={featuredSpotlights}
                  isInWatchlist={(id) => watchlistSet.has(id)}
                  onSelectMovie={setSelectedMovieForDetails}
                  onToggleWatchlist={toggleWatchlist}
                  onPlayTrailer={setSelectedMovieForTrailer}
                  onStartWatchParty={handleStartWatchParty}
                />

                {/* Quick Filters Bar: Streaming Badges + Genre Chips */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-8 relative z-20">
                  <div className="bg-[#161B26]/90 backdrop-blur-xl border border-white/[0.1] rounded-2xl p-4 shadow-xl space-y-3">
                    {/* Streaming Quick Filter Bar */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Tv className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Filtrar por Streaming:
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {STREAMING_PLATFORMS.map((plat) => {
                          const isSelected = activeSubscriptions.includes(plat.id);
                          return (
                            <button
                              key={plat.id}
                              onClick={() => toggleSubscription(plat.id)}
                              className={`h-7 px-2.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                  : 'bg-[#10131A] border-white/10 text-slate-400 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: plat.brandColor }}
                              />
                              <span>{plat.name}</span>
                            </button>
                          );
                        })}
                        <button
                          onClick={() => setIsSubscriptionDrawerOpen(true)}
                          className="h-7 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-medium"
                          title="Gerenciar todos os streamings"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Genre Filter Chips (Height 36px, horizontal padding 1rem, rounded-full) */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                      {GENRES.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => setSelectedGenre(genre)}
                          className={`h-9 px-4 rounded-full text-xs font-medium shrink-0 transition-all select-none ${
                            selectedGenre === genre
                              ? 'bg-[#F59E0B]/15 border border-[#F59E0B] text-[#FBBF24] font-bold shadow-xs'
                              : 'bg-[#161B26] border border-white/[0.08] text-[#94A3B8] hover:text-white hover:border-white/20'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dynamic Cinematic Rails */}
                <div className="space-y-6">
                  {/* Rail 1: Trending Now */}
                  <MovieRail
                    title="Em Alta no Brasil"
                    subtitle="Os filmes mais comentados e assistidos da semana"
                    icon={<Flame className="w-5 h-5 fill-amber-400 text-amber-400" />}
                    badge="TOP 10"
                    movies={trendingMovies}
                    watchlistIds={watchlistSet}
                    favoriteIds={favorites}
                    onSelectMovie={setSelectedMovieForDetails}
                    onToggleWatchlist={toggleWatchlist}
                    onToggleFavorite={toggleFavorite}
                    onPlayTrailer={setSelectedMovieForTrailer}
                    aspect="poster"
                  />

                  {/* Rail 2: Brazilian Cinema Highlights */}
                  <MovieRail
                    title="Destaques do Cinema Nacional"
                    subtitle="O melhor das produções brasileiras consagradas e estreias"
                    icon={<span className="text-base">🇧🇷</span>}
                    badge="Cinema Brasileiro"
                    movies={nationalMovies}
                    watchlistIds={watchlistSet}
                    favoriteIds={favorites}
                    onSelectMovie={setSelectedMovieForDetails}
                    onToggleWatchlist={toggleWatchlist}
                    onToggleFavorite={toggleFavorite}
                    onPlayTrailer={setSelectedMovieForTrailer}
                    aspect="poster"
                  />

                  {/* Mid-page Interactive Match Banner Callout */}
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-950/80 via-[#1B1528] to-[#161B26] border border-violet-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
                      <div className="space-y-2 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span>Modo Casal & Amigos</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          Cansados de gastar 40 minutos só escolhendo o que ver?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
                          Use o Modo Match! Cada um dá like nos filmes favoritos e, quando der Match, o filme da noite tá escolhido!
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentScreen('match');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="shrink-0 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-sm shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Abrir Modo Match</span>
                      </button>
                    </div>
                  </div>

                  {/* Rail 3: Mind Bending & Suspense */}
                  <MovieRail
                    title="Explodir a Cabeça & Suspense"
                    subtitle="Roteiros geniais, quebra-cabeças e reviravoltas de tirar o fôlego"
                    icon={<Zap className="w-5 h-5 text-amber-400" />}
                    movies={mindBendingMovies}
                    watchlistIds={watchlistSet}
                    favoriteIds={favorites}
                    onSelectMovie={setSelectedMovieForDetails}
                    onToggleWatchlist={toggleWatchlist}
                    onToggleFavorite={toggleFavorite}
                    onPlayTrailer={setSelectedMovieForTrailer}
                    aspect="poster"
                  />

                  {/* Rail 4: Action & Sessão Pipoca (Landscape cards) */}
                  <MovieRail
                    title="Sessão Pipoca & Adrenalina"
                    subtitle="Ação épica, efeitos visuais e diversão sem limites"
                    icon={<Popcorn className="w-5 h-5 text-amber-400" />}
                    movies={actionMovies}
                    watchlistIds={watchlistSet}
                    favoriteIds={favorites}
                    onSelectMovie={setSelectedMovieForDetails}
                    onToggleWatchlist={toggleWatchlist}
                    onToggleFavorite={toggleFavorite}
                    onPlayTrailer={setSelectedMovieForTrailer}
                    aspect="landscape"
                  />

                  {/* Rail 5: Comedy & Chorar de Rir */}
                  <MovieRail
                    title="Chorar de Rir & Vibe Boa"
                    subtitle="Comédias para relaxar o corpo e a mente no sofá"
                    icon={<Laugh className="w-5 h-5 text-amber-400" />}
                    movies={comedyMovies}
                    watchlistIds={watchlistSet}
                    favoriteIds={favorites}
                    onSelectMovie={setSelectedMovieForDetails}
                    onToggleWatchlist={toggleWatchlist}
                    onToggleFavorite={toggleFavorite}
                    onPlayTrailer={setSelectedMovieForTrailer}
                    aspect="poster"
                  />

                  {/* Rail 6: Award Winners */}
                  <MovieRail
                    title="Aclamados pela Crítica & Prêmios"
                    subtitle="Obras-primas com notas acima de 8.2 no IMDb"
                    icon={<Award className="w-5 h-5 text-amber-400" />}
                    badge="Crítica Ouro"
                    movies={awardWinners}
                    watchlistIds={watchlistSet}
                    favoriteIds={favorites}
                    onSelectMovie={setSelectedMovieForDetails}
                    onToggleWatchlist={toggleWatchlist}
                    onToggleFavorite={toggleFavorite}
                    onPlayTrailer={setSelectedMovieForTrailer}
                    aspect="poster"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* SCREEN 2: MODO MATCH */}
        {currentScreen === 'match' && (
          <MatchMode
            movies={MOVIES}
            userSubscriptions={activeSubscriptions}
            onSelectMovie={setSelectedMovieForDetails}
            onPlayTrailer={setSelectedMovieForTrailer}
            onStartWatchParty={handleStartWatchParty}
          />
        )}

        {/* SCREEN 3: ROLETA DA DECISÃO */}
        {currentScreen === 'roleta' && (
          <RouletteMode
            movies={MOVIES}
            userSubscriptions={activeSubscriptions}
            onSelectMovie={setSelectedMovieForDetails}
            onPlayTrailer={setSelectedMovieForTrailer}
            onStartWatchParty={handleStartWatchParty}
          />
        )}

        {/* SCREEN 4: SESSÃO PIPOCA (WATCH PARTY) */}
        {currentScreen === 'watch_party' && (
          <WatchPartyMode
            movie={watchPartyMovie}
            onSelectAnotherMovie={() => {
              setCurrentScreen('descobrir');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPlayTrailer={setSelectedMovieForTrailer}
          />
        )}

        {/* SCREEN 5: MINHA LISTA */}
        {currentScreen === 'watchlist' && (
          <WatchlistMode
            movies={MOVIES}
            watchlist={watchlist}
            favoriteIds={favorites}
            onSelectMovie={setSelectedMovieForDetails}
            onPlayTrailer={setSelectedMovieForTrailer}
            onToggleWatchlist={toggleWatchlist}
            onToggleFavorite={toggleFavorite}
            onToggleWatched={toggleWatched}
            onRateMovie={rateMovie}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/[0.08] bg-[#0B0E14] py-10 px-4 sm:px-6 lg:px-8 text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">🍿</span>
            <div>
              <span className="font-extrabold text-white text-sm">Bora Assistir?</span>
              <p className="text-[11px] text-[#64748B]">
                Curadoria de streaming e cinema com classificação indicativa oficial brasileira.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button onClick={() => setCurrentScreen('descobrir')} className="hover:text-white">Descobrir</button>
            <button onClick={() => setCurrentScreen('match')} className="hover:text-white">Modo Match</button>
            <button onClick={() => setCurrentScreen('roleta')} className="hover:text-white">Roleta</button>
            <button onClick={() => setCurrentScreen('watch_party')} className="hover:text-white">Sessão Pipoca</button>
            <button onClick={() => setCurrentScreen('watchlist')} className="hover:text-white">Minha Lista</button>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#64748B]">
            Classificação Indicativa (DJCTQ/SENACON). Feito com paixão pelo cinema.
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MovieDetailsModal
        movie={selectedMovieForDetails}
        isOpen={!!selectedMovieForDetails}
        isInWatchlist={selectedMovieForDetails ? watchlistSet.has(selectedMovieForDetails.id) : false}
        isFavorite={selectedMovieForDetails ? favorites.has(selectedMovieForDetails.id) : false}
        onClose={() => setSelectedMovieForDetails(null)}
        onToggleWatchlist={toggleWatchlist}
        onToggleFavorite={toggleFavorite}
        onPlayTrailer={setSelectedMovieForTrailer}
        onStartWatchParty={handleStartWatchParty}
      />

      <TrailerModal
        movie={selectedMovieForTrailer}
        isOpen={!!selectedMovieForTrailer}
        onClose={() => setSelectedMovieForTrailer(null)}
      />

      <StreamFilterDrawer
        isOpen={isSubscriptionDrawerOpen}
        onClose={() => setIsSubscriptionDrawerOpen(false)}
        activeSubscriptions={activeSubscriptions}
        onToggleSubscription={toggleSubscription}
        onSelectAll={selectAllSubscriptions}
        onClearAll={clearAllSubscriptions}
      />
    </div>
  );
}
