import React from 'react';
import { useAuth } from '../context/AuthContext';

interface FuriganaTextProps {
  japanese: string;
  furigana?: string;
  romaji?: string;
  className?: string;
}

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  japanese,
  furigana,
  romaji,
  className = ''
}) => {
  const { progress } = useAuth();
  const romajiMode = progress?.romaji_mode || 'full';

  return (
    <div className={`inline-flex flex-col items-center leading-tight ${className}`}>
      {/* HTML Ruby for Furigana */}
      {furigana ? (
        <ruby className="text-xl font-bold tracking-wide">
          {japanese}
          <rt className="text-xs text-rose-400 font-semibold">{furigana}</rt>
        </ruby>
      ) : (
        <span className="text-xl font-bold tracking-wide">{japanese}</span>
      )}

      {/* Optional Romaji Subscript */}
      {romajiMode === 'full' && romaji && (
        <span className="text-[11px] font-medium text-slate-400 tracking-wider">
          {romaji}
        </span>
      )}
    </div>
  );
};
