import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import { FaCalendarAlt, FaMapMarkerAlt} from "react-icons/fa";

const EventCard = ({ event }) => {
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
      <div className="relative">
        <img
          src={event.image_url}
          alt={event.event_title}
          className="w-full h-48 sm:h-56 object-cover"
        />

        <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {event.event_category || 'General'}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center mb-1">
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs px-2 py-1 rounded mr-2">
            {event.event_type || 'Event'}
          </span>
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
          {event.event_title}
        </h2>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          <span>
            {formatDate(event.event_start_date)} • {formatTime(event.event_start_date)}
          </span>
        </div>
        
        {event.event_location && (
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-3">
            <FaMapMarkerAlt className="mr-2 text-purple-500" />
            <span className="line-clamp-1">{event.event_location}</span>
          </div>
        )}
        
        <p className="text-gray-700 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {event.event_description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/event-details/${event.id}/${slugify(event.event_title, {lower: true, trim: true})}`}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg transition-colors duration-300"
          >
            View Details
          </Link>
          <Link
            to={`/pay/${event.id}/${slugify(event.event_title, {lower: true, trim: true})}`}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300"
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;