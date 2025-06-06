import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sword } from 'lucide-react';
import RecentProjectCard from './RecentProjectCard';

interface RecentKingdomsListProps {
  recentProjects: any[];
}

export default function RecentKingdomsList({ recentProjects }: RecentKingdomsListProps) {
  return (
    <div className="fixed top-20 left-0 right-0 z-40 h-14 bg-[#f5a105]/95 backdrop-blur-lg border-b-4 border-amber-950 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="flex items-center gap-3 shrink-0 mr-8">
          <div className="p-1.5 rounded-xl bg-amber-950">
            <Sword className="w-4 h-4 text-[#f5a105]" />
          </div>
          <div>
            <span className="text-sm font-bold text-amber-950">Recent Kingdoms</span>
            <p className="text-xs text-amber-950/70">Latest conquests in the realm</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {recentProjects.length > 0 ? (
              <div className="flex gap-4 min-w-max pr-4">
                {recentProjects.map((project, index) => (
                  <RecentProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-950/70">
                <Sword className="w-4 h-4" />
                <span className="text-sm">No kingdoms have been forged yet</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}