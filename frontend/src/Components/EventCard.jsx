import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, ImageOff, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

/* ─── Image with shimmer + error state ──────────────────────────────── */
const EventImage = ({ src, alt }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="absolute inset-0 bg-gray-100">
      {loading && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageOff size={22} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false); }}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.04] ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </div>
  );
};

const optimizeImg = (url, w = 480) => {
  if (!url) return `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=${w}&q=80&fm=webp`;
  if (url.includes('unsplash.com')) return `${url.split('?')[0]}?w=${w}&q=80&fm=webp`;
  return url;
};

/* ─── EventCard ──────────────────────────────────────────────────────── */
const EventCard = ({ event, index = 0, viewMode = 'grid' }) => {
  const isFree = event.event_price === 0 || !event.event_price;
  const isSoon = new Date(event.event_start_date) - new Date() < 7 * 24 * 60 * 60 * 1000;
  const isFull = event.capacity && event.registeredCount >= event.capacity;
  const capPct = event.capacity
    ? Math.min(100, Math.round(((event.registeredCount || 0) / event.capacity) * 100))
    : null;

  const detailHref = `/event-details/${event.id}/${encodeURIComponent(event.event_title)}`;
  const payHref = `/pay/${event.id}/${encodeURIComponent(event.event_title)}`;

  const anim = {
    initial: { opacity: 0, y: viewMode === 'list' ? 0 : 12, x: viewMode === 'list' ? -8 : 0 },
    animate: { opacity: 1, y: 0, x: 0 },
    transition: { duration: 0.22, delay: Math.min(index * 0.045, 0.25) },
  };

  /* ── List view ───────────────────────────────────────────────────── */
  if (viewMode === 'list') {
    return (
      <motion.div {...anim} layout>
        <div className="group flex bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-900 hover:shadow-[4px_4px_0_#111827]">
          {/* Thumbnail */}
          <div className="relative w-48 shrink-0 overflow-hidden bg-gray-100">
            <EventImage src={optimizeImg(event.image_url)} alt={event.event_title} />
            <div className="absolute top-2 left-2 flex gap-1 flex-wrap z-10">
              {isFree && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-yellow-300 text-gray-900">Free</span>}
              {isSoon && !isFree && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-600 text-white">Soon</span>}
              {isFull && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gray-900 text-white">Full</span>}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col justify-between flex-1 min-w-0 p-5 gap-3">
            <div className="flex flex-col gap-1.5">
              {event.category && (
                <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{event.category}</span>
              )}
              <p className="text-[17px] font-bold text-gray-900 leading-snug line-clamp-2">{event.event_title}</p>
              {event.event_description && (
                <p className="text-[12.5px] text-gray-400 leading-relaxed line-clamp-2">{event.event_description}</p>
              )}
              <div className="flex flex-wrap gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Calendar size={12} />{format(new Date(event.event_start_date), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={12} />{format(new Date(event.event_start_date), 'h:mm a')}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin size={12} />
                  <span className="max-w-[160px] truncate">{event.event_location}</span>
                </span>
                {event.registeredCount !== undefined && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Users size={12} />{event.registeredCount} going
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
              <span className={`text-base font-extrabold ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
                {isFree ? 'Free' : `KES ${event.event_price?.toLocaleString()}`}
              </span>
              <div className="flex gap-2">
                <Link
                  to={detailHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold border border-gray-200 text-gray-900 hover:border-gray-900 transition-colors"
                >
                  Details <ArrowRight size={12} />
                </Link>
                {!isFull && event.status === 'published' && (
                  <Link
                    to={payHref}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold bg-yellow-300 text-gray-900 hover:bg-yellow-400 transition-colors"
                  >
                    Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Grid view ───────────────────────────────────────────────────── */
  return (
    <motion.div {...anim} layout className="h-full">
      <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-900 hover:shadow-[4px_4px_0_#111827]">
        {/* Image */}
        <div className="relative h-44 overflow-hidden shrink-0">
          <EventImage src={optimizeImg(event.image_url)} alt={event.event_title} />
          <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap z-10">
            {isFree && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-yellow-300 text-gray-900">Free</span>}
            {isSoon && !isFree && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-600 text-white">Soon</span>}
            {isFull && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gray-900 text-white">Sold out</span>}
            {event.status === 'draft' && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gray-500 text-white">Draft</span>}
          </div>
          <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-xs font-bold text-gray-900 bg-white/95 backdrop-blur border border-black/5 z-10">
            {isFree ? 'Free' : `KES ${event.event_price?.toLocaleString()}`}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 gap-2.5 p-4">
          {event.category && (
            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{event.category}</span>
          )}
          <p className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">{event.event_title}</p>

          {event.event_description && (
            <p className="text-[12.5px] text-gray-400 leading-relaxed line-clamp-2">{event.event_description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-col gap-1.5 mt-0.5">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} className="shrink-0" />
              {format(new Date(event.event_start_date), 'EEE, MMM d · h:mm a')}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{event.event_location}</span>
            </span>
            {event.capacity && (
              <div className="flex flex-col gap-1 mt-0.5">
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Users size={12} className="shrink-0" />
                  {event.registeredCount || 0} / {event.capacity} spots
                </span>
                <div className="h-0.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-300"
                    style={{ width: `${capPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100 gap-2">
            <span className={`text-base font-extrabold ${isFree ? 'text-green-600' : 'text-gray-900'}`}>
              {isFree ? 'Free' : `KES ${event.event_price?.toLocaleString()}`}
            </span>
            <div className="flex gap-1.5">
              <Link
                to={detailHref}
                className="inline-flex items-center justify-center w-8 h-8 rounded border border-gray-200 text-gray-900 hover:border-gray-900 transition-colors"
              >
                <ArrowRight size={14} />
              </Link>
              {!isFull && event.status === 'published' ? (
                <Link
                  to={payHref}
                  className="inline-flex items-center px-3.5 py-1.5 rounded text-xs font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  Register
                </Link>
              ) : isFull ? (
                <span className="inline-flex items-center px-3.5 py-1.5 rounded text-xs font-semibold bg-gray-100 text-gray-400 cursor-default">
                  Full
                </span>
              ) : (
                <Link
                  to={detailHref}
                  className="inline-flex items-center px-3.5 py-1.5 rounded text-xs font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;