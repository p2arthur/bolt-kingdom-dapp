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

// Local storage keys
const RECENT_KINGDOMS_KEY = 'kingdom_recent_list';
const RECENT_KINGDOMS_MAX = 5; // Maximum number of recent kingdoms to keep

export function KingdomProvider({ children }: { children: React.ReactNode }) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [recentKingdoms, setRecentKingdoms] = useState<Kingdom[]>([]);
  const [favoriteKingdoms, setFavoriteKingdoms] = useState<Kingdom[]>([]);

  // Load recent kingdoms from localStorage
  const loadRecentKingdoms = () => {
    try {
      const stored = localStorage.getItem(RECENT_KINGDOMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recent kingdoms:', error);
      return [];
    }
  };

  // Save recent kingdoms to localStorage
  const saveRecentKingdoms = (kingdoms: Kingdom[]) => {
    try {
      localStorage.setItem(RECENT_KINGDOMS_KEY, JSON.stringify(kingdoms));
    } catch (error) {
      console.error('Error saving recent kingdoms:', error);
    }
  };

  // Add a kingdom to recent list
  const addToRecentKingdoms = (kingdom: Kingdom) => {
    const currentRecent = loadRecentKingdoms();
    
    // Remove if already exists to avoid duplicates
    const filtered = currentRecent.filter((k: Kingdom) => k.id !== kingdom.id);
    
    // Add to beginning of array
    const newRecent = [kingdom, ...filtered].slice(0, RECENT_KINGDOMS_MAX);
    
    saveRecentKingdoms(newRecent);
    setRecentKingdoms(newRecent);
  };

  const updateKingdoms = () => {
    const allKingdoms = sharedProjects.toArray();
    const favorites = JSON.parse(localStorage.getItem('kingdom_favorites') || '[]');
    const storedRecent = loadRecentKingdoms();
    
    // Update kingdoms list
    const reversedKingdoms = [...allKingdoms].reverse();
    setKingdoms(reversedKingdoms);
    
    // Update favorites
    setFavoriteKingdoms(allKingdoms.filter(kingdom => favorites.includes(kingdom.id)));
    
    // Check for new kingdoms and add them to recent
    if (allKingdoms.length > 0) {
      const latestKingdom = reversedKingdoms[0];
      const isAlreadyInRecent = storedRecent.some((k: Kingdom) => k.id === latestKingdom.id);
      
      if (!isAlreadyInRecent) {
        addToRecentKingdoms(latestKingdom);
      } else {
        // Just update the recent kingdoms state with stored data
        setRecentKingdoms(storedRecent);
      }
    } else {
      setRecentKingdoms(storedRecent);
    }
  };

  const getKingdom = (id: string) => {
    return kingdoms.find(kingdom => kingdom.id === id);
  };

  // Initialize on mount
  useEffect(() => {
    // Load initial data
    updateKingdoms();
    
    // Set up observer for shared projects
    const unsubscribe = sharedProjects.observe(() => {
      updateKingdoms();
    });

    // Cleanup observer on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Also load recent kingdoms on mount to ensure they're available immediately
  useEffect(() => {
    const storedRecent = loadRecentKingdoms();
    if (storedRecent.length > 0) {
      setRecentKingdoms(storedRecent);
    }
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