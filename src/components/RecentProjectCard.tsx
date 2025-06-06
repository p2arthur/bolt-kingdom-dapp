import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateLevel } from '../lib/yjs';
import { isFavorited } from '../lib/favorites';
import FavoriteButton from './FavoriteButton';

interface RecentProjectCardProps {
  project: {
    id: string;
    name: string;
    creator: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  index: number;
}

export default function RecentProjectCard({ project, index }: RecentProjectCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <FavoriteButton 
          projectId={project.id}
          className="!bg-amber-950 !border-amber-600 !text-amber-100 scale-75"
        />
      </div>
      <Link to={`/project/${project.id}`}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3 py-1 px-3 rounded-lg"
          style={{
            background: index === 0 
              ? `linear-gradient(135deg, ${project.primaryColor || '#A855F7'}, ${project.secondaryColor || '#F0ABFC'})`
              : 'rgba(255, 255, 255, 0.1)',
            border: `3px solid ${index === 0 ? (project.accentColor || '#C084FC') : 'rgba(120, 53, 15, 0.3)'}`,
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{project.name}</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded-full backdrop-blur-sm">
                <Star className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">Lvl {calculateLevel(project)}</span>
              </div>
              {index === 0 && (
                <span className="px-1.5 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full animate-pulse backdrop-blur-sm">NEW</span>
              )}
              {isFavorited(project.id) && (
                <Star className="w-3 h-3 fill-white text-white" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <Shield className="w-3 h-3" />
              <span>{project.creator}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}