import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Ticket, XCircle, CheckCircle, AlertCircle,
  Home, ChevronRight, Search, Grid, List, QrCode, Star, ArrowRight, X,
} from 'lucide-react';
import { registrationsAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';

/* ─── Status config ─────────────────────────────────────────────────── */
const STATUS = {
  confirmed: { label: 'Confirmed', icon: CheckCircle, dot: 'bg-green-500',  pill: 'bg-green-50 text-green-700 border-green-200'  },
  pending:   { label: 'Pending',   icon: AlertCircle, dot: 'bg-amber-500',  pill: 'bg-amber-50 text-amber-700 border-amber-200'   },
  cancelled: { label: 'Cancelled', icon: XCircle,     dot: 'bg-red-400',    pill: 'bg-red-50 text-red-600 border-red-200'         },
};
const getStatus = (s) => STATUS[s] || STATUS.pending;

/* ─── Date helpers ──────────────────────────────────────────────────── */
const fmtDate = (d) => {
  if (!d) return '';
  const date = new Date(d), now = new Date();
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === new Date(now.getTime() + 86400000).toDateString()) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

/* ─── Skeleton ──────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-12 h-14 rounded-lg bg-gray-100 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
    <div className="h-3 w-2/3 bg-gray-100 rounded animate-pulse" />
    <div className="flex gap-2 pt-1">
      <div className="h-7 w-24 bg-gray-100 rounded animate-pulse" />
      <div className="h-7 w-20 bg-gray-100 rounded animate-pulse" />
    </div>
  </div>
);

/* ─── Registration card ─────────────────────────────────────────────── */
const RegistrationCard = ({ registration, onCancel, viewMode, index }) => {
  const event = registration.event || registration;
  const isPast = new Date(event.event_start_date) <= new Date();
  const canCancel = registration.status !== 'cancelled' && !isPast;
  const sc = getStatus(registration.status);
  const StatusIcon = sc.icon;
  const day = new Date(event.event_start_date).getDate();
  const mon = new Date(event.event_start_date).toLocaleString('default', { month: 'short' });

  const anim = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.2, delay: Math.min(index * 0.04, 0.2) },
  };

  const detailHref = `/event-details/${event.id}/${encodeURIComponent(event.event_title)}`;

  if (viewMode === 'list') {
    return (
      <motion.div {...anim} layout>
        <div className="group flex bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-900 hover:shadow-[3px_3px_0_#111827]">
          {/* Date strip */}
          <div className="w-16 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center py-4 gap-0.5">
            <span className="text-xl font-bold text-gray-900 leading-none">{day}</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{mon}</span>
          </div>

          {/* Body */}
          <div className="flex flex-1 items-center justify-between gap-4 px-4 py-3 min-w-0 flex-wrap">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[15px] font-bold text-gray-900 truncate">{event.event_title}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${sc.pill}`}>
                  <StatusIcon size={10} />
                  {sc.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={11} />{fmtDate(event.event_start_date)} · {fmtTime(event.event_start_date)}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={11} /><span className="max-w-[160px] truncate">{event.event_location}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link to={detailHref} className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
                Details <ArrowRight size={11} />
              </Link>
              {registration.status === 'confirmed' && !isPast && (
                <Link to={`/tickets/${registration.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">
                  <Ticket size={11} /> Ticket
                </Link>
              )}
              {canCancel && (
                <button onClick={() => onCancel(event.id)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-red-200 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                  <XCircle size={11} /> Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* Grid */
  return (
    <motion.div {...anim} layout>
      <div className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden h-full transition-all duration-200 hover:border-gray-900 hover:shadow-[3px_3px_0_#111827]">
        {/* Header row */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{sc.label}</span>
          </div>
          <span className="text-[11px] text-gray-400">Reg. {fmtDate(registration.created_at)}</span>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Date + title */}
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-12 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center py-2 gap-0">
              <span className="text-lg font-bold text-gray-900 leading-none">{day}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{mon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">{event.event_title}</h3>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Clock size={12} className="shrink-0" />
              {fmtDate(event.event_start_date)} · {fmtTime(event.event_start_date)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin size={12} className="shrink-0" />
              <span className="truncate">{event.event_location}</span>
            </span>
          </div>

          {event.event_description && (
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{event.event_description}</p>
          )}

          {/* Footer */}
          <div className="flex items-center gap-1.5 pt-3 mt-auto border-t border-gray-100 flex-wrap">
            <Link to={detailHref} className="flex-1 inline-flex items-center justify-center px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
              View Event
            </Link>
            {registration.status === 'confirmed' && !isPast && (
              <Link to={`/tickets/${registration.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-yellow-300 text-gray-900 text-xs font-semibold hover:bg-yellow-400 transition-colors">
                <Ticket size={11} /> Ticket
              </Link>
            )}
            {canCancel && (
              <button onClick={() => onCancel(event.id)} className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-200 text-red-400 hover:border-red-300 hover:bg-red-50 transition-colors">
                <XCircle size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Empty state ───────────────────────────────────────────────────── */
const EmptyState = ({ filter, searchTerm }) => {
  const msg = searchTerm
    ? { title: 'No results', sub: `Nothing matches "${searchTerm}".` }
    : {
        all:       { title: 'No registrations yet',       sub: 'Browse events and register for one to get started.' },
        confirmed: { title: 'No confirmed registrations', sub: 'Your confirmed bookings will appear here.'          },
        pending:   { title: 'No pending registrations',   sub: 'Nothing waiting for confirmation right now.'       },
        cancelled: { title: 'No cancelled registrations', sub: 'Looks like you haven\'t cancelled anything.'       },
      }[filter] || { title: 'Nothing here', sub: '' };

  const { title, sub } = msg.title ? msg : msg;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 px-6 bg-white border border-gray-200 rounded-xl">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Ticket size={20} className="text-gray-400" />
      </div>
      <p className="text-lg font-bold text-gray-900 mb-1.5">{title}</p>
      <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6 leading-relaxed">{sub}</p>
      {!searchTerm && (
        <div className="flex gap-2 justify-center flex-wrap">
          <Link to="/event-listings" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors">
            Browse Events <ArrowRight size={13} />
          </Link>
          <Link to="/saved-events" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:border-gray-900 transition-colors">
            <Star size={13} /> Saved
          </Link>
        </div>
      )}
    </motion.div>
  );
};

/* ─── Main page ─────────────────────────────────────────────────────── */
const MyRegistrations = () => {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (!user || !token) { navigate('/login'); return; }
    fetchRegistrations();
  }, [user, token, filter]);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await registrationsAPI.getUserRegistrations(user.id, filter !== 'all' ? filter : undefined);
      if (res.data.success) setRegistrations(res.data.data || []);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, [user?.id, filter]);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Cancel this registration? This cannot be undone.')) return;
    try {
      const res = await registrationsAPI.cancel(user.id, eventId);
      if (res.data.success) { toast.success('Registration cancelled'); fetchRegistrations(); }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to cancel');
    }
  };

  const stats = useMemo(() => ({
    total:     registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    pending:   registrations.filter(r => r.status === 'pending').length,
    cancelled: registrations.filter(r => r.status === 'cancelled').length,
  }), [registrations]);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? registrations : registrations.filter(r => r.status === filter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(r => {
        const e = r.event || r;
        return e.event_title?.toLowerCase().includes(q) || e.event_location?.toLowerCase().includes(q);
      });
    }
    return list;
  }, [registrations, filter, searchTerm]);

  const TABS = [
    { id: 'all',       label: 'All',       count: stats.total     },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmed  },
    { id: 'pending',   label: 'Pending',   count: stats.pending   },
    { id: 'cancelled', label: 'Cancelled', count: stats.cancelled  },
  ];

  if (!user || !token) return null;

  return (
    <div className="min-h-screen bg-gray-50 w-screen">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center flex-wrap gap-4 min-h-14 p-1">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[13px] text-gray-400 shrink-0">
              <Link to="/" className="hover:text-gray-600 transition-colors"><Home size={13} /></Link>
              <ChevronRight size={12} />
              <span className="text-gray-900 font-medium">My Registrations</span>
            </div>

            {/* Search */}
            <div className="flex-1 flex items-center gap-2.5 h-9 bg-gray-50 border border-gray-200 rounded px-3 focus-within:border-gray-900 transition-colors">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by event or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 flex items-center">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex bg-gray-100 border border-gray-200 rounded p-0.5 gap-0.5 shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
                <Grid size={14} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            {/* Title + stats */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">My Registrations</h1>
              <p className="text-sm text-gray-400">Manage your event bookings and tickets.</p>
            </div>
            {/* Stat pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Total',     val: stats.total,     cls: 'bg-gray-100 text-gray-700'    },
                { label: 'Confirmed', val: stats.confirmed, cls: 'bg-green-50 text-green-700'   },
                { label: 'Pending',   val: stats.pending,   cls: 'bg-amber-50 text-amber-700'   },
                { label: 'Cancelled', val: stats.cancelled, cls: 'bg-red-50 text-red-600'       },
              ].map(s => (
                <span key={s.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.cls}`}>
                  <span className="text-base font-extrabold leading-none">{s.val}</span>
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden pb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border-b-2 transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${filter === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2.5'}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} searchTerm={searchTerm} />
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2.5'}>
            <AnimatePresence>
              {filtered.map((reg, i) => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  onCancel={handleCancel}
                  viewMode={viewMode}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;