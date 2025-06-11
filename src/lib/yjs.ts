import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

// Create a shared document
const ydoc = new Y.Doc()

// Connect to peers with WebRTC - using a more specific room name
const provider = new WebrtcProvider('kingdomdapp-events-v2', ydoc, {
  signaling: ['wss://signaling.yjs.dev', 'wss://y-webrtc-signaling-eu.herokuapp.com', 'wss://y-webrtc-signaling-us.herokuapp.com']
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
  
  // Load from localStorage and populate YJS arrays if they're empty
  const storedKingdoms = loadKingdomsFromStorage()
  const storedProposals = loadProposalsFromStorage()
  const storedEvents = loadEventsFromStorage()
  
  // Only initialize if YJS arrays are empty (to avoid conflicts with RTC sync)
  if (sharedProjects.length === 0 && storedKingdoms.length > 0) {
    sharedProjects.insert(0, storedKingdoms)
    console.log('🏰 Initialized kingdoms in YJS:', storedKingdoms.length)
  }
  
  if (sharedProposals.length === 0 && storedProposals.length > 0) {
    sharedProposals.insert(0, storedProposals)
    console.log('📜 Initialized proposals in YJS:', storedProposals.length)
  }
  
  if (sharedEvents.length === 0 && storedEvents.length > 0) {
    sharedEvents.insert(0, storedEvents)
    console.log('⚡ Initialized events in YJS:', storedEvents.length)
  }
  
  console.log('✅ YJS initialization complete')
  console.log('🏰 Final kingdoms array:', sharedProjects.toArray())
  console.log('📜 Final proposals array:', sharedProposals.toArray())
  console.log('⚡ Final events array:', sharedEvents.toArray())
}

// Add event to shared events with RTC sync
export const addEvent = (event: Omit<RecentEvent, 'id' | 'timestamp'>) => {
  const newEvent: RecentEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // More unique ID
    timestamp: Date.now()
  }
  
  console.log('📝 Adding event to YJS with RTC sync:', newEvent)
  
  // Add to YJS array (this will sync via WebRTC)
  sharedEvents.push([newEvent])
  
  // Also save to localStorage for persistence
  const allEvents = sharedEvents.toArray()
  saveEventsToStorage(allEvents)
  
  console.log('📝 Events array after push:', sharedEvents.toArray())
  console.log('🌐 Event will sync to other clients via WebRTC')
}

// Add kingdom to shared projects with RTC sync
export const addKingdom = (kingdom: any) => {
  // Ensure unique ID
  const kingdomWithId = {
    ...kingdom,
    id: kingdom.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  console.log('🏰 Adding kingdom to YJS with RTC sync:', kingdomWithId)
  console.log('🏰 YJS projects array before push:', sharedProjects.toArray())
  console.log('🏰 YJS projects array length before push:', sharedProjects.length)
  
  // Add to YJS array (this will sync via WebRTC)
  sharedProjects.push([kingdomWithId])
  
  // Immediately save to localStorage for persistence
  const allKingdoms = sharedProjects.toArray()
  saveKingdomsToStorage(allKingdoms)
  
  console.log('🏰 YJS projects array after push:', sharedProjects.toArray())
  console.log('🏰 YJS projects array length after push:', sharedProjects.length)
  console.log('🏰 Saved to localStorage:', allKingdoms)
  console.log('🌐 Kingdom will sync to other clients via WebRTC')
  
  // Also add an event for the kingdom creation
  addEvent({
    type: EVENT_TYPES.KINGDOM_CREATED,
    title: `New Kingdom: ${kingdomWithId.name}`,
    description: `${kingdomWithId.name} has been forged with ${kingdomWithId.features?.map(f => f.name).join(', ') || 'custom features'}`,
    relatedId: kingdomWithId.id,
    creator: kingdomWithId.creator,
    metadata: {
      features: kingdomWithId.features || [],
      colors: { 
        primaryColor: kingdomWithId.primaryColor, 
        secondaryColor: kingdomWithId.secondaryColor, 
        accentColor: kingdomWithId.accentColor 
      }
    }
  })
  
  console.log('🏰 Kingdom creation complete with event and RTC sync')
}

// Add proposal to shared proposals with RTC sync
export const addProposal = (proposal: any) => {
  // Ensure unique ID
  const proposalWithId = {
    ...proposal,
    id: proposal.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  console.log('📜 Adding proposal to YJS with RTC sync:', proposalWithId)
  sharedProposals.push([proposalWithId])
  
  // Save to localStorage immediately for persistence
  const allProposals = sharedProposals.toArray()
  saveProposalsToStorage(allProposals)
  
  console.log('🌐 Proposal will sync to other clients via WebRTC')
  
  // Also add an event for the proposal creation
  addEvent({
    type: EVENT_TYPES.PROPOSAL_CREATED,
    title: `New Proposal: ${proposalWithId.title}`,
    description: `${proposalWithId.creator.slice(0, 8)}... created a new proposal`,
    relatedId: proposalWithId.id,
    creator: proposalWithId.creator,
    metadata: {
      proposalTitle: proposalWithId.title,
      expiresAt: proposalWithId.expiresAt
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
  const events = sharedEvents.toArray()
  console.log('🔍 getAllEvents called, returning:', events.length, 'events')
  return events
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

// Enhanced observers with RTC sync logging
sharedProjects.observe((event) => {
  console.log('🔄 YJS Projects observer triggered (RTC sync):', event)
  console.log('🔄 Event origin:', event.origin) // Will show if it's from local or remote
  const allKingdoms = sharedProjects.toArray()
  saveKingdomsToStorage(allKingdoms)
  console.log('🔄 Current projects array:', allKingdoms)
})

sharedProposals.observe((event) => {
  console.log('🔄 YJS Proposals observer triggered (RTC sync):', event)
  console.log('🔄 Event origin:', event.origin)
  const allProposals = sharedProposals.toArray()
  saveProposalsToStorage(allProposals)
  console.log('🔄 Current proposals array:', allProposals)
})

sharedEvents.observe((event) => {
  console.log('🔄 YJS Events observer triggered (RTC sync):', event)
  console.log('🔄 Event origin:', event.origin)
  const allEvents = sharedEvents.toArray()
  saveEventsToStorage(allEvents)
  console.log('🔄 Current events array:', allEvents)
})

// WebRTC provider status logging
provider.on('status', (event) => {
  console.log('🌐 WebRTC Provider Status:', event.status)
})

provider.on('peers', (event) => {
  console.log('🌐 WebRTC Connected Peers:', event.added, event.removed, event.webrtcPeers)
})

// Initialize on module load
initializeFromStorage()

export { ydoc, provider, sharedProjects, sharedProposals, sharedEvents }