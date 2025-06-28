import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {

       
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen dark:bg-gray-950 bg-gray-100 dark:text-gray-100 text-gray-800">
      {/* Header */}
      <header className="dark:bg-gray-950 bg-gray-100">
        <div className="mx-auto lg:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:px-6">
            
            <div className="">              
              <div>
                <h1 className="text-4xl font-medium">{user?.userName}</h1>
                <p className="text-gray-400">{user?.userEmail}</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">{events.length}</p>
                <p className="text-gray-400">Total Events</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">
                  {events.filter(e => new Date(e.date) > new Date()).length}
                </p>
                <p className="text-gray-400">Upcoming</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-400">
                  {events.filter(e => new Date(e.date) <= new Date()).length}
                </p>
                <p className="text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto  py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Section */}
          <div className="lg:col-span-1 dark:bg-gray-800 bg-gray-300 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <EditProfileForm user={user} onSave={handleUpdateProfile} />
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="font-medium">{user?.userName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="font-medium">{user?.userEmail}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Organization</p>
                  <p className="font-medium">{user?.organization || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="font-medium">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Events Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Events</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Event</span>
              </button>
            </div>

            {events.length === 0 ? (
              <div className="dark:bg-gray-800 bg-gray-300 rounded-xl shadow-lg p-8 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">No Events Created Yet</h3>
                <p className="text-gray-400 mb-6">You haven't created any events. Get started by creating your first event!</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
                  Create Your First Event
                </button>
              </div>
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

// Edit Profile Form Component
const EditProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    organization: user.organization || ''
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
      <div>
        <label className="block text-gray-400 text-sm mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-1">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-gray-400 text-sm mb-1">Organization</label>
        <input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => onSave(user)}
          className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Event Card Component
const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate <= new Date();
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[70px]">
              <p className="text-xl font-bold">{eventDate.getDate()}</p>
              <p className="text-sm text-gray-400 uppercase">
                {eventDate.toLocaleString('default', { month: 'short' })}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-gray-400 flex items-center space-x-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.duration}
                </span>
              </p>
              <p className="text-gray-400 flex items-center space-x-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isPast ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
            }`}>
              {isPast ? 'Completed' : 'Upcoming'}
            </span>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg">
                View
              </button>
              <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;