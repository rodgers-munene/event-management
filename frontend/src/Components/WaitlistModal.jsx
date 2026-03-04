import { useState } from 'react';
import { Clock, Bell, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore.js';

const WaitlistModal = ({ isOpen, onClose, event, onJoinWaitlist }) => {
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to join the waitlist');
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      // await waitlistAPI.join(event.id, email);
      
      // Optimistic update
      toast.success('You\'ve been added to the waitlist! We\'ll notify you if a spot opens up.');
      onJoinWaitlist?.();
      setEmail('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join waitlist');
    } finally {
      setLoading(false);
    }
  };

  const isFull = event.capacity && event.registeredCount >= event.capacity;
  const spotsLeft = event.capacity - (event.registeredCount || 0);
  const waitlistCount = event.waitlistCount || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <Clock className="w-8 h-8 text-white" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          {isFull ? 'Event is Full' : 'Join Waitlist'}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {isFull
            ? `This event has reached capacity. Join the waitlist and we'll notify you if a spot becomes available.`
            : `Only ${spotsLeft} spots left! Join the waitlist to secure your chance to attend.`
          }
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {event.registeredCount || 0}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registered</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {waitlistCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">On Waitlist</p>
          </div>
        </div>

        {/* Position Info */}
        {waitlistCount > 0 && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Current Waitlist Position
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  You'll be position #{waitlistCount + 1}. {Math.max(0, event.capacity - (event.registeredCount || 0))} spots available when full.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Joining Waitlist...' : 'Join Waitlist'}
            </button>
          </form>
        ) : (
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to be logged in to join the waitlist
            </p>
            <button
              onClick={() => {
                onClose();
                window.location.href = '/login';
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Login Now →
            </button>
          </div>
        )}

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Waitlist Benefits:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>First priority when spots open up</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Instant email notification</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>No obligation to attend if contacted</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaitlistModal;
