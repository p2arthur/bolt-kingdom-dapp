import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import RecentEventCard from './RecentEventCard';
import { RecentEvent } from '../lib/yjs';

interface RecentEventsListProps {
  recentEvents: RecentEvent[];
}

export default function RecentEventsList({ recentEvents }: RecentEventsListProps) {
  // Don't render if no recent events
  if (!recentEvents || recentEvents.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 h-14 bg-[#f5a105]/95 backdrop-blur-lg border-b-4 border-amber-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="flex items-center gap-3 shrink-0 mr-8">
          <div className="p-1.5 rounded-xl bg-amber-950">
            <Zap className="w-4 h-4 text-[#f5a105]" />
          </div>
          <div>
            <span className="text-sm font-bold text-amber-950">Recent Events</span>
            <p className="text-xs text-amber-950/70">Latest happenings in the realm</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            <div className="flex gap-4 min-w-max pr-4">
              {recentEvents.map((event, index) => (
                <RecentEventCard 
                  key={`${event.id}-${index}`} 
                  event={event} 
                  index={index}
                />
              ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}