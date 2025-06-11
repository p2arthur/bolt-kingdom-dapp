import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  sharedProjects, 
  sharedProposals, 
  sharedEvents, 
  getAllKingdoms, 
  getAllProposals, 
  getAllEvents, 
  RecentEvent, 
  EVENT_TYPES 
} from '../lib/yjs';

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

interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string;
  expiresAt: Date;
  votes?: {
    yes: string[];
    no: string[];
  };
}

interface KingdomContextType {
  kingdoms: Kingdom[];
  proposals: Proposal[];
  recentEvents: RecentEvent[];
  favoriteKingdoms: Kingdom[];
  getKingdom: (id: string) => Kingdom | undefined;
  getProposal: (id: string) => Proposal | undefined;
  updateKingdoms: () => void;
  updateProposals: () => void;
  updateEvents: () => void;
}

const KingdomContext = createContext<KingdomContextType | undefined>(undefined);

// Local storage keys
const RECENT_EVENTS_KEY = 'kingdom_recent_events';
const RECENT_EVENTS_MAX = 8; // Maximum number of recent events to keep

export function KingdomProvider({ children }: { children: React.ReactNode }) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
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
    const allKingdoms = getAllKingdoms();
    const favorites = JSON.parse(localStorage.getItem('kingdom_favorites') || '[]');
    
    console.log('Updating kingdoms from shared projects:', allKingdoms);
    
    // Update kingdoms list (newest first)
    const reversedKingdoms = [...allKingdoms].reverse();
    setKingdoms(reversedKingdoms);
    
    // Update favorites
    setFavoriteKingdoms(allKingdoms.filter(kingdom => favorites.includes(kingdom.id)));
  };

  const updateProposals = () => {
    const allProposals = getAllProposals();
    console.log('Updating proposals from shared proposals:', allProposals);
    
    // Update proposals list (newest first)
    const reversedProposals = [...allProposals].reverse();
    setProposals(reversedProposals);
  };

  const updateEvents = () => {
    const allEvents = getAllEvents();
    const storedEvents = loadRecentEvents();
    
    console.log('Updating events - shared:', allEvents, 'stored:', storedEvents);
    
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

  const getProposal = (id: string) => {
    return proposals.find(proposal => proposal.id === id);
  };

  // Initialize on mount
  useEffect(() => {
    console.log('KingdomProvider initializing...');
    
    // Load initial data
    updateKingdoms();
    updateProposals();
    updateEvents();
    
    // Set up observers for real-time updates
    const projectsObserver = () => {
      console.log('Projects changed, updating kingdoms...');
      updateKingdoms();
    };

    const proposalsObserver = () => {
      console.log('Proposals changed, updating proposals...');
      updateProposals();
    };

    const eventsObserver = () => {
      console.log('Events changed, updating events...');
      updateEvents();
    };

    sharedProjects.observe(projectsObserver);
    sharedProposals.observe(proposalsObserver);
    sharedEvents.observe(eventsObserver);

    // Cleanup observers on unmount
    return () => {
      sharedProjects.unobserve(projectsObserver);
      sharedProposals.unobserve(proposalsObserver);
      sharedEvents.unobserve(eventsObserver);
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
      proposals,
      recentEvents,
      favoriteKingdoms,
      getKingdom,
      getProposal,
      updateKingdoms,
      updateProposals,
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