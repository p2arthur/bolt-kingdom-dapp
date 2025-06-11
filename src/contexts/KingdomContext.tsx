import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  sharedProjects, 
  sharedProposals, 
  sharedEvents, 
  getAllKingdoms, 
  getAllProposals, 
  getAllEvents, 
  RecentEvent, 
  EVENT_TYPES,
  initializeFromStorage
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
  refreshData: () => void;
}

const KingdomContext = createContext<KingdomContextType | undefined>(undefined);

export function KingdomProvider({ children }: { children: React.ReactNode }) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [favoriteKingdoms, setFavoriteKingdoms] = useState<Kingdom[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateKingdoms = () => {
    // Get kingdoms from YJS array (which includes Algorand kingdoms + user-created ones)
    const allKingdoms = sharedProjects.toArray();
    const favorites = JSON.parse(localStorage.getItem('kingdom_favorites') || '[]');
    
    console.log('🏰 KingdomContext - Raw YJS kingdoms:', allKingdoms);
    console.log('🏰 KingdomContext - YJS array length:', sharedProjects.length);
    
    // Update kingdoms list (newest first)
    const reversedKingdoms = [...allKingdoms].reverse();
    console.log('🏰 KingdomContext - Setting kingdoms state:', reversedKingdoms);
    setKingdoms(reversedKingdoms);
    
    // Update favorites
    setFavoriteKingdoms(allKingdoms.filter(kingdom => favorites.includes(kingdom.id)));
  };

  const updateProposals = () => {
    const allProposals = getAllProposals();
    console.log('📜 KingdomContext - Updating proposals:', allProposals);
    
    // Update proposals list (newest first)
    const reversedProposals = [...allProposals].reverse();
    setProposals(reversedProposals);
  };

  const updateEvents = () => {
    const allEvents = getAllEvents();
    console.log('⚡ KingdomContext - Updating events:', allEvents);
    
    // Sort by timestamp (newest first) and limit to 8
    const sortedEvents = allEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);
    
    console.log('⚡ KingdomContext - Final events:', sortedEvents);
    setRecentEvents(sortedEvents);
  };

  const refreshData = () => {
    console.log('🔄 KingdomContext - Refreshing all data...');
    
    // Force update all states
    updateKingdoms();
    updateProposals();
    updateEvents();
  };

  const getKingdom = (id: string) => {
    const kingdom = kingdoms.find(kingdom => kingdom.id === id);
    console.log(`🔍 KingdomContext - Looking for kingdom ${id}:`, kingdom);
    return kingdom;
  };

  const getProposal = (id: string) => {
    return proposals.find(proposal => proposal.id === id);
  };

  // Initialize on mount
  useEffect(() => {
    if (isInitialized) return;
    
    console.log('🚀 KingdomProvider initializing...');
    
    // Initialize from localStorage and Algorand (async)
    const initializeAsync = async () => {
      await initializeFromStorage();
      
      // Load initial data after initialization
      updateKingdoms();
      updateProposals();
      updateEvents();
      
      setIsInitialized(true);
    };
    
    initializeAsync();
    
    // Set up observers for real-time updates
    const projectsObserver = (event) => {
      console.log('🔄 Projects YJS observer triggered in context:', event);
      // Small delay to ensure YJS has processed the change
      setTimeout(() => {
        updateKingdoms();
      }, 100);
    };

    const proposalsObserver = (event) => {
      console.log('🔄 Proposals YJS observer triggered in context:', event);
      setTimeout(() => {
        updateProposals();
      }, 100);
    };

    const eventsObserver = (event) => {
      console.log('🔄 Events YJS observer triggered in context:', event);
      setTimeout(() => {
        updateEvents();
      }, 100);
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
  }, [isInitialized]);

  // Debug effect to track kingdoms state changes
  useEffect(() => {
    console.log('🏰 KingdomContext - Kingdoms state updated:', kingdoms);
  }, [kingdoms]);

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
      updateEvents,
      refreshData
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