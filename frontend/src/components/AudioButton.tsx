import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakJapanese } from '../services/audio';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  rate?: number;
}

export const AudioButton: React.FC<AudioButtonProps> = ({ text, size = 'md', rate = 0.9 }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    speakJapanese(text, rate);
    setTimeout(() => setIsPlaying(false), 1200);
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const btnSizes = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-2.5 rounded-2xl'
  };

  return (
    <button
      onClick={handlePlay}
      className={`${btnSizes[size]} bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:scale-105 active:scale-95 transition-all shadow-sm`}
      title={`Listen to Japanese: "${text}"`}
    >
      <Volume2 className={`${iconSizes[size]} ${isPlaying ? 'animate-bounce text-rose-300' : ''}`} />
    </button>
  );
};
