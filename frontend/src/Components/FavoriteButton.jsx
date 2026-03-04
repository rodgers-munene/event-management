import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import useFavoritesStore from '../../store/favoritesStore';
import { toast } from 'react-toastify';

const FavoriteButton = ({ event, variant = 'icon' }) => {
  const { isFavorite, toggleFavorite, favorites } = useFavoritesStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const favorite = isFavorite(event.id);

  const handleToggle = () => {
    const added = toggleFavorite(event);
    if (added) {
      toast.success('Added to favorites!');
    } else {
      toast.success('Removed from favorites');
    }
  };

  if (variant === 'dropdown') {
    return (
      <>
        <button
          onClick={() => setShowConfirm(!showConfirm)}
          className={`p-2 rounded-xl transition-colors ${
            favorite
              ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          } hover:bg-red-100 dark:hover:bg-red-900/30`}
        >
          <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500' : ''}`} />
        </button>

        {showConfirm && favorite && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50 min-w-[200px]">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Remove "{event.event_title}" from favorites?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleToggle();
                  setShowConfirm(false);
                }}
                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl transition-all hover:scale-110 ${
        favorite
          ? 'bg-red-100 dark:bg-red-900/30 text-red-500'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30'
      }`}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500' : ''}`} />
    </button>
  );
};

export default FavoriteButton;
