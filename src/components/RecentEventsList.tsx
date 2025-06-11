import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import RecentEventCard from './RecentEventCard';
import { RecentEvent } from '../lib/yjs';

interface RecentEventsListProps {
  recentEvents: RecentEvent[];
}

export default function RecentEventsList({ recentEvents }: RecentEventsListProps) {
  return (
    <div className="fixed top-20 left-0 right-0 z-40 h-14 bg-[#f5a105]/95 backdrop-blur-lg border-b-4 border-amber-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="flex items-center gap-3 shrink-0 mr-8">
          <div className="p-1.5 rounded-xl bg-amber-950">
            <Zap className="w-4 h-4 text-[#f5a105]" />
          </div>
          <div>
            <span className="text-sm font-bold text-amber-950">Recent Events</span>
            <p className="text-xs text-amber-950/70">
              {recentEvents && recentEvents.length > 0 
                ? `${recentEvents.length} recent activities` 
                : 'No recent activity - create something!'
              }
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            <div className="flex gap-4 min-w-max pr-4">
              {recentEvents && recentEvents.length > 0 ? (
                recentEvents.map((event, index) => (
                  <RecentEventCard 
                    key={`${event.id}-${index}`} 
                    event={event} 
                    index={index}
                  />
                ))
              ) : (
                <div className="flex items-center gap-3 py-1 px-3 rounded-lg bg-white/10 border-2 border-white/20 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <div className="font-bold text-white/70 text-sm">No Recent Events</div>
                    <div className="text-xs text-white/50">Create a kingdom or proposal to see activity</div>
                  </div>
                </div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}