import React, { useState, useEffect, useRef } from 'react';
import { Users, Play, Pause, MessageSquare, Send, Sparkles, Popcorn, Share2, Copy, Check, Clock, Volume2, Film } from 'lucide-react';
import { Movie, WatchPartyMember, WatchPartyMessage } from '../types/movie';
import { BrazilianRatingBadge } from './BrazilianRatingBadge';
import { StreamingBadge } from './StreamingBadge';

interface WatchPartyModeProps {
  movie: Movie;
  onSelectAnotherMovie: () => void;
  onPlayTrailer: (movie: Movie) => void;
}

export const WatchPartyMode: React.FC<WatchPartyModeProps> = ({
  movie,
  onSelectAnotherMovie,
  onPlayTrailer
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(1420); // seconds
  const [roomCode] = useState<string>('SESSAO-9842');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState<string>('');

  const [members, setMembers] = useState<WatchPartyMember[]>([
    { id: '1', name: 'Você', avatar: '🍿', status: 'pronto', isHost: true },
    { id: '2', name: 'Mariana', avatar: '✨', status: 'pronto' },
    { id: '3', name: 'Lucas', avatar: '🥤', status: 'pegando pipoca' },
    { id: '4', name: 'Beatriz', avatar: '🍫', status: 'pronto' }
  ]);

  const [messages, setMessages] = useState<WatchPartyMessage[]>([
    { id: '1', sender: 'Mariana', avatar: '✨', text: 'Já coloquei o refri na geladeira!', timestamp: '20:12' },
    { id: '2', sender: 'Lucas', avatar: '🥤', text: 'Esperem 2 minutinhos que a pipoca tá no microondas! 🍿', timestamp: '20:13' },
    { id: '3', sender: 'Beatriz', avatar: '🍫', text: 'Eu amo esse filme, vocês vão pirar com o final!', timestamp: '20:14' }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Time progress tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: WatchPartyMessage = {
      id: Date.now().toString(),
      sender: 'Você',
      avatar: '🍿',
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setMessageInput('');

    // Trigger funny friendly simulated reply after 2 seconds
    setTimeout(() => {
      const simulatedReplies = [
        'Hahaha exatamente!',
        'Prepara o coração pra próxima cena! 😱',
        'Alguém pausa rapidinho que vou pegar água!',
        'Cara, que cinematografia incrível!',
        'Aumenta um pouquinho o som!'
      ];
      const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'Mariana',
          avatar: '✨',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  const handleQuickReaction = (text: string) => {
    setMessageInput(text);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const totalRuntimeSeconds = movie.runtime * 60;
  const progressPercent = Math.min(100, (currentTime / totalRuntimeSeconds) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Room Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161B26] p-4 sm:p-5 rounded-3xl border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Sessão Pipoca ao Vivo
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 animate-pulse">
                Sincronizado
              </span>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Assistindo: <strong className="text-white">{movie.title}</strong>
            </p>
          </div>
        </div>

        {/* Room Code & Change Movie */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 bg-[#10131A] px-3.5 py-2 rounded-xl border border-white/10 hover:border-amber-400/40 text-xs font-semibold text-slate-300 transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Código: <strong className="text-amber-400 font-mono">{roomCode}</strong></span>
            {copiedCode && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={onSelectAnotherMovie}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-semibold text-white transition-all"
          >
            Trocar Filme
          </button>
        </div>
      </div>

      {/* Main Grid: Player on Left, Live Chat & Members on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cinematic Synchronized Screen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover filter brightness-[0.75]"
            />

            {/* Simulated Live Synchronized Watermark */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>SALA VIP • {members.length} PESSOAS</span>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <BrazilianRatingBadge rating={movie.brazilianRating} size="md" />
            </div>

            {/* Play/Pause center overlay icon */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/80 hover:bg-amber-500 text-black flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-black" /> : <Play className="w-7 h-7 fill-black ml-1" />}
            </button>

            {/* Bottom Playback Bar Controls */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
              {/* Progress Bar */}
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-3">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-amber-400">
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <span className="font-mono text-[11px] text-[#94A3B8]">
                    {formatTime(currentTime)} / {formatTime(totalRuntimeSeconds)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-400 font-bold">
                    {movie.providers[0]?.name}
                  </span>
                  <button
                    onClick={() => onPlayTrailer(movie)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Assistir Trailer oficial"
                  >
                    <Film className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Members Bar */}
          <div className="bg-[#161B26] p-4 rounded-2xl border border-white/[0.08]">
            <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              Na Sala ({members.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-2 p-2 rounded-xl bg-[#10131A] border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-sm">
                    {m.avatar}
                  </div>
                  <div className="truncate">
                    <span className="block text-xs font-bold text-white truncate">{m.name}</span>
                    <span className={`text-[10px] font-medium ${
                      m.status === 'pronto' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Chat & Reactions */}
        <div className="flex flex-col h-[520px] bg-[#161B26] rounded-3xl border border-white/[0.08] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/[0.08] bg-[#10131A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">Chat da Sessão</h3>
            </div>
            <span className="text-[11px] text-slate-400">Tempo real</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2 text-xs ${
                  msg.sender === 'Você' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-white/10 shrink-0 flex items-center justify-center text-xs">
                  {msg.avatar}
                </div>
                <div className={`max-w-[78%] rounded-2xl p-2.5 ${
                  msg.sender === 'Você'
                    ? 'bg-amber-500 text-black font-medium'
                    : 'bg-[#1D2026] text-white border border-white/5'
                }`}>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold ${
                      msg.sender === 'Você' ? 'text-black' : 'text-amber-400'
                    }`}>
                      {msg.sender}
                    </span>
                    <span className={`text-[9px] ${
                      msg.sender === 'Você' ? 'text-black/60' : 'text-slate-400'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="leading-snug">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick reaction stickers */}
          <div className="px-3 py-1.5 bg-[#10131A] border-t border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['🍿 Pipoca!', '😱 Que cena!', '😂 Hahaha', '⏸️ Pausa aí', '🔥 Demais!'].map(reaction => (
              <button
                key={reaction}
                onClick={() => handleQuickReaction(reaction)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-[#1D2026] hover:bg-white/10 text-[11px] text-slate-300 font-medium border border-white/5 transition-colors"
              >
                {reaction}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#10131A] border-t border-white/[0.08] flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Digite um comentário sobre a cena..."
              className="flex-1 bg-[#161B26] border border-white/10 focus:border-amber-400 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
