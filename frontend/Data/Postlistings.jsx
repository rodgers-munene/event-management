import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img5 from '../assets/images/5.jpg';
import img7 from '../assets/images/7.jpg';
import img9 from '../assets/images/9.jpg';
import CreateEvent from './CreateEvent'; // Import the CreateEvent component

const EventListings = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Summer Music Fest",
      date: "August 15, 2023",
      description: "Join us for an unforgettable night of music and fun at the annual Summer Music Fest.",
      image: img5,
    },
    {
      id: 2,
      title: "Gourmet Food Expo",
      date: "September 10, 2023",
      description: "Explore the latest trends in gourmet cuisine at the Gourmet Food Expo.",
      image: img7,
    },
    {
      id: 3,
      title: "Tech Innovators Conference",
      date: "October 5, 2023",
      description: "Discover the future of technology at the Tech Innovators Conference.",
      image: img9,
    }
  ]);

  // Function to add a new event to the list
  const handleEventCreate = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-600">
      <CreateEvent onEventCreate={handleEventCreate} /> {/* Pass handler to CreateEvent */}

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <p className="text-gray-700 dark:text-gray-100 text-sm mb-2">{event.date}</p>
                <p className="text-gray-900 dark:text-gray-400 mb-4">{event.description}</p>
                <div className="flex gap-2">
                  <Link
                    to={`/event-details/${event.id}/${event.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/pay/${event.id}/${event.title.replace(/\s+/g, '-').toLowerCase()}`}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-300 dark:text-black text-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className="text-gray-400 dark:text-gray-900">About Us</p>
              <p className="mx-3 text-gray-400 dark:text-gray-900">Contact</p>
              <p className="text-gray-400 dark:text-gray-900">Privacy Policy</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventListings;
