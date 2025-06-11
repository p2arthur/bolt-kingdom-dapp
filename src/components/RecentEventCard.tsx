import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Scroll, Vote, Coins, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentEvent, EVENT_TYPES } from '../lib/yjs';
import { useKingdom } from '../contexts/KingdomContext';

interface RecentEventCardProps {
  event: RecentEvent;
  index: number;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case EVENT_TYPES.KINGDOM_CREATED:
      return Crown;
    case EVENT_TYPES.PROPOSAL_CREATED:
      return Scroll;
    case EVENT_TYPES.VOTE_CAST:
      return Vote;
    case EVENT_TYPES.STAKE_MADE:
      return Coins;
    default:
      return Zap;
  }
};

const getEventColors = (type: string, index: number, metadata?: any) => {
  if (type === EVENT_TYPES.KINGDOM_CREATED) {
    // Use kingdom's custom colors if available
    if (metadata?.colors?.primaryColor && metadata?.colors?.secondaryColor) {
      return {
        background: `linear-gradient(135deg, ${metadata.colors.primaryColor}, ${metadata.colors.secondaryColor})`,
        border: metadata.colors.accentColor || '#C084FC'
      };
    }
    
    return {
      background: 'linear-gradient(135deg, #A855F7, #F0ABFC)',
      border: '#C084FC'
    };
  }
  
  if (type === EVENT_TYPES.PROPOSAL_CREATED) {
    return {
      background: 'linear-gradient(135deg, #E879F9, #F3E8FF)',
      border: '#C084FC'
    };
  }
  
  return {
    background: 'rgba(245, 161, 5, 0.3)',
    border: 'rgba(146, 64, 14, 0.5)'
  };
};

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export default function RecentEventCard({ event, index }: RecentEventCardProps) {
  const { getKingdom, getProposal } = useKingdom();
  const Icon = getEventIcon(event.type);
  const colors = getEventColors(event.type, index, event.metadata);
  const isKingdomEvent = event.type === EVENT_TYPES.KINGDOM_CREATED;
  const isProposalEvent = event.type === EVENT_TYPES.PROPOSAL_CREATED;

  // Check if the related item still exists for events with links
  const kingdom = isKingdomEvent && event.relatedId ? getKingdom(event.relatedId) : null;
  const proposal = isProposalEvent && event.relatedId ? getProposal(event.relatedId) : null;
  
  const isValidKingdomLink = isKingdomEvent && kingdom;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1 }}
      className={`flex items-center gap-3 py-2 px-4 rounded-lg ${(isValidKingdomLink) ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
      style={{
        background: colors.background,
        border: `2px solid ${colors.border}`,
      }}
    >
      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{event.title}</span>
          {isKingdomEvent && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">KINGDOM</span>
            </div>
          )}
          {isProposalEvent && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm">
              <Scroll className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">PROPOSAL</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Shield className="w-3 h-3" />
          <span>{event.creator?.slice(0, 8)}...</span>
          <span>•</span>
          <span>{formatTimeAgo(event.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );

  // If it's a valid kingdom event with a related ID, make it clickable
  if (isValidKingdomLink) {
    return (
      <Link to={`/project/${event.relatedId}`}>
        {cardContent}
      </Link>
    );
  }

  // For other events, just display the card
  return cardContent;
}