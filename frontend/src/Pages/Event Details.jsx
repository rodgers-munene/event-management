import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Gift, Calendar, MapPin, Clock, User, ArrowLeft } from "lucide-react";
import { fetchEventById } from "../../api";
import slugify from "slugify";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date to be more readable
  function formatDate(dateString) {
    if (!dateString) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Format time
  function formatTime(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!event) return <div className="text-center py-10">Event not found</div>;

  return (
    <div className="min-h-screen w-[95vw] bg-gray-50 dark:bg-gray-950">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6 ">
        <Link
          to="/event-listings"
          className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Events
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="">
          {/* image section */}
          <div className="rounded-md">
            {/* Event Image */}
            <div className="relative rounded-xl shadow-lg">
              <img
                src={
                  event.image_url ||
                  "https://via.placeholder.com/800x450?text=Event+Image"
                }
                alt={event.event_title}
                className="w-full h-64 md:h-96 object-cover rounded-md"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x450?text=Event+Image";
                }}
              />
              <div className="absolute sm:flex flex-col justify-around w-80 min-h-56 py-2 px-4 bg-white sm:right-10 top-10 rounded-md hidden">
                <h1 className="text-black text-xl font-bold">Date & Time</h1>
                <p className="text-gray-700">
                  {formatDate(event.event_start_date)}{" "}
                  {formatTime(event.event_start_date)} -{" "}
                  {formatTime(event.event_end_date)}
                </p>
                <Link to={""} className="text-blue-600">
                  Add to Calender
                </Link>
                <Link
                  to={`/pay/${id}/${slugify(event.event_title, {lower: true, trim: true})}`}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-center transition-colors shadow-md"
                >
                  Register Now
                </Link>
                <button className=" w-full px-4 py-2 rounded-md bg-gray-600">
                  Share Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Event Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {event.event_title}
                </h1>
                {event.is_free && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    Free Event
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Calendar className="mr-2 text-purple-500" size={18} />
                  <span>{formatDate(event.event_start_date)}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Clock className="mr-2 text-purple-500" size={18} />
                  <span>
                    {formatTime(event.event_start_date)} -{" "}
                    {formatTime(event.event_end_date)}
                  </span>
                </div>
                {event.event_location && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <MapPin className="mr-2 text-purple-500" size={18} />
                    <span>{event.event_location}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  About This Event
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {event.event_description}
                </p>
              </div>

              <div className="flex flex-wrap flex-col sm:flex-row gap-4 sm:hidden">
                <Link
                  to={`/pay/${id}/${(event.event_title || "event")
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                  className="flex-1 md:flex-none px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-center transition-colors shadow-md"
                >
                  Register Now
                </Link>
                <button className="flex-1 md:flex-none px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors">
                  Share Event
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organizer Info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Organizer
                </h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                    <User
                      className="text-purple-600 dark:text-purple-400"
                      size={20}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {event.organizer_name || "Event Organizer"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Host
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Highlights */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Event Highlights
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Gift
                      className="text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Free goodies for early registrants
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Gift
                      className="text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Networking opportunities
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Gift
                      className="text-purple-500 mr-3 mt-0.5 flex-shrink-0"
                      size={18}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Interactive sessions
                    </span>
                  </li>
                </ul>
              </div>

              {/* Tags */}
              {event.tags && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
