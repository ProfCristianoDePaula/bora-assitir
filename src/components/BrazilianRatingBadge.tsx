import React from 'react';
import { BrazilianRating } from '../types/movie';

interface BrazilianRatingBadgeProps {
  rating: BrazilianRating;
  reason?: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export const BrazilianRatingBadge: React.FC<BrazilianRatingBadgeProps> = ({
  rating,
  reason,
  size = 'md',
  showTooltip = false,
  className = ''
}) => {
  // Regulatory colors according to official Ministry of Justice / DJCTQ Brazilian standard:
  const getStyle = () => {
    switch (rating) {
      case 'L':
        return {
          bg: 'bg-[#00B050]',
          text: 'text-white',
          border: 'border-transparent',
          label: 'Livre'
        };
      case '10':
        return {
          bg: 'bg-[#0090FF]',
          text: 'text-white',
          border: 'border-transparent',
          label: '10 anos'
        };
      case '12':
        return {
          bg: 'bg-[#FFC000]',
          text: 'text-black',
          border: 'border-transparent',
          label: '12 anos'
        };
      case '14':
        return {
          bg: 'bg-[#FF6600]',
          text: 'text-white',
          border: 'border-transparent',
          label: '14 anos'
        };
      case '16':
        return {
          bg: 'bg-[#FF0000]',
          text: 'text-white',
          border: 'border-transparent',
          label: '16 anos'
        };
      case '18':
        return {
          bg: 'bg-black',
          text: 'text-white',
          border: 'border-[#DC2626]',
          label: '18 anos'
        };
      default:
        return {
          bg: 'bg-zinc-700',
          text: 'text-white',
          border: 'border-transparent',
          label: rating
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: 'w-[18px] h-[18px] text-[10px] rounded-[4px]',
    md: 'w-[22px] h-[22px] text-[11px] rounded-[6px]', // 22x22px design spec
    lg: 'w-[28px] h-[28px] text-[13px] rounded-[8px]'
  };

  return (
    <div className={`relative group inline-flex items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${style.bg} ${style.text} border ${style.border} font-bold flex items-center justify-center shrink-0 shadow-xs select-none`}
        title={reason ? `Classificação: ${style.label} - ${reason}` : `Classificação: ${style.label}`}
      >
        <span>{rating}</span>
      </div>

      {showTooltip && reason && (
        <div className="absolute left-full ml-2 z-50 hidden group-hover:flex flex-col bg-[#161B26] border border-white/10 rounded-lg p-2 text-xs text-[#E1E2EB] whitespace-nowrap shadow-xl pointer-events-none">
          <span className="font-semibold text-white">{style.label}</span>
          <span className="text-[#94A3B8] text-[11px]">{reason}</span>
        </div>
      )}
    </div>
  );
};
