import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

// Create a shared document
const ydoc = new Y.Doc()

// Connect to peers with WebRTC
const provider = new WebrtcProvider('launcherai-projects', ydoc, {
  signaling: ['wss://signaling.yjs.dev']
})

// Create a shared array for projects
const sharedProjects = ydoc.getArray('projects')

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

export { ydoc, provider, sharedProjects }