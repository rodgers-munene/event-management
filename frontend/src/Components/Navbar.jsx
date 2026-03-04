import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/event-listings" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Events
            </Link>
            {isAuthenticated && (
              <Link to="/my-registrations" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                My Registrations
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {user?.user_name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </button>
                <Link to="/create-event">
                  <button className="bg-gray-900 text-white px-4 py-2 text-sm font-medium rounded hover:bg-gray-800 transition-colors">
                    Create Event
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              to="/event-listings"
              onClick={() => setIsOpen(false)}
              className="block text-sm text-gray-600 hover:text-gray-900"
            >
              Events
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-registrations"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-gray-600 hover:text-gray-900"
                >
                  My Registrations
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-gray-600 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-sm text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                  }}
                  className="block text-sm text-gray-600 hover:text-gray-900"
                >
                  Login
                </button>
                <Link
                  to="/create-event"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-gray-900 text-white px-4 py-2 text-sm font-medium rounded text-center"
                >
                  Create Event
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
