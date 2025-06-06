import React, { createContext, useContext, useState, useEffect } from 'react';
import { sharedProjects } from '../lib/yjs';

interface Kingdom {
  id: string;
  name: string;
  creator: string;
  gradient: string;
  description: string;
  marketCap: string;
  fundingProgress: number;
  fundingGoal: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  features: Array<{
    name: string;
    description: string;
  }>;
}

interface KingdomContextType {
  kingdoms: Kingdom[];
  recentKingdoms: Kingdom[];
  favoriteKingdoms: Kingdom[];
  getKingdom: (id: string) => Kingdom | undefined;
  updateKingdoms: () => void;
}

const KingdomContext = createContext<KingdomContextType | undefined>(undefined);

export function KingdomProvider({ children }: { children: React.ReactNode }) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [recentKingdoms, setRecentKingdoms] = useState<Kingdom[]>([]);
  const [favoriteKingdoms, setFavoriteKingdoms] = useState<Kingdom[]>([]);

  const updateKingdoms = () => {
    const allKingdoms = sharedProjects.toArray();
    const favorites = JSON.parse(localStorage.getItem('kingdom_favorites') || '[]');
    
    setKingdoms([...allKingdoms].reverse());
    setRecentKingdoms([...allKingdoms].reverse().slice(0, 3));
    setFavoriteKingdoms(allKingdoms.filter(kingdom => favorites.includes(kingdom.id)));
  };

  const getKingdom = (id: string) => {
    return kingdoms.find(kingdom => kingdom.id === id);
  };

  useEffect(() => {
    updateKingdoms();
    sharedProjects.observe(() => {
      updateKingdoms();
    });
  }, []);

  return (
    <KingdomContext.Provider value={{
      kingdoms,
      recentKingdoms,
      favoriteKingdoms,
      getKingdom,
      updateKingdoms
    }}>
      {children}
    </KingdomContext.Provider>
  );
}

export function useKingdom() {
  const context = useContext(KingdomContext);
  if (context === undefined) {
    throw new Error('useKingdom must be used within a KingdomProvider');
  }
  return context;
}