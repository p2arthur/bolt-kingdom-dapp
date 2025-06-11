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
  
  sharedEvents.push([newEvent])
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