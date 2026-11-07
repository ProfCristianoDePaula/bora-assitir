import React from 'react';
import { StreamingProviderId } from '../types/movie';

interface StreamingBadgeProps {
  id: StreamingProviderId;
  name?: string;
  type?: 'subscription' | 'rent' | 'buy';
  quality?: string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const StreamingBadge: React.FC<StreamingBadgeProps> = ({
  id,
  name,
  quality,
  size = 'md',
  onClick,
  className = ''
}) => {
  const getProviderConfig = () => {
    switch (id) {
      case 'netflix':
        return {
          displayName: name || 'Netflix',
          bg: 'bg-[#000000]',
          border: 'border-[#E50914]/40 hover:border-[#E50914]',
          text: 'text-[#E50914]',
          tag: 'N'
        };
      case 'prime':
        return {
          displayName: name || 'Prime Video',
          bg: 'bg-[#0E1A24]',
          border: 'border-[#00A8E1]/40 hover:border-[#00A8E1]',
          text: 'text-[#00A8E1]',
          tag: 'Prime'
        };
      case 'max':
        return {
          displayName: name || 'Max',
          bg: 'bg-[#0B0B1E]',
          border: 'border-[#002BE7]/50 hover:border-[#002BE7]',
          text: 'text-[#6882ff]',
          tag: 'MAX'
        };
      case 'disney':
        return {
          displayName: name || 'Disney+',
          bg: 'bg-[#0C1E40]',
          border: 'border-[#113CCF]/50 hover:border-[#3b82f6]',
          text: 'text-[#60a5fa]',
          tag: 'Disney+'
        };
      case 'apple':
        return {
          displayName: name || 'Apple TV+',
          bg: 'bg-[#1F2937]',
          border: 'border-white/20 hover:border-white/50',
          text: 'text-[#E5E7EB]',
          tag: 'TV+'
        };
      case 'globoplay':
        return {
          displayName: name || 'Globoplay',
          bg: 'bg-[#1F0008]',
          border: 'border-[#FB0036]/40 hover:border-[#FB0036]',
          text: 'text-[#FB0036]',
          tag: 'Globo'
        };
      default:
        return {
          displayName: name || id,
          bg: 'bg-[#161B26]',
          border: 'border-white/10',
          text: 'text-white',
          tag: id
        };
    }
  };

  const config = getProviderConfig();

  const isSmall = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 ${config.bg} border ${config.border} rounded-md transition-all duration-200 select-none ${
        isSmall ? 'h-5 px-1.5 text-[10px]' : 'h-6 px-2 text-xs'
      } ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      <span className={`font-black tracking-tight ${config.text}`}>
        {config.tag}
      </span>
      <span className="font-medium text-slate-300 text-[11px] truncate max-w-[85px]">
        {config.displayName}
      </span>
      {quality && (
        <span className="text-[9px] uppercase tracking-wider text-amber-400/90 font-semibold pl-0.5 border-l border-white/10">
          {quality}
        </span>
      )}
    </div>
  );
};
