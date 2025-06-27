import React from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const GlobalCard = ({event}) => {
     if (!event) return null;

  // Best fallback image (16:9 preferred)
  const image =
    event.images?.find((img) => img.ratio === "16_9")?.url ||
    event.images?.[0]?.url;

  const venue = event._embedded?.venues?.[0];
  const attraction = event._embedded?.attractions?.[0];
  const classification = event.classifications?.[0];

  const date = event.dates?.start?.localDate;
  const time = event.dates?.start?.localTime;
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md dark:bg-gray-800"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {/* Event image */}
      {image && (
        <img
          src={image}
          alt={event.name}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4">
        {/* Event name */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {event.name}
        </h3>

        {/* Date and Time */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            {date} {time && `at ${time}`}
          </span>
        </div>

        {/* Location */}
        {venue && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{venue.name}, {venue.city?.name}</span>
          </div>
        )}

        {/* Genre */}
        {classification?.genre?.name && (
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">
            {classification.segment?.name} / {classification.genre?.name} /{" "}
            {classification.subGenre?.name}
          </p>
        )}

        {/* Artist/Performer */}
        {attraction?.name && (
          <p className="text-sm text-gray-800 dark:text-gray-100 mb-3">
            Featuring: <strong>{attraction.name}</strong>
          </p>
        )}

        {/* View More */}
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          View Event <ExternalLink className="w-4 h-4 ml-1" />
        </a>
      </div>
    </motion.div>
  );
}

export default GlobalCard