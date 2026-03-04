import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, SlidersHorizontal, Grid, List, ChevronDown, ChevronRight,
  Home, Music, Briefcase, Heart, Utensils, Gamepad2, Palette, Trophy,
  GraduationCap, Film, TrendingUp, Check, Zap, Calendar, MapPin, DollarSign,
} from 'lucide-react';
import { eventsAPI } from '../api/index.js';
import EventCard from '../Components/EventCard.jsx';

/* ─── Static config ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { name: 'Music',        icon: Music,         dot: 'bg-red-500'    },
  { name: 'Business',     icon: Briefcase,     dot: 'bg-blue-500'   },
  { name: 'Food & Drink', icon: Utensils,      dot: 'bg-orange-500' },
  { name: 'Arts',         icon: Palette,       dot: 'bg-purple-500' },
  { name: 'Fitness',      icon: Heart,         dot: 'bg-pink-500'   },
  { name: 'Gaming',       icon: Gamepad2,      dot: 'bg-green-500'  },
  { name: 'Sports',       icon: Trophy,        dot: 'bg-yellow-500' },
  { name: 'Education',    icon: GraduationCap, dot: 'bg-indigo-500' },
  { name: 'Film & Media', icon: Film,          dot: 'bg-cyan-500'   },
  { name: 'Technology',   icon: TrendingUp,    dot: 'bg-violet-500' },
];

const DATE_FILTERS = [
  { label: 'Any date',     value: ''           },
  { label: 'Today',        value: 'today'      },
  { label: 'Tomorrow',     value: 'tomorrow'   },
  { label: 'This weekend', value: 'weekend'    },
  { label: 'This week',    value: 'this-week'  },
  { label: 'Next week',    value: 'next-week'  },
  { label: 'This month',   value: 'this-month' },
];

const PRICE_OPTS = [
  { label: 'Any price',    value: '',         min: '',    max: ''    },
  { label: 'Free',         value: 'free',     min: '0',   max: '0'  },
  { label: 'Under KES 50', value: 'under-50', min: '0',   max: '50' },
  { label: 'KES 50–100',   value: '50-100',   min: '50',  max: '100'},
  { label: 'Over KES 100', value: 'over-100', min: '100', max: ''   },
];

const EMPTY_FILTERS = { category: '', priceRange: '', date: '', location: '', minPrice: '', maxPrice: '', eventType: '' };

/* ─── Skeleton card ─────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
    <div className="h-44 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-2.5 w-2/5 rounded bg-gray-100 animate-pulse" />
      <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
      <div className="h-3 w-3/5 rounded bg-gray-100 animate-pulse" />
      <div className="flex gap-2 pt-1">
        <div className="h-2.5 w-1/3 rounded bg-gray-100 animate-pulse" />
        <div className="h-2.5 w-1/3 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  </div>
);

/* ─── Filter panel (sidebar + mobile drawer) ────────────────────────── */
const FilterPanel = ({ filters, setFilters, searchTerm, setSearchTerm, setPagination, onClose }) => {
  const update = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPagination(p => ({ ...p, page: 1 }));
  };

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSearchTerm('');
    setPagination(p => ({ ...p, page: 1 }));
  };

  const LABELS = { category: 'Category', priceRange: 'Price', date: 'Date', location: 'Location', minPrice: 'Min', maxPrice: 'Max', eventType: 'Type' };
  const activeTags = [];
  if (searchTerm) activeTags.push({ key: 'search', label: `"${searchTerm}"` });
  Object.entries(filters).forEach(([k, v]) => { if (v) activeTags.push({ key: k, label: `${LABELS[k]}: ${v}` }); });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">Filters</span>
        <div className="flex items-center gap-3">
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Active tags */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeTags.map(tag => (
            <span key={tag.key} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-900 text-white rounded-full text-[11px] font-medium">
              {tag.label}
              <button
                onClick={() => tag.key === 'search' ? setSearchTerm('') : update(tag.key, '')}
                className="opacity-60 hover:opacity-100 transition-opacity flex items-center"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <hr className="border-gray-100" />

      {/* Category */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2.5">Event Type</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map(cat => {
            const active = filters.category === cat.name.toLowerCase();
            return (
              <button
                key={cat.name}
                onClick={() => update('category', active ? '' : cat.name.toLowerCase())}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded border text-left transition-all ${
                  active
                    ? 'border-gray-900 bg-gray-900'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${cat.dot}`} />
                <cat.icon size={13} className={active ? 'text-white/70' : 'text-gray-400'} />
                <span className={`text-[13px] font-medium ${active ? 'text-white' : 'text-gray-700'}`}>{cat.name}</span>
                {active && <Check size={12} className="ml-auto text-yellow-300" />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Location */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2.5">Location</p>
        <div className="relative">
          <select
            value={filters.location}
            onChange={e => update('location', e.target.value)}
            className="w-full appearance-none px-3 py-2 border border-gray-200 rounded text-[13px] text-gray-700 bg-white focus:outline-none focus:border-gray-900 cursor-pointer pr-8"
          >
            <option value="">Anywhere</option>
            <option value="online">Online</option>
            <option value="nairobi">Nairobi</option>
            <option value="mombasa">Mombasa</option>
            <option value="kisumu">Kisumu</option>
            <option value="nakuru">Nakuru</option>
            <option value="eldoret">Eldoret</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Price */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2.5">Price</p>
        <div className="flex flex-col gap-1">
          {PRICE_OPTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilters(f => ({ ...f, priceRange: opt.value, minPrice: opt.min, maxPrice: opt.max }))}
              className={`text-left px-3 py-2 rounded border text-[13px] font-medium transition-all ${
                filters.priceRange === opt.value
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2.5">
          <input
            type="number"
            placeholder="Min KES"
            value={filters.minPrice}
            onChange={e => update('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] text-gray-700 focus:outline-none focus:border-gray-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <input
            type="number"
            placeholder="Max KES"
            value={filters.maxPrice}
            onChange={e => update('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] text-gray-700 focus:outline-none focus:border-gray-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Main page ─────────────────────────────────────────────────────── */
const EventListings = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const hasActiveFilters = Object.values(filters).some(v => v !== '') || searchTerm !== '';
  const activeCount = Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0);

  useEffect(() => { fetchEvents(); }, [pagination.page, filters, sortBy]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: pagination.limit, page: pagination.page, search: searchTerm || undefined, ...filters, sortBy: sortBy || undefined };
      Object.keys(params).forEach(k => { if (!params[k] && params[k] !== 0) delete params[k]; });
      const response = await eventsAPI.getAll(params);
      const data = response.data?.data || response.data || [];
      setEvents(data);
      setPagination(prev => ({
        ...prev,
        total: response.data?.pagination?.total || data.length,
        totalPages: response.data?.pagination?.totalPages || 1,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 w-screen">

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-14">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-gray-400 shrink-0">
              <Link to="/" className="hover:text-gray-600 transition-colors flex items-center">
                <Home size={13} />
              </Link>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-medium">Events</span>
            </div>

            {/* Search */}
            <div className="flex-1 flex items-center gap-2.5 h-9 bg-gray-50 border border-gray-200 rounded px-3 focus-within:border-gray-900 transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search events, venues, artists..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                onKeyDown={e => e.key === 'Enter' && fetchEvents()}
                className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 transition-colors flex items-center">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-all ${
                  showFilters || hasActiveFilters
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-900'
                }`}
              >
                <SlidersHorizontal size={13} />
                Filters
                {activeCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-yellow-300 text-gray-900 text-[10px] font-bold flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
              <Link to="/create-event">
                <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-yellow-300 text-gray-900 text-[13px] font-semibold hover:bg-yellow-400 transition-colors">
                  <Zap size={13} />
                  Create Event
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Date filter strip ──────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-2.5 [&::-webkit-scrollbar]:hidden">
            {DATE_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => { setFilters(prev => ({ ...prev, date: f.value })); setPagination(p => ({ ...p, page: 1 })); }}
                className={`shrink-0 inline-flex items-center px-3.5 py-1.5 rounded-full border text-[13px] font-medium transition-all whitespace-nowrap ${
                  filters.date === f.value
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* Sidebar – desktop only */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                key="sidebar"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 256 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <div className="w-64 bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
                  <FilterPanel
                    filters={filters}
                    setFilters={setFilters}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setPagination={setPagination}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Controls row */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-[13px] text-gray-400">
                {loading ? 'Loading...' : (
                  <><span className="text-gray-900 font-semibold">{events.length}</span> of <span className="text-gray-900 font-semibold">{pagination.total}</span> events</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => { setSortBy(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                    className="appearance-none px-3 py-1.5 pr-8 border border-gray-200 rounded text-[12px] font-medium text-gray-700 bg-white focus:outline-none focus:border-gray-900 cursor-pointer"
                  >
                    <option value="date">Date</option>
                    <option value="price-low">Price ↑</option>
                    <option value="price-high">Price ↓</option>
                    <option value="name">Name A–Z</option>
                    <option value="recent">Most Recent</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="flex bg-gray-100 border border-gray-200 rounded p-0.5 gap-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <Grid size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    <List size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-2.5'}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : events.length > 0 ? (
              <>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4' : 'flex flex-col gap-2.5'}>
                  {events.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-12">
                    <button
                      disabled={pagination.page === 1}
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                      className="px-3.5 h-9 rounded border border-gray-200 text-[13px] font-semibold text-gray-700 bg-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-default transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(7, pagination.totalPages) }, (_, i) => {
                      let pn;
                      if (pagination.totalPages <= 7) pn = i + 1;
                      else if (pagination.page <= 4) pn = i + 1;
                      else if (pagination.page >= pagination.totalPages - 3) pn = pagination.totalPages - 6 + i;
                      else pn = pagination.page - 3 + i;
                      return (
                        <button
                          key={pn}
                          onClick={() => setPagination(p => ({ ...p, page: pn }))}
                          className={`w-9 h-9 rounded border text-[13px] font-semibold transition-colors ${
                            pagination.page === pn
                              ? 'bg-gray-900 border-gray-900 text-white'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-900'
                          }`}
                        >
                          {pn}
                        </button>
                      );
                    })}
                    <button
                      disabled={pagination.page === pagination.totalPages}
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                      className="px-3.5 h-9 rounded border border-gray-200 text-[13px] font-semibold text-gray-700 bg-white hover:border-gray-900 disabled:opacity-30 disabled:cursor-default transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 px-6 bg-white border border-gray-200 rounded-xl"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search size={20} className="text-gray-400" />
                </div>
                <p className="text-lg font-bold text-gray-900 mb-2">No events found</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto mb-5 leading-relaxed">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={() => { setFilters(EMPTY_FILTERS); setSearchTerm(''); }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Clear filters
                </button>
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Browse by category</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {CATEGORIES.slice(0, 6).map(cat => (
                      <button
                        key={cat.name}
                        onClick={() => { setFilters(f => ({ ...f, category: cat.name.toLowerCase() })); setPagination(p => ({ ...p, page: 1 })); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-[13px] font-medium text-gray-600 hover:border-gray-900 transition-colors"
                      >
                        <span className={`w-2 h-2 rounded-full ${cat.dot}`} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ───────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[min(88vw,340px)] bg-white z-50 overflow-y-auto p-6 lg:hidden"
            >
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setPagination={setPagination}
                onClose={() => setShowFilters(false)}
              />
              <div className="flex gap-2.5 mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={() => { setFilters(EMPTY_FILTERS); setSearchTerm(''); }}
                  className="flex-1 py-2 rounded-full border border-gray-200 text-[13px] font-medium text-gray-700 hover:border-gray-900 transition-colors"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2 rounded-full bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-700 transition-colors"
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventListings;