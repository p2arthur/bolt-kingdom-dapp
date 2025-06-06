// Local storage key for favorites
const FAVORITES_KEY = 'kingdom_favorites';

// Get favorites from localStorage
export const getFavorites = (): string[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

// Save favorites to localStorage
export const saveFavorites = (favorites: string[]) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

// Toggle favorite status
export const toggleFavorite = (projectId: string): boolean => {
  const favorites = getFavorites();
  const isFavorited = favorites.includes(projectId);
  
  if (isFavorited) {
    const newFavorites = favorites.filter(id => id !== projectId);
    saveFavorites(newFavorites);
    return false;
  } else {
    saveFavorites([...favorites, projectId]);
    return true;
  }
};

// Check if project is favorited
export const isFavorited = (projectId: string): boolean => {
  const favorites = getFavorites();
  return favorites.includes(projectId);
};