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
  initializeFromStorage,
  addEvent
} from '../lib/yjs';
import { fetchAlgorandKingdoms } from '../lib/algorand';

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
  isAlgorand?: boolean;
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
  isLoadingAlgorand: boolean;
  getKingdom: (id: string) => Kingdom | undefined;
  getProposal: (id: string) => Proposal | undefined;
  updateKingdoms: () => void;
  updateProposals: () => void;
  updateEvents: () => void;
  refreshData: () => void;
  refreshAlgorandData: () => Promise<void>;
}

const KingdomContext = createContext<KingdomContextType | undefined>(undefined);

export function KingdomProvider({ children }: { children: React.ReactNode }) {
  const [kingdoms, setKingdoms] = useState<Kingdom[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [favoriteKingdoms, setFavoriteKingdoms] = useState<Kingdom[]>([]);
  const [isLoadingAlgorand, setIsLoadingAlgorand] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [algorandKingdoms, setAlgorandKingdoms] = useState<Kingdom[]>([]);

  const updateKingdoms = () => {
    // Get kingdoms from YJS array (RTC-synced kingdoms)
    const rtcKingdoms = sharedProjects.toArray();
    const favorites = JSON.parse(localStorage.getItem('kingdom_favorites') || '[]');
    
    console.log('🏰 KingdomContext - RTC kingdoms:', rtcKingdoms);
    console.log('🏰 KingdomContext - Algorand kingdoms:', algorandKingdoms);
    
    // Combine Algorand base kingdoms with RTC-synced kingdoms
    const combinedKingdoms = [...algorandKingdoms, ...rtcKingdoms];
    
    // Update kingdoms list (newest first)
    const reversedKingdoms = [...combinedKingdoms].reverse();
    console.log('🏰 KingdomContext - Setting combined kingdoms state:', reversedKingdoms);
    setKingdoms(reversedKingdoms);
    
    // Update favorites
    setFavoriteKingdoms(combinedKingdoms.filter(kingdom => favorites.includes(kingdom.id)));
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

  const refreshAlgorandData = async () => {
    setIsLoadingAlgorand(true);
    try {
      console.log('🌐 KingdomContext - Refreshing Algorand data...');
      const algorandData = await fetchAlgorandKingdoms();
      
      if (algorandData.length > 0) {
        console.log('🏰 KingdomContext - Setting Algorand kingdoms:', algorandData);
        setAlgorandKingdoms(algorandData);
        
        // Add events for new Algorand kingdoms
        algorandData.forEach(kingdom => {
          addEvent({
            type: EVENT_TYPES.ALGORAND_KINGDOM_DISCOVERED,
            title: `Algorand Kingdom: ${kingdom.name}`,
            description: `${kingdom.name} discovered on Algorand testnet`,
            relatedId: kingdom.id,
            creator: kingdom.creator,
            metadata: {
              features: kingdom.features || [],
              colors: { 
                primaryColor: kingdom.primaryColor, 
                secondaryColor: kingdom.secondaryColor, 
                accentColor: kingdom.accentColor 
              },
              isAlgorand: true
            }
          });
        });
      }
    } catch (error) {
      console.error('❌ Error refreshing Algorand data:', error);
    } finally {
      setIsLoadingAlgorand(false);
    }
  };

  const refreshData = () => {
    console.log('🔄 KingdomContext - Refreshing all data...');
    
    // Re-initialize from storage to ensure we have latest data
    initializeFromStorage();
    
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
    
    // Initialize from localStorage
    initializeFromStorage();
    
    // Load initial data
    updateProposals();
    updateEvents();
    
    // Load Algorand data first, then update kingdoms
    refreshAlgorandData();
    
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

    setIsInitialized(true);

    // Cleanup observers on unmount
    return () => {
      sharedProjects.unobserve(projectsObserver);
      sharedProposals.unobserve(proposalsObserver);
      sharedEvents.unobserve(eventsObserver);
    };
  }, [isInitialized]);

  // Update kingdoms when Algorand data changes
  useEffect(() => {
    if (algorandKingdoms.length > 0) {
      console.log('🌐 KingdomContext - Algorand kingdoms updated, refreshing combined list');
      updateKingdoms();
    }
  }, [algorandKingdoms]);

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
      isLoadingAlgorand,
      getKingdom,
      getProposal,
      updateKingdoms,
      updateProposals,
      updateEvents,
      refreshData,
      refreshAlgorandData
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