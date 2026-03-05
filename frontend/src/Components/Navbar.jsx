import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const close = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={close}
      className={`text-[13px] transition-colors ${
        pathname === to
          ? 'text-gray-900 font-semibold'
          : 'text-gray-400 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 w-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-gray-900 rounded flex items-center justify-center">
              <Calendar size={14} className="text-yellow-300" />
            </div>
            <span className="text-[15px] font-bold text-gray-900 tracking-tight">EventHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLink('/', 'Home')}
            {navLink('/event-listings', 'Events')}
            {isAuthenticated && navLink('/my-registrations', 'My Registrations')}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NotificationBell />
                <Link to="/profile" className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  <User size={13} />
                  <span className="max-w-[120px] truncate">{user?.user_name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link to="/create-event" className="px-3 py-1.5 bg-gray-900 text-white text-[12px] font-semibold rounded hover:bg-gray-700 transition-colors">
                  Create Event
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(o => !o)} className="md:hidden p-1.5 text-gray-500 hover:text-gray-900 transition-colors">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 flex flex-col gap-4">
            {navLink('/', 'Home')}
            {navLink('/event-listings', 'Events')}
            {isAuthenticated ? (
              <>
                {navLink('/my-registrations', 'My Registrations')}
                {navLink('/profile', 'Profile')}
                <button onClick={handleLogout} className="text-left text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close} className="text-[13px] text-gray-400 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link to="/create-event" onClick={close} className="inline-flex justify-center px-4 py-2 bg-gray-900 text-white text-[12px] font-semibold rounded hover:bg-gray-700 transition-colors">
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