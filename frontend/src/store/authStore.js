import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        // Also store in localStorage for axios interceptor
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        set({
          user: updatedUser,
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Sync from localStorage (for page refresh)
      syncFromStorage: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch (e) {
            console.error('Failed to parse stored user:', e);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and isAuthenticated, token will be synced manually
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize from localStorage on app start
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');
if (storedToken && storedUser) {
  try {
    const user = JSON.parse(storedUser);
    useAuthStore.getState().setAuth(user, storedToken);
  } catch (e) {
    console.error('Failed to initialize auth from storage:', e);
  }
}

export default useAuthStore;
