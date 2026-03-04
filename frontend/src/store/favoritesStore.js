import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      // Add to favorites
      addFavorite: (event) => {
        const exists = get().favorites.find((e) => e.id === event.id);
        if (exists) {
          return false;
        }

        set((state) => ({
          favorites: [event, ...state.favorites],
        }));
        return true;
      },

      // Remove from favorites
      removeFavorite: (eventId) => {
        set((state) => ({
          favorites: state.favorites.filter((e) => e.id !== eventId),
        }));
      },

      // Toggle favorite status
      toggleFavorite: (event) => {
        const exists = get().favorites.find((e) => e.id === event.id);
        if (exists) {
          get().removeFavorite(event.id);
          return false;
        } else {
          get().addFavorite(event);
          return true;
        }
      },

      // Check if event is favorite
      isFavorite: (eventId) => {
        return get().favorites.some((e) => e.id === eventId);
      },

      // Get all favorites
      getFavorites: () => {
        return get().favorites;
      },

      // Clear all favorites
      clearFavorites: () => {
        set({ favorites: [] });
      },

      // Get favorites count
      getCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);

export default useFavoritesStore;
