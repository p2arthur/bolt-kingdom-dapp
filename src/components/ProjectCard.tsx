import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateLevel } from '../lib/yjs';
import { isFavorited } from '../lib/favorites';
import FavoriteButton from './FavoriteButton';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    creator: string;
    description: string;
    fundingProgress: number;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    isAlgorand?: boolean;
  };
  isNew?: boolean;
}

export default function ProjectCard({ project, isNew = false }: ProjectCardProps) {
  const cardStyle = {
    background: project.primaryColor && project.secondaryColor 
      ? `linear-gradient(135deg, ${project.primaryColor}, ${project.secondaryColor})`
      : 'linear-gradient(135deg, #A855F7, #F0ABFC)',
    borderColor: project.accentColor || '#C084FC'
  };

  return (
    <Link to={`/project/${project.id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`medieval-card !p-4 ${isNew ? 'animate-kingdom-blink' : ''}`}
        style={cardStyle}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            {project.isAlgorand ? (
              <Zap className="w-5 h-5 text-white" />
            ) : (
              <Crown className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-white truncate">{project.name}</h3>
              {project.isAlgorand && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full backdrop-blur-sm">
                  <img 
                    src="https://algorand.com/static/algorand-logo-white-6e6e611912fccb44f0f9d2aeaac193e8.svg" 
                    alt="Algorand" 
                    className="h-3"
                  />
                  <span className="text-xs font-bold text-white">ALGO</span>
                </div>
              )}
              {isNew && (
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full animate-pulse backdrop-blur-sm">
                  NEW
                </span>
              )}
              {isFavorited(project.id) && (
                <Star className="w-4 h-4 fill-white text-white shrink-0" />
              )}
            </div>
            <p className="text-sm text-white/90 mb-2 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-white/90" />
                <span className="text-white/90 truncate">{project.creator}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-white" />
                <span className="font-bold text-white">Lvl {calculateLevel(project)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/90">Progress</span>
                <span className="font-bold text-white">{project.fundingProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className={`h-full ${isNew ? 'animate-progress-pulse' : ''}`}
                  style={{ 
                    width: `${project.fundingProgress}%`,
                    backgroundColor: project.accentColor || '#C084FC'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FavoriteButton 
              projectId={project.id}
              className="!p-2 !bg-white/10 !border-white/20 !text-white hover:!bg-white/20"
            />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}