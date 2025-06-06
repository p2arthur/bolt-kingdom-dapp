import React from 'react';
import { Star } from 'lucide-react';
import { toggleFavorite, isFavorited } from '../lib/favorites';

interface FavoriteButtonProps {
  projectId: string;
  onToggle?: (isFavorited: boolean) => void;
  className?: string;
}

export default function FavoriteButton({ projectId, onToggle, className = '' }: FavoriteButtonProps) {
  const [favorite, setFavorite] = React.useState(isFavorited(projectId));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when inside a Link
    const newFavoriteStatus = toggleFavorite(projectId);
    setFavorite(newFavoriteStatus);
    onToggle?.(newFavoriteStatus);
  };

  return (
    <button
      onClick={handleClick}
      className={`medieval-button !px-3 !py-2 flex items-center gap-2 ${className}`}
      title={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
    >
      <Star className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
    </button>
  );
}