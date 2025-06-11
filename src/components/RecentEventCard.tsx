import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Scroll, Vote, Coins, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecentEvent, EVENT_TYPES } from '../lib/yjs';

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

const getEventColors = (type: string, index: number) => {
  if (type === EVENT_TYPES.KINGDOM_CREATED) {
    return {
      background: index === 0 
        ? 'linear-gradient(135deg, #A855F7, #F0ABFC)'
        : 'rgba(168, 85, 247, 0.2)',
      border: index === 0 ? '#C084FC' : 'rgba(120, 53, 15, 0.3)'
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
  const Icon = getEventIcon(event.type);
  const colors = getEventColors(event.type, index);
  const isKingdomEvent = event.type === EVENT_TYPES.KINGDOM_CREATED;
  const isNewKingdom = isKingdomEvent && index === 0;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-3 py-1 px-3 rounded-lg"
      style={{
        background: colors.background,
        border: `3px solid ${colors.border}`,
      }}
    >
      <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm">{event.title}</span>
          {isNewKingdom && (
            <span className="px-1.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full animate-pulse backdrop-blur-sm">
              NEW
            </span>
          )}
          {isKingdomEvent && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm">
              <Crown className="w-3 h-3 text-white" />
              <span className="text-xs font-bold text-white">KINGDOM</span>
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

  // If it's a kingdom event with a related ID, make it clickable
  if (isKingdomEvent && event.relatedId) {
    return (
      <Link to={`/project/${event.relatedId}`}>
        {cardContent}
      </Link>
    );
  }

  // For other events, just display the card
  return cardContent;
}