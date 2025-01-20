import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllEvents } from '../../api'
import { Import } from 'lucide-react'


const navigate = useNavigate

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

    const EventCard = ({ id, event_title, event_start_date,event_end_date, event_description, image_url }) => (


      <div className="bg-gray-300 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
        <img src={image_url} alt={event_title} className="w-full h-48 object-cover"/>
        <div className="p-4">
          <h2 className="text-base sm:text-xl font-bold mb-2">{event_title}</h2>
          <p className="text-gray-700 dark:text-gray-100 text-sm mb-2">{formatDate(event_start_date)}</p>
          <p className="text-gray-700 dark:text-gray-100 text-sm mb-2">{formatDate(event_end_date)}</p>
          <p className="text-gray-900 dark:text-gray-400 mb-4">{event_description}</p>
          <div className="flex gap-2">
            <Link
              to={`/event-details/${id}/${(event_title || 'untitled').replace(/\s+/g, '-').toLowerCase()}`}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              View Details
            </Link>
            <Link
              to={`/pay/${id}/${(event_title || 'untitled').replace(/\s+/g, '-').toLowerCase()}`}
             className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
    
    const EventListings = () => {
      const navigate = useNavigate()
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        async function loadEvents() {
          try {
            const data = await fetchAllEvents();
            setEvents(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
    
        loadEvents();
      }, []);
    
      return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-600  w-screen">
          {/* Navigation */}
          <nav className="bg-gray-300 dark:bg-gray-700 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
              
              
              </div>
            </div>
          </nav>
    
          {/* Search and Filters */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center gap-4">
              <input
                type="text"
                placeholder="Search events..."
                className="p-2 w-[70%] border border-gray-300 rounded"
              />
              <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
                Search
              </button>
              {/* <button className="px-4 py-2 border bg-gray-600 dark:bg-gray-400 text-white dark:text-black  border-gray-300 rounded">
                Filter
              </button>
              <button className="px-4 py-2 border bg-gray-600 dark:bg-gray-400 text-white dark:text-black  border-gray-300 rounded">
                Sort
              </button> */}
            </div>
          </div>
    
          {/* Event Grid */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
          </div>
    
          {/* Footer */}
          <footer className="bg-gray-900 dark:bg-gray-300 dark:text-black text-white mt-12 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p className="text-sm sm:text-base text-gray-400 dark:text-gray-900">About Us</p>
                  <p className="text-sm sm:text-base mx-3 text-gray-400 dark:text-gray-900">Contact</p>
                  <p className="text-sm sm:text-base text-gray-400 dark:text-gray-900">Privacy Policy</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-gray-600">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:text-gray-600">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      );
    };





export default EventListings