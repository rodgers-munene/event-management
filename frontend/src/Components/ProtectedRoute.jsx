import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // Optional: Check token expiry (but don't be too aggressive)
  const expiresAt = localStorage.getItem('expiresAt');
  if (expiresAt) {
    const expiryTime = parseInt(expiresAt);
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    // Only logout if token is expired by more than 5 minutes
    // This prevents immediate logout on page load
    if (now > expiryTime + fiveMinutes) {
      useAuthStore.getState().logout();
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
