import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, MapPin, BarChart3, Plus, Pencil, X, Check, Calendar, Home, ChevronRight } from 'lucide-react';
import slugify from 'slugify';
import { eventsAPI, authAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';

/* ─── Input ─────────────────────────────────────────────────────────── */
const Field = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      required={type === 'text' || type === 'email'}
      className="w-full px-3 py-2 border border-gray-200 rounded text-[13px] text-gray-900 focus:outline-none focus:border-gray-900 transition-colors bg-white placeholder-gray-300"
    />
  </div>
);

/* ─── Edit form ─────────────────────────────────────────────────────── */
const EditForm = ({ user, onSave, onCancel, updating }) => {
  const [form, setForm] = useState({
    user_name:    user?.user_name    || '',
    user_email:   user?.user_email   || '',
    phone:        user?.phone        || '',
    organization: user?.organization || '',
  });
  const change = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-3">
      <Field label="Full Name"    name="user_name"    value={form.user_name}    onChange={change} />
      <Field label="Email"        name="user_email"   value={form.user_email}   onChange={change} type="email" />
      <Field label="Phone"        name="phone"        value={form.phone}        onChange={change} type="tel" />
      <Field label="Organization" name="organization" value={form.organization} onChange={change} />
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded border border-gray-200 text-[12px] font-semibold text-gray-600 hover:border-gray-900 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={updating}
          className="flex-1 py-2 rounded bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">
          {updating ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

/* ─── Profile details ───────────────────────────────────────────────── */
const ProfileDetails = ({ user }) => {
  const rows = [
    { label: 'Full Name',    value: user?.user_name    },
    { label: 'Email',        value: user?.user_email   },
    { label: 'Phone',        value: user?.phone        },
    { label: 'Organization', value: user?.organization },
    { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
  ];
  return (
    <div className="space-y-0 divide-y divide-gray-100">
      {rows.map(({ label, value }) => (
        <div key={label} className="py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
          <p className="text-[13px] font-medium text-gray-900">{value || <span className="text-gray-300 font-normal">Not provided</span>}</p>
        </div>
      ))}
    </div>
  );
};

/* ─── Event card (organizer view) ───────────────────────────────────── */
const OrganizerEventCard = ({ event }) => {
  const navigate = useNavigate();
  const date = new Date(event.event_start_date);
  const isPast = date <= new Date();
  const day = date.getDate();
  const mon = date.toLocaleString('default', { month: 'short' });

  return (
    <div className="group flex bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-900 hover:shadow-[3px_3px_0_#111827]">
      {/* Date strip */}
      <div className="w-16 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center py-4">
        <span className="text-xl font-bold text-gray-900 leading-none">{day}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{mon}</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 items-center justify-between gap-4 px-4 py-3 min-w-0 flex-wrap">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[14px] font-bold text-gray-900 truncate">{event.event_title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'
            }`}>
              {isPast ? 'Completed' : 'Upcoming'}
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} /><span className="truncate max-w-[180px]">{event.event_location}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => navigate(`/analytics/${event.id}`)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
            <BarChart3 size={11} /> Analytics
          </button>
          <button onClick={() => navigate(`/event-details/${event.id}/${slugify(event.event_title, { lower: true, strict: true })}`)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
            View
          </button>
          <button onClick={() => navigate(`/create-event?edit=${event.id}`)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors">
            <Pencil size={11} /> Edit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Empty state ───────────────────────────────────────────────────── */
const NoEvents = ({ onCreateClick }) => (
  <div className="text-center py-16 px-6 bg-white border border-gray-200 rounded-xl">
    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
      <Calendar size={20} className="text-gray-400" />
    </div>
    <p className="text-[15px] font-bold text-gray-900 mb-1">No events created yet</p>
    <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">Get started by creating your first event.</p>
    <button onClick={onCreateClick}
      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-700 transition-colors">
      <Plus size={13} /> Create Your First Event
    </button>
  </div>
);

/* ─── Loading skeleton ──────────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />
    <div className="h-[120px] bg-white border-b border-gray-200 animate-pulse" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-72 bg-gray-200 rounded-xl animate-pulse" />
        <div className="lg:col-span-2 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />)}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Main page ─────────────────────────────────────────────────────── */
const ProfilePage = () => {
  const { user, token, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user || !token) { navigate('/login'); return; }
    eventsAPI.getUserEvents(user.id)
      .then(r => { if (r.data.success) setEvents(r.data.data || []); })
      .catch(() => toast.error('Failed to load profile data'))
      .finally(() => setLoading(false));
  }, [user, token]);

  const handleUpdate = async (data) => {
    setUpdating(true);
    try {
      const r = await authAPI.updateProfile(user.id, data);
      if (r.data.success) { setAuth(r.data.data, token); setIsEditing(false); toast.success('Profile updated'); }
    } catch (e) { toast.error(e.response?.data?.message || 'Update failed'); }
    finally { setUpdating(false); }
  };

  if (loading) return <LoadingSkeleton />;

  const upcoming  = events.filter(e => new Date(e.event_start_date) > new Date());
  const completed = events.filter(e => new Date(e.event_start_date) <= new Date());
  const initials  = (user?.user_name || 'U')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 w-screen">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 h-16 text-[13px] text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors"><Home size={13} /></Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">My Profile</span>
          </div>
        </div>
      </header>

      {/* ── Profile header ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 leading-tight">{user?.user_name}</p>
                <p className="text-[13px] text-gray-400">{user?.user_email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8">
              {[
                { val: events.length,     label: 'Events'    },
                { val: upcoming.length,   label: 'Upcoming'  },
                { val: completed.length,  label: 'Completed' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{val}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Profile info */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Profile Info</p>
                <button
                  onClick={() => setIsEditing(e => !e)}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {isEditing ? <><X size={12} /> Cancel</> : <><Pencil size={12} /> Edit</>}
                </button>
              </div>

              {isEditing
                ? <EditForm user={user} onSave={handleUpdate} onCancel={() => setIsEditing(false)} updating={updating} />
                : <ProfileDetails user={user} />
              }
            </div>
          </div>

          {/* Right — Events */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Your Events</p>
              <button
                onClick={() => navigate('/create-event')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-700 transition-colors"
              >
                <Plus size={12} /> Create Event
              </button>
            </div>

            {events.length === 0
              ? <NoEvents onCreateClick={() => navigate('/create-event')} />
              : (
                <div className="space-y-2.5">
                  {events.map(ev => <OrganizerEventCard key={ev.id} event={ev} />)}
                </div>
              )
            }
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;