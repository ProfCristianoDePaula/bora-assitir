import React from 'react';
import { X, Check, Tv, Sparkles } from 'lucide-react';
import { StreamingProviderId } from '../types/movie';
import { STREAMING_PLATFORMS } from '../data/movies';

interface StreamFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubscriptions: StreamingProviderId[];
  onToggleSubscription: (id: StreamingProviderId) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const StreamFilterDrawer: React.FC<StreamFilterDrawerProps> = ({
  isOpen,
  onClose,
  activeSubscriptions,
  onToggleSubscription,
  onSelectAll,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-[#161B26] border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Meus Streamings</h3>
              <p className="text-xs text-[#94A3B8]">
                Selecione onde você tem assinatura para filtrar o catálogo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streaming platforms grid */}
        <div className="grid grid-cols-2 gap-3 my-6">
          {STREAMING_PLATFORMS.map((platform) => {
            const isSelected = activeSubscriptions.includes(platform.id);

            return (
              <div
                key={platform.id}
                onClick={() => onToggleSubscription(platform.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#212936] border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-[#10131A] border-white/[0.08] hover:border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: platform.brandColor }}
                  />
                  <span className="text-xs font-bold text-white">
                    {platform.name}
                  </span>
                </div>

                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                  isSelected
                    ? 'bg-amber-500 border-amber-400 text-black'
                    : 'border-white/20'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              onClick={onSelectAll}
              className="text-xs text-amber-400 font-semibold hover:underline"
            >
              Todos ({STREAMING_PLATFORMS.length})
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-white"
            >
              Limpar
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};
