import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI, authAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';

const ProfilePage = () => {
  const { user, token, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getUserEvents(user.id);
      
      if (response.data.success) {
        setEvents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    setUpdating(true);
    try {
      const response = await authAPI.updateProfile(user.id, updatedData);
      
      if (response.data.success) {
        // Update the user in the store
        setAuth(response.data.data, token);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const upcomingEvents = events.filter(e => new Date(e.event_start_date) > new Date());
  const completedEvents = events.filter(e => new Date(e.event_start_date) <= new Date());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.user_name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.user_name}</h1>
                <p className="text-gray-600 dark:text-gray-400">{user?.user_email}</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="flex space-x-8">
              <UserStat value={events.length} label="Total Events" color="purple" />
              <UserStat value={upcomingEvents.length} label="Upcoming" color="green" />
              <UserStat value={completedEvents.length} label="Completed" color="blue" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <EditProfileForm
                  user={user}
                  onSave={handleUpdateProfile}
                  onCancel={() => setIsEditing(false)}
                  updating={updating}
                />
              ) : (
                <ProfileDetails user={user} />
              )}
            </div>
          </div>

          {/* Events Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Events</h2>
              <button
                onClick={() => navigate('/create-event')}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Event</span>
              </button>
            </div>

            {events.length === 0 ? (
              <NoEvents navigate={navigate} />
            ) : (
              <div className="space-y-4">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// -------------------------
// Supporting Components
// -------------------------

const UserStat = ({ value, label, color }) => {
  const colorClasses = {
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className="text-center">
      <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{label}</p>
    </div>
  );
};

const ProfileDetails = ({ user }) => (
  <div className="space-y-4">
    <Detail label="Full Name" value={user?.user_name || 'Not provided'} />
    <Detail label="Email" value={user?.user_email || 'Not provided'} />
    <Detail label="Phone" value={user?.phone || 'Not provided'} />
    <Detail label="Organization" value={user?.organization || 'Not provided'} />
    <Detail label="Member Since" value={new Date(user?.createdAt || Date.now()).toLocaleDateString()} />
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</p>
    <p className="font-medium text-gray-900 dark:text-white">{value}</p>
  </div>
);

const EditProfileForm = ({ user, onSave, onCancel, updating }) => {
  const [formData, setFormData] = useState({
    user_name: user?.user_name || '',
    user_email: user?.user_email || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full Name" name="user_name" value={formData.user_name} onChange={handleChange} />
      <Input label="Email" name="user_email" type="email" value={formData.user_email} onChange={handleChange} />
      <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
      <Input label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={updating}
          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all disabled:opacity-50"
        >
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

const Input = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
      required={type === 'text' || type === 'email'}
    />
  </div>
);

const NoEvents = ({ navigate }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Events Created Yet</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      You haven't created any events. Get started by creating your first event!
    </p>
    <button
      onClick={() => navigate('/create-event')}
      className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
    >
      Create Your First Event
    </button>
  </div>
);

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const eventDate = new Date(event.event_start_date);
  const isPast = eventDate <= new Date();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-3 text-center min-w-[70px] text-white">
              <p className="text-2xl font-bold">{eventDate.getDate()}</p>
              <p className="text-sm uppercase">{eventDate.toLocaleString('default', { month: 'short' })}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.event_title}</h3>
              <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4" />
                <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{event.event_location}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPast 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
            }`}>
              {isPast ? 'Completed' : 'Upcoming'}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/analytics/${event.id}`)}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-800 dark:text-purple-400 rounded-xl transition-colors font-medium flex items-center gap-1"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={() => navigate(`/event-details/${event.id}/${slugify(event.event_title)}`)}
                className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-800 dark:text-primary-400 rounded-xl transition-colors font-medium"
              >
                View
              </button>
              <button
                onClick={() => navigate(`/create-event?edit=${event.id}`)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl transition-colors font-medium"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper imports for EventCard
import { Clock, MapPin, BarChart3 } from 'lucide-react';
import slugify from 'slugify';

export default ProfilePage;
