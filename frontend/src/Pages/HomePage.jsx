import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Music, Briefcase, Heart, Utensils, Gamepad2, Palette, Trophy, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { eventsAPI } from '../api/index.js';
import EventCard from '../Components/EventCard';
import Button from '../Components/ui/Button';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ limit: 6, page: 1 });
      setEvents(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Music', icon: Music, color: 'bg-red-100 text-red-600' },
    { name: 'Business', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { name: 'Food & Drink', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { name: 'Arts', icon: Palette, color: 'bg-purple-100 text-purple-600' },
    { name: 'Fitness', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { name: 'Gaming', icon: Gamepad2, color: 'bg-green-100 text-green-600' },
    { name: 'Sports', icon: Trophy, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Education', icon: GraduationCap, color: 'bg-indigo-100 text-indigo-600' },
  ];

  const upcomingEvents = [
    {
      title: 'Tech Innovation Summit 2025',
      date: 'Sat, Mar 15 • 9:00 AM',
      location: 'Nairobi Convention Center',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      price: 'KES 5,000',
    },
    {
      title: 'Nairobi Food Festival',
      date: 'Sun, Mar 16 • 11:00 AM',
      location: 'Uhuru Park',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      price: 'Free',
    },
    {
      title: 'Live Jazz Night',
      date: 'Fri, Mar 14 • 7:00 PM',
      location: 'The Alchemist Bar',
      image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=400',
      price: 'KES 1,500',
    },
    {
      title: 'Startup Pitch Competition',
      date: 'Wed, Mar 19 • 2:00 PM',
      location: 'iHub Nairobi',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
      price: 'KES 2,000',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] md:h-[700px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920)',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find your next<br />experience
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              Discover events that match your passions. From concerts to conferences, find what excites you.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="bg-white rounded-full p-2 flex items-center gap-2 shadow-2xl">
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    className="py-3 text-gray-900 placeholder-gray-500 focus:outline-none w-40"
                  />
                </div>
                <Link to="/event-listings">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                    Search
                  </button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold text-white">10K+</p>
                <p className="text-sm text-white/70">Events</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">500K+</p>
                <p className="text-sm text-white/70">Attendees</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">5K+</p>
                <p className="text-sm text-white/70">Organizers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-20">
            <path d="M0 0L60 10C120 20 240 40 360 53.3C480 67 600 73 720 73.3C840 73 960 67 1080 53.3C1200 40 1320 20 1380 10L1440 0V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/event-listings?category=${category.name.toLowerCase()}`}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/event-listings" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    This Weekend
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Find events happening this weekend. From concerts to workshops, there is something for everyone.
                </p>
              </div>
            </Link>

            <Link to="/event-listings" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Free Events
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Discover free events in your area. Learn, network, and have fun without spending a shilling.
                </p>
              </div>
            </Link>

            <Link to="/event-listings" className="group">
              <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Near You
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Find events happening near your location. Support local organizers and discover hidden gems.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recommended Events
              </h2>
              <p className="text-gray-600">
                Handpicked events just for you
              </p>
            </div>
            <Link to="/event-listings">
              <Button variant="ghost" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.price === 'Free' && (
                    <span className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                      Free
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                <p className="text-sm text-gray-600 mb-2">{event.location}</p>
                <p className="text-sm font-semibold text-gray-900">{event.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Online Events Section */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Online Events
              </h2>
              <p className="text-gray-600">
                Join from anywhere in the world
              </p>
            </div>
            <Link to="/event-listings?location=online">
              <Button variant="ghost" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Browse Online
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Digital Marketing Masterclass',
                date: 'Mar 20 • 10:00 AM',
                organizer: 'Marketing Academy',
                price: 'KES 3,500',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
              },
              {
                title: 'Python for Beginners',
                date: 'Mar 22 • 2:00 PM',
                organizer: 'Code Kenya',
                price: 'Free',
                image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400',
              },
              {
                title: 'Virtual Networking Mixer',
                date: 'Mar 25 • 6:00 PM',
                organizer: 'Professionals Network',
                price: 'KES 500',
                image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
              },
            ].map((event, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="relative h-40">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1">
                    📍 Online
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{event.date}</p>
                  <p className="text-sm text-gray-600 mb-3">{event.organizer}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-900">{event.price}</p>
                    <Link to={`/event-listings`}>
                      <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                        Learn More →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizer CTA Section */}
      <section className="py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Organize your own event
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of organizers who trust EventHub to power their events. Create your event page, sell tickets, and manage registrations—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-event">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Create an Event
              </Button>
            </Link>
            <Link to="/event-listings">
              <Button variant="secondary" size="lg">
                Browse Events
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">10K+</p>
              <p className="text-gray-600">Events Created</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">500K+</p>
              <p className="text-gray-600">Tickets Sold</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-purple-600 mb-2">5K+</p>
              <p className="text-gray-600">Organizers</p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get the EventHub app
              </h2>
              <p className="text-lg text-gray-400 mb-8">
                Never miss an event. Get notifications, manage your tickets, and discover events on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs">Download on the</p>
                    <p className="text-sm font-semibold">App Store</p>
                  </div>
                </button>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-xs">Get it on</p>
                    <p className="text-sm font-semibold">Google Play</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 h-80 bg-gray-800 rounded-3xl border-4 border-gray-700 overflow-hidden">
                  <div className="bg-white h-full w-full p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-24 bg-gray-200 rounded-xl"></div>
                      <div className="h-24 bg-gray-200 rounded-xl"></div>
                      <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <Link to="/signup">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
