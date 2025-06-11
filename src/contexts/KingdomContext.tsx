import React, { createContext, useContext, useState, useEffect } from 'react';
import { sharedProjects, sharedEvents, RecentEvent, EVENT_TYPES } from '../lib/yjs';

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
  recentEvents: RecentEvent[];
  favoriteKingdoms: Kingdom[];
  getKingdom: (id: string) => Kingdom | undefined;
  updateKingdoms: () => void;
  updateEvents: () => void;
}

const KingdomContext = createContext<KingdomContextType | undefined>(undefined);

// Local storage keys
const RECENT_EVENTS_KEY = 'kingdom_recent_events';
const RECENT_EVENTS_MAX = 8; // Maximum number of recent events to keep

export function KingdomProvider({ children }: { children: React.ReactNode }) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [favoriteKingdoms, setFavoriteKingdoms] = useState<Kingdom[]>([]);

  // Load recent events from localStorage
  const loadRecentEvents = () => {
    try {
      const stored = localStorage.getItem(RECENT_EVENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recent events:', error);
      return [];
    }
  };

  // Save recent events to localStorage
  const saveRecentEvents = (events: RecentEvent[]) => {
    try {
      localStorage.setItem(RECENT_EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving recent events:', error);
    }
  };

  const updateKingdoms = () => {
    const allKingdoms = sharedProjects.toArray();
    const favorites = JSON.parse(localStorage.getItem('kingdom_favorites') || '[]');
    
    // Update kingdoms list
    const reversedKingdoms = [...allKingdoms].reverse();
    setKingdoms(reversedKingdoms);
    
    // Update favorites
    setFavoriteKingdoms(allKingdoms.filter(kingdom => favorites.includes(kingdom.id)));
  };

  const updateEvents = () => {
    const allEvents = sharedEvents.toArray();
    const storedEvents = loadRecentEvents();
    
    // Combine shared events with stored events, remove duplicates, and sort by timestamp
    const combinedEvents = [...allEvents, ...storedEvents];
    const uniqueEvents = combinedEvents.filter((event, index, self) => 
      index === self.findIndex(e => e.id === event.id)
    );
    
    // Sort by timestamp (newest first) and limit
    const sortedEvents = uniqueEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, RECENT_EVENTS_MAX);
    
    setRecentEvents(sortedEvents);
    saveRecentEvents(sortedEvents);
  };

  const getKingdom = (id: string) => {
    return kingdoms.find(kingdom => kingdom.id === id);
  };

  // Initialize on mount
  useEffect(() => {
    // Load initial data
    updateKingdoms();
    updateEvents();
    
    // Set up observers
    const unsubscribeProjects = sharedProjects.observe(() => {
      updateKingdoms();
    });

    const unsubscribeEvents = sharedEvents.observe(() => {
      updateEvents();
    });

    // Cleanup observers on unmount
    return () => {
      if (typeof unsubscribeProjects === 'function') {
        unsubscribeProjects();
      }
      if (typeof unsubscribeEvents === 'function') {
        unsubscribeEvents();
      }
    };
  }, []);

  // Load recent events on mount to ensure they're available immediately
  useEffect(() => {
    const storedEvents = loadRecentEvents();
    if (storedEvents.length > 0) {
      setRecentEvents(storedEvents);
    }
  }, []);

  return (
    <KingdomContext.Provider value={{
      kingdoms,
      recentEvents,
      favoriteKingdoms,
      getKingdom,
      updateKingdoms,
      updateEvents
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