import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

// Create a shared document
const ydoc = new Y.Doc()

// Connect to peers with WebRTC
const provider = new WebrtcProvider('launcherai-projects', ydoc, {
  signaling: ['wss://signaling.yjs.dev']
})

// Create shared arrays
const sharedProjects = ydoc.getArray('projects')
const sharedProposals = ydoc.getArray('proposals')
const sharedEvents = ydoc.getArray('events')

// Local storage keys
const KINGDOMS_STORAGE_KEY = 'kingdom_kingdoms'
const PROPOSALS_STORAGE_KEY = 'kingdom_proposals'
const EVENTS_STORAGE_KEY = 'kingdom_events'

// Event types
export const EVENT_TYPES = {
  KINGDOM_CREATED: 'kingdom_created',
  PROPOSAL_CREATED: 'proposal_created',
  VOTE_CAST: 'vote_cast',
  STAKE_MADE: 'stake_made'
} as const

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES]

export interface RecentEvent {
  id: string
  type: EventType
  title: string
  description: string
  timestamp: number
  relatedId?: string // ID of related kingdom, proposal, etc.
  creator?: string
  metadata?: any
}

// Local storage functions
export const saveKingdomsToStorage = (kingdoms: any[]) => {
  try {
    localStorage.setItem(KINGDOMS_STORAGE_KEY, JSON.stringify(kingdoms))
    console.log('💾 Saved kingdoms to localStorage:', kingdoms.length, kingdoms)
  } catch (error) {
    console.error('Error saving kingdoms to localStorage:', error)
  }
}

export const loadKingdomsFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(KINGDOMS_STORAGE_KEY)
    const kingdoms = stored ? JSON.parse(stored) : []
    console.log('📂 Loaded kingdoms from localStorage:', kingdoms.length, kingdoms)
    return kingdoms
  } catch (error) {
    console.error('Error loading kingdoms from localStorage:', error)
    return []
  }
}

export const saveProposalsToStorage = (proposals: any[]) => {
  try {
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals))
    console.log('💾 Saved proposals to localStorage:', proposals.length)
  } catch (error) {
    console.error('Error saving proposals to localStorage:', error)
  }
}

export const loadProposalsFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(PROPOSALS_STORAGE_KEY)
    const proposals = stored ? JSON.parse(stored) : []
    console.log('📂 Loaded proposals from localStorage:', proposals.length)
    return proposals
  } catch (error) {
    console.error('Error loading proposals from localStorage:', error)
    return []
  }
}

export const saveEventsToStorage = (events: RecentEvent[]) => {
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events))
    console.log('💾 Saved events to localStorage:', events.length)
  } catch (error) {
    console.error('Error saving events to localStorage:', error)
  }
}

export const loadEventsFromStorage = (): RecentEvent[] => {
  try {
    const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
    const events = stored ? JSON.parse(stored) : []
    console.log('📂 Loaded events from localStorage:', events.length)
    return events
  } catch (error) {
    console.error('Error loading events from localStorage:', error)
    return []
  }
}

// Clear and reinitialize YJS arrays with localStorage data
export const initializeFromStorage = () => {
  console.log('🚀 Initializing YJS arrays from localStorage...')
  
  // Clear existing arrays first
  sharedProjects.delete(0, sharedProjects.length)
  sharedProposals.delete(0, sharedProposals.length)
  sharedEvents.delete(0, sharedEvents.length)
  
  // Load from localStorage and populate YJS arrays
  const storedKingdoms = loadKingdomsFromStorage()
  const storedProposals = loadProposalsFromStorage()
  const storedEvents = loadEventsFromStorage()
  
  if (storedKingdoms.length > 0) {
    sharedProjects.insert(0, storedKingdoms)
    console.log('🏰 Initialized kingdoms in YJS:', storedKingdoms.length)
  }
  
  if (storedProposals.length > 0) {
    sharedProposals.insert(0, storedProposals)
    console.log('📜 Initialized proposals in YJS:', storedProposals.length)
  }
  
  if (storedEvents.length > 0) {
    sharedEvents.insert(0, storedEvents)
    console.log('⚡ Initialized events in YJS:', storedEvents.length)
  }
  
  console.log('✅ YJS initialization complete')
  console.log('🏰 Final kingdoms array:', sharedProjects.toArray())
  console.log('📜 Final proposals array:', sharedProposals.toArray())
  console.log('⚡ Final events array:', sharedEvents.toArray())
}

// Add event to shared events
export const addEvent = (event: Omit<RecentEvent, 'id' | 'timestamp'>) => {
  const newEvent: RecentEvent = {
    ...event,
    id: Date.now().toString(),
    timestamp: Date.now()
  }
  
  console.log('📝 Adding event to YJS:', newEvent)
  sharedEvents.push([newEvent])
  
  // Also save to localStorage immediately
  const allEvents = sharedEvents.toArray()
  saveEventsToStorage(allEvents)
  
  console.log('📝 Events array after push:', sharedEvents.toArray())
}

// Add kingdom to shared projects
export const addKingdom = (kingdom: any) => {
  console.log('🏰 Adding kingdom to YJS shared projects:', kingdom)
  console.log('🏰 YJS projects array before push:', sharedProjects.toArray())
  console.log('🏰 YJS projects array length before push:', sharedProjects.length)
  
  // Add to YJS array
  sharedProjects.push([kingdom])
  
  // Immediately save to localStorage
  const allKingdoms = sharedProjects.toArray()
  saveKingdomsToStorage(allKingdoms)
  
  console.log('🏰 YJS projects array after push:', sharedProjects.toArray())
  console.log('🏰 YJS projects array length after push:', sharedProjects.length)
  console.log('🏰 Saved to localStorage:', allKingdoms)
  
  // Also add an event for the kingdom creation
  addEvent({
    type: EVENT_TYPES.KINGDOM_CREATED,
    title: `New Kingdom: ${kingdom.name}`,
    description: `${kingdom.name} has been forged with ${kingdom.features?.map(f => f.name).join(', ') || 'custom features'}`,
    relatedId: kingdom.id,
    creator: kingdom.creator,
    metadata: {
      features: kingdom.features || [],
      colors: { 
        primaryColor: kingdom.primaryColor, 
        secondaryColor: kingdom.secondaryColor, 
        accentColor: kingdom.accentColor 
      }
    }
  })
  
  console.log('🏰 Kingdom creation complete with event')
}

// Add proposal to shared proposals
export const addProposal = (proposal: any) => {
  console.log('📜 Adding proposal to YJS shared proposals:', proposal)
  sharedProposals.push([proposal])
  
  // Save to localStorage immediately
  const allProposals = sharedProposals.toArray()
  saveProposalsToStorage(allProposals)
  
  // Also add an event for the proposal creation
  addEvent({
    type: EVENT_TYPES.PROPOSAL_CREATED,
    title: `New Proposal: ${proposal.title}`,
    description: `${proposal.creator.slice(0, 8)}... created a new proposal`,
    relatedId: proposal.id,
    creator: proposal.creator,
    metadata: {
      proposalTitle: proposal.title,
      expiresAt: proposal.expiresAt
    }
  })
}

// Get all kingdoms
export const getAllKingdoms = () => {
  const kingdoms = sharedProjects.toArray()
  console.log('🔍 getAllKingdoms called, returning:', kingdoms)
  return kingdoms
}

// Get all proposals
export const getAllProposals = () => {
  return sharedProposals.toArray()
}

// Get all events
export const getAllEvents = () => {
  return sharedEvents.toArray()
}

// Calculate project level based on progress and features
export const calculateLevel = (project) => {
  const baseLevel = Math.floor(project.fundingProgress / 10);
  const featuresBonus = project.features ? project.features.length : 0;
  return Math.min(100, baseLevel + featuresBonus);
};

// Calculate reputation based on various factors
export const calculateReputation = (project) => {
  const progressPoints = project.fundingProgress * 10;
  const treasuryPoints = parseInt(project.marketCap.replace(/[^0-9]/g, '')) / 1000;
  const featuresPoints = (project.features?.length || 0) * 100;
  
  return Math.floor(progressPoints + treasuryPoints + featuresPoints);
};

// Subscribe to changes and save to localStorage
sharedProjects.observe((event) => {
  console.log('🔄 YJS Projects observer triggered:', event)
  const allKingdoms = sharedProjects.toArray()
  saveKingdomsToStorage(allKingdoms)
  console.log('🔄 Current projects array:', allKingdoms)
})

sharedProposals.observe((event) => {
  console.log('🔄 YJS Proposals observer triggered:', event)
  const allProposals = sharedProposals.toArray()
  saveProposalsToStorage(allProposals)
  console.log('🔄 Current proposals array:', allProposals)
})

sharedEvents.observe((event) => {
  console.log('🔄 YJS Events observer triggered:', event)
  const allEvents = sharedEvents.toArray()
  saveEventsToStorage(allEvents)
  console.log('🔄 Current events array:', allEvents)
})

// Initialize on module load
initializeFromStorage()

export { ydoc, provider, sharedProjects, sharedProposals, sharedEvents }