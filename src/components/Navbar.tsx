import React from 'react';
import { Film, Heart, Dices, Users, Bookmark, Search, Tv, SlidersHorizontal, Sparkles } from 'lucide-react';
import { StreamingProviderId } from '../types/movie';
import { STREAMING_PLATFORMS } from '../data/movies';

export type AppScreen = 'descobrir' | 'match' | 'roleta' | 'watch_party' | 'watchlist';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSubscriptions: StreamingProviderId[];
  onToggleSubscriptionDrawer: () => void;
  watchlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  searchQuery,
  onSearchChange,
  activeSubscriptions,
  onToggleSubscriptionDrawer,
  watchlistCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0E14]/90 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate('descobrir')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-[#0B0E14] shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
              <span className="text-xl">🍿</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  Bora Assistir<span className="text-amber-400">?</span>
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  BR
                </span>
              </div>
              <span className="text-[10px] text-[#94A3B8] -mt-1 block font-medium">
                O que ver nos seus streamings
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-[#161B26] p-1 rounded-2xl border border-white/[0.08]">
            <button
              onClick={() => onNavigate('descobrir')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentScreen === 'descobrir'
                  ? 'bg-amber-500 text-[#0B0E14] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Descobrir</span>
            </button>

            <button
              onClick={() => onNavigate('match')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentScreen === 'match'
                  ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart className="w-4 h-4 fill-current text-violet-400" />
              <span>Modo Match</span>
            </button>

            <button
              onClick={() => onNavigate('roleta')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentScreen === 'roleta'
                  ? 'bg-amber-500 text-[#0B0E14] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Dices className="w-4 h-4" />
              <span>Roleta</span>
            </button>

            <button
              onClick={() => onNavigate('watch_party')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentScreen === 'watch_party'
                  ? 'bg-amber-500 text-[#0B0E14] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Sessão Pipoca</span>
            </button>

            <button
              onClick={() => onNavigate('watchlist')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                currentScreen === 'watchlist'
                  ? 'bg-amber-500 text-[#0B0E14] shadow-sm'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Minha Lista</span>
              {watchlistCount > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center ${
                  currentScreen === 'watchlist' ? 'bg-[#0B0E14] text-amber-400' : 'bg-amber-500 text-black'
                }`}>
                  {watchlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Area: Search & Streaming Filter Drawer */}
          <div className="flex items-center gap-2.5">
            {/* Search Input Bar */}
            <div className="relative hidden sm:block w-48 lg:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar filme, ator, diretor..."
                className="w-full bg-[#161B26] border border-white/10 focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B] transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Subscriptions Pill Filter */}
            <button
              onClick={onToggleSubscriptionDrawer}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161B26] hover:bg-[#212936] border border-white/10 text-xs font-semibold text-[#F8FAFC] transition-colors"
              title="Filtrar pelos meus streamings"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Streamings</span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                {activeSubscriptions.length === 0 ? 'Todos' : activeSubscriptions.length}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="sm:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar filmes, nacionais, diretores..."
              className="w-full bg-[#161B26] border border-white/10 focus:border-[#F59E0B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#64748B]"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0B0E14]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => onNavigate('descobrir')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
            currentScreen === 'descobrir' ? 'text-amber-400' : 'text-[#94A3B8]'
          }`}
        >
          <Film className="w-5 h-5" />
          <span>Descobrir</span>
        </button>

        <button
          onClick={() => onNavigate('match')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
            currentScreen === 'match' ? 'text-violet-400' : 'text-[#94A3B8]'
          }`}
        >
          <Heart className="w-5 h-5 fill-current" />
          <span>Match</span>
        </button>

        <button
          onClick={() => onNavigate('roleta')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
            currentScreen === 'roleta' ? 'text-amber-400' : 'text-[#94A3B8]'
          }`}
        >
          <Dices className="w-5 h-5" />
          <span>Roleta</span>
        </button>

        <button
          onClick={() => onNavigate('watch_party')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold ${
            currentScreen === 'watch_party' ? 'text-amber-400' : 'text-[#94A3B8]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Sessão</span>
        </button>

        <button
          onClick={() => onNavigate('watchlist')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-bold relative ${
            currentScreen === 'watchlist' ? 'text-amber-400' : 'text-[#94A3B8]'
          }`}
        >
          <Bookmark className="w-5 h-5" />
          <span>Lista</span>
          {watchlistCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-black text-[9px] font-black flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
