import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, MapPin, Clock, Trash2, Grid, List } from 'lucide-react';
import useFavoritesStore from '../store/favoritesStore';
import EventCard from '../Components/EventCard';
import { toast } from 'react-toastify';

const SavedEvents = () => {
  const navigate = useNavigate();
  const { getFavorites, removeFavorite, clearFavorites } = useFavoritesStore();
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (eventId, eventName) => {
    if (window.confirm(`Remove "${eventName}" from favorites?`)) {
      removeFavorite(eventId);
      setFavorites(getFavorites());
      toast.success('Removed from favorites');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all favorites? This cannot be undone.')) {
      clearFavorites();
      setFavorites([]);
      toast.success('All favorites cleared');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Saved Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your collection of {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-900/50 rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Saved Events Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring events and save the ones that interest you. Your favorites will appear here.
            </p>
            <Link
              to="/event-listings"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              <Calendar className="w-5 h-5" />
              Browse Events
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium">
                All ({favorites.length})
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                Upcoming ({favorites.filter(e => new Date(e.event_start_date) > new Date()).length})
              </span>
              <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                Past ({favorites.filter(e => new Date(e.event_start_date) <= new Date()).length})
              </span>
            </div>

            {/* Events Grid/List */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {favorites.map((event, index) => (
                <div key={event.id} className="relative group">
                  {viewMode === 'grid' ? (
                    <>
                      <EventCard event={event} index={index} viewMode="grid" />
                      <button
                        onClick={() => handleRemove(event.id, event.event_title)}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      <EventCard event={event} index={index} viewMode="list" />
                      <button
                        onClick={() => handleRemove(event.id, event.event_title)}
                        className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 z-10"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedEvents;
