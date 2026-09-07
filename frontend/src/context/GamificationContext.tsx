import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface GamificationContextType {
  xpGainNotification: number | null;
  levelUpModal: number | null;
  awardXP: (amount: number, action?: string) => Promise<void>;
  closeLevelUpModal: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refreshUserData } = useAuth();
  const [xpGainNotification, setXpGainNotification] = useState<number | null>(null);
  const [levelUpModal, setLevelUpModal] = useState<number | null>(null);

  const awardXP = async (amount: number, action: string = 'lesson') => {
    try {
      setXpGainNotification(amount);
      setTimeout(() => setXpGainNotification(null), 3000);

      const res = await api.post(`/gamification/earn-xp?xp_amount=${amount}&action=${action}`);
      if (res.data.leveled_up) {
        setLevelUpModal(res.data.level);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      await refreshUserData();
    } catch (err) {
      console.error('Failed to award XP', err);
    }
  };

  const closeLevelUpModal = () => {
    setLevelUpModal(null);
  };

  return (
    <GamificationContext.Provider value={{ xpGainNotification, levelUpModal, awardXP, closeLevelUpModal }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
