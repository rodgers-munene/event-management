import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { fetchAllEvents } from '../../api'
import EventCard from '../Components/EventCard'


const EventListings = () => {
      const navigate = useNavigate()
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        async function loadEvents() {
          try {
            const results = await fetchAllEvents();
            setEvents(results.data);
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
            </div>
          </div>
    
          {/* Event Grid */}
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </div>
          </div>
    
          
        </div>
      );
    };





export default EventListings