import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Music, Briefcase, Heart, Utensils, Gamepad2,
  Palette, Trophy, GraduationCap, ArrowRight, Calendar, Users, Zap,
} from 'lucide-react';
import { eventsAPI } from '../api/index.js';
import EventCard from '../Components/EventCard';

/* ─── Static data ───────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Music',        icon: Music,         dot: 'bg-red-400'    },
  { name: 'Business',     icon: Briefcase,     dot: 'bg-blue-400'   },
  { name: 'Food & Drink', icon: Utensils,      dot: 'bg-orange-400' },
  { name: 'Arts',         icon: Palette,       dot: 'bg-purple-400' },
  { name: 'Fitness',      icon: Heart,         dot: 'bg-pink-400'   },
  { name: 'Gaming',       icon: Gamepad2,      dot: 'bg-green-400'  },
  { name: 'Sports',       icon: Trophy,        dot: 'bg-yellow-400' },
  { name: 'Education',    icon: GraduationCap, dot: 'bg-indigo-400' },
];

const FEATURED = [
  { title: 'Tech Innovation Summit 2025', date: 'Sat, Mar 15 · 9:00 AM',  location: 'Nairobi Convention Center', price: 'KES 5,000', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fm=webp' },
  { title: 'Nairobi Food Festival',       date: 'Sun, Mar 16 · 11:00 AM', location: 'Uhuru Park',                price: 'Free',      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&fm=webp' },
  { title: 'Live Jazz Night',             date: 'Fri, Mar 14 · 7:00 PM',  location: 'The Alchemist Bar',         price: 'KES 1,500', image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=600&q=80&fm=webp' },
  { title: 'Startup Pitch Competition',   date: 'Wed, Mar 19 · 2:00 PM',  location: 'iHub Nairobi',              price: 'KES 2,000', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80&fm=webp' },
];

const ONLINE = [
  { title: 'Digital Marketing Masterclass', date: 'Mar 20 · 10:00 AM', organizer: 'Marketing Academy',   price: 'KES 3,500', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fm=webp' },
  { title: 'Python for Beginners',          date: 'Mar 22 · 2:00 PM',  organizer: 'Code Kenya',          price: 'Free',      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&q=80&fm=webp' },
  { title: 'Virtual Networking Mixer',      date: 'Mar 25 · 6:00 PM',  organizer: 'Professionals Network',price: 'KES 500',  image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80&fm=webp' },
];

/* ─── Skeleton ──────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div className="h-40 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
    <div className="p-4 space-y-2.5">
      <div className="h-3 w-2/5 bg-gray-100 rounded animate-pulse" />
      <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
      <div className="h-3 w-3/5 bg-gray-100 rounded animate-pulse" />
    </div>
  </div>
);

/* ─── Section header ────────────────────────────────────────────────── */
const SectionHead = ({ title, sub, href, linkLabel = 'View all' }) => (
  <div className="flex items-end justify-between mb-7">
    <div>
      <p className="text-2xl font-bold text-gray-900 leading-tight">{title}</p>
      {sub && <p className="text-sm text-gray-400 mt-0.5">{sub}</p>}
    </div>
    {href && (
      <Link to={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-gray-900 hover:underline shrink-0">
        {linkLabel} <ArrowRight size={13} />
      </Link>
    )}
  </div>
);

/* ─── Main ──────────────────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    eventsAPI.getAll({ limit: 6, page: 1 })
      .then(r => setEvents(r.data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search) p.set('search', search);
    if (location) p.set('location', location);
    navigate(`/event-listings?${p.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white w-screen">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative h-[540px] md:h-[620px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80&fm=webp"
          alt="crowd at event"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-300 text-gray-900 text-[11px] font-bold uppercase tracking-widest mb-5">
              <Zap size={10} /> Nairobi's event platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
              Find your next<br />experience
            </h1>
            <p className="text-base text-white/70 mb-8 max-w-lg">
              From concerts to conferences — discover events that match what you love.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex bg-white overflow-hidden shadow-2xl max-w-xl rounded">
              <div className="flex items-center gap-2 flex-1 px-4 py-3 border-r border-gray-200">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input
                  type="text" placeholder="Search events..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-3 border-r border-gray-200">
                <MapPin size={14} className="text-gray-400 shrink-0" />
                <input
                  type="text" placeholder="Location"
                  value={location} onChange={e => setLocation(e.target.value)}
                  className="w-28 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors whitespace-nowrap">
                Search
              </button>
            </form>

            {/* Stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/15">
              {[['10K+', 'Events'], ['500K+', 'Attendees'], ['5K+', 'Organizers']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-bold text-white">{n}</p>
                  <p className="text-xs text-white/50 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Browse by Category</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
            {CATEGORIES.map(({ name, icon: Icon, dot }) => (
              <Link
                key={name}
                to={`/event-listings?category=${name.toLowerCase()}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <span className={`absolute inset-0 rounded-full ${dot} opacity-15 group-hover:opacity-25 transition-opacity`} />
                  <Icon size={17} className="text-gray-700 relative z-10" />
                </div>
                <span className="text-[11px] font-medium text-gray-600 text-center leading-tight">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick links ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Calendar, label: 'This Weekend', sub: 'Events happening in the next few days.',  href: '/event-listings?date=weekend'    },
              { icon: Users,    label: 'Free Events',  sub: 'Learn, network, and have fun for free.', href: '/event-listings?priceRange=free' },
              { icon: MapPin,   label: 'Near You',     sub: 'Discover local events around Nairobi.',  href: '/event-listings'                 },
            ].map(({ icon: Icon, label, sub, href }) => (
              <Link key={label} to={href}
                className="group flex items-start gap-3.5 bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-[3px_3px_0_#111827] transition-all duration-200">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={15} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900 mb-0.5">{label}</p>
                  <p className="text-[12px] text-gray-400 leading-relaxed">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming (static) ───────────────────────────────────────── */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <SectionHead title="Upcoming Events" sub="Don't miss out" href="/event-listings" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED.map((ev, i) => (
              <Link key={i} to="/event-listings" className="group block">
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img src={ev.image} alt={ev.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                  {ev.price === 'Free' && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-yellow-300 text-gray-900">Free</span>
                  )}
                </div>
                <p className="text-[14px] font-bold text-gray-900 line-clamp-2 mb-1 group-hover:underline">{ev.title}</p>
                <p className="text-[11px] text-gray-400">{ev.date}</p>
                <p className="text-[11px] text-gray-400 mb-1.5">{ev.location}</p>
                <p className="text-[13px] font-bold text-gray-900">{ev.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── API events ──────────────────────────────────────────────── */}
      {(loading || events.length > 0) && (
        <section className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
            <SectionHead title="Recommended for You" sub="Handpicked events" href="/event-listings" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : events.map((ev, i) => <EventCard key={ev.id} event={ev} index={i} viewMode="grid" />)
              }
            </div>
          </div>
        </section>
      )}

      {/* ── Online events ───────────────────────────────────────────── */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <SectionHead title="Online Events" sub="Join from anywhere" href="/event-listings?location=online" linkLabel="Browse online" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ONLINE.map((ev, i) => (
              <Link key={i} to="/event-listings" className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[3px_3px_0_#111827] transition-all duration-200">
                <div className="relative h-36 overflow-hidden bg-gray-100">
                  <img src={ev.image} alt={ev.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur text-gray-700 border border-black/5">Online</span>
                </div>
                <div className="p-4">
                  <p className="text-[14px] font-bold text-gray-900 mb-1 line-clamp-2">{ev.title}</p>
                  <p className="text-[11px] text-gray-400">{ev.date}</p>
                  <p className="text-[11px] text-gray-400 mb-3">{ev.organizer}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-gray-900">{ev.price}</span>
                    <span className="text-[12px] font-semibold text-gray-400 group-hover:text-gray-900 transition-colors inline-flex items-center gap-0.5">
                      Details <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Organizer CTA ───────────────────────────────────────────── */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">For Organizers</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Host your next event<br />with EventHub
              </h2>
              <p className="text-[15px] text-gray-500 mb-7 leading-relaxed max-w-md">
                Create your event page, manage registrations, and sell tickets — all in one place. Trusted by thousands across Kenya.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/create-event" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors">
                  <Zap size={13} /> Create an Event
                </Link>
                <Link to="/event-listings" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-gray-200 text-[13px] font-semibold text-gray-700 hover:border-gray-900 transition-colors">
                  Browse Events
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[['10K+', 'Events created'], ['500K+', 'Tickets sold'], ['5K+', 'Organizers']].map(([n, l]) => (
                <div key={l} className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                  <p className="text-2xl font-extrabold text-gray-900 mb-1">{n}</p>
                  <p className="text-[11px] text-gray-400 leading-tight">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── App CTA ─────────────────────────────────────────────────── */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3">Mobile App</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Get the EventHub app</h2>
              <p className="text-[14px] text-gray-400 mb-7 leading-relaxed">
                Never miss an event. Manage your tickets and discover events on the go.
              </p>
              <div className="flex gap-3 flex-wrap">
                {[{ label: 'App Store', sub: 'Download on the' }, { label: 'Google Play', sub: 'Get it on' }].map(({ label, sub }) => (
                  <button key={label} className="flex items-center gap-3 bg-white/10 border border-white/10 hover:bg-white/15 transition-colors px-4 py-2.5 rounded-lg">
                    <div className="text-left">
                      <p className="text-[10px] text-white/50">{sub}</p>
                      <p className="text-[13px] font-semibold text-white">{label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Phone mockup */}
            <div className="hidden md:flex justify-end">
              <div className="w-44 h-72 bg-gray-800 border-2 border-gray-700 rounded-3xl overflow-hidden p-3">
                <div className="bg-white rounded-2xl h-full p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-yellow-300 rounded-full" />
                    <div className="h-2 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-100 rounded-lg" />
                    <div className="h-10 bg-gray-100 rounded-lg" />
                    <div className="h-11 bg-gray-100 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ──────────────────────────────────────────────── */}
      <section className="border-t border-gray-200">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-14 text-center">
          <p className="text-xl font-bold text-gray-900 mb-2">Ready to get started?</p>
          <p className="text-sm text-gray-400 mb-6">Join thousands of event-goers and organizers on EventHub.</p>
          <Link to="/signup" className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors">
            Create Free Account <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;