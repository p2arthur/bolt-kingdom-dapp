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

// Add event to shared events
export const addEvent = (event: Omit<RecentEvent, 'id' | 'timestamp'>) => {
  const newEvent: RecentEvent = {
    ...event,
    id: Date.now().toString(),
    timestamp: Date.now()
  }
  
  console.log('Adding event:', newEvent)
  sharedEvents.push([newEvent])
}

// Add kingdom to shared projects
export const addKingdom = (kingdom: any) => {
  console.log('Adding kingdom to shared projects:', kingdom)
  sharedProjects.push([kingdom])
  
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
}

// Add proposal to shared proposals
export const addProposal = (proposal: any) => {
  console.log('Adding proposal to shared proposals:', proposal)
  sharedProposals.push([proposal])
  
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
  return sharedProjects.toArray()
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

// Subscribe to changes
sharedProjects.observe(() => {
  console.log('Projects updated:', sharedProjects.toArray())
})

sharedProposals.observe(() => {
  console.log('Proposals updated:', sharedProposals.toArray())
})

sharedEvents.observe(() => {
  console.log('Events updated:', sharedEvents.toArray())
})

export { ydoc, provider, sharedProjects, sharedProposals, sharedEvents }