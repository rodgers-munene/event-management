import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Clock, Ticket, XCircle, CheckCircle, AlertCircle,
  Home, ChevronRight, Share2, Mail, Globe, Users, Edit, Trash2,
  Shield, ArrowRight, Star, ImageOff,
} from "lucide-react";
import { eventsAPI, registrationsAPI } from "../api/index.js";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore.js";
import slugify from "slugify";
import ReviewsSection from "../Components/ReviewsSection.jsx";
import ShareModal from "../Components/ShareModal.jsx";

const fmtDate = (d) => {
  if (!d) return "";
  const date = new Date(d), now = new Date();
  if (date.toDateString() === now.toDateString()) return "Today";
  if (date.toDateString() === new Date(now.getTime() + 86400000).toDateString()) return "Tomorrow";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
};
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />
    <div className="h-[440px] bg-gray-200 animate-pulse" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="h-80 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
    <Icon size={15} className="text-gray-400 shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
      <p className="text-[14px] font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFree = !event?.event_price || event.event_price === 0;
  const isSoon = useMemo(() => {
    if (!event?.event_start_date) return false;
    const diff = Math.ceil((new Date(event.event_start_date) - new Date()) / 86400000);
    return diff <= 7 && diff >= 0;
  }, [event]);
  const isFull = useMemo(() => event?.capacity && event.registeredCount >= event.capacity, [event]);
  const duration = useMemo(() => {
    if (!event?.event_start_date || !event?.event_end_date) return "";
    const diff = new Date(event.event_end_date) - new Date(event.event_start_date);
    const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
    return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
  }, [event]);

  useEffect(() => { loadEvent(); }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getById(id);
      if (res.data.success) {
        const e = res.data.data;
        setEvent(e);
        if (user && e.user_id === user.id) setIsOwner(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated) { toast.error("Please login to register"); navigate("/login"); return; }
    if (isOwner) { toast.error("You cannot register for your own event"); return; }
    if (isFull) { toast.error("This event is full"); return; }
    try {
      const res = await registrationsAPI.register(user.id, event.id);
      if (res.data.success) { setIsRegistered(true); toast.success("Registered successfully!"); }
    } catch (e) { toast.error(e.response?.data?.message || "Registration failed"); }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm("Cancel your registration? This cannot be undone.")) return;
    try {
      const res = await registrationsAPI.cancel(user.id, event.id);
      if (res.data.success) { setIsRegistered(false); toast.success("Registration cancelled"); }
    } catch (e) { toast.error(e.response?.data?.message || "Cancellation failed"); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      setDeleting(true);
      const res = await eventsAPI.delete(id);
      if (res.data.success) { toast.success("Event deleted"); navigate("/event-listings"); }
    } catch (e) { toast.error(e.response?.data?.message || "Delete failed"); }
    finally { setDeleting(false); }
  };

  if (loading) return <LoadingSkeleton />;

  if (!event) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Calendar size={20} className="text-gray-400" />
        </div>
        <p className="text-lg font-bold text-gray-900 mb-1">Event not found</p>
        <p className="text-sm text-gray-400 mb-5">This event may have been removed.</p>
        <Link to="/event-listings" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
          Browse Events <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );

  const payHref = `/pay/${id}/${slugify(event.event_title, { lower: true, strict: true })}`;

  return (
    <div className="min-h-screen bg-gray-50 w-screen">

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 h-14 text-[13px] text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors"><Home size={13} /></Link>
            <ChevronRight size={12} />
            <Link to="/event-listings" className="hover:text-gray-600 transition-colors">Events</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium truncate max-w-[240px]">{event.event_title}</span>
          </div>
        </div>
      </header>

      {/* Hero image — fixed: absolute img + absolute overlay, no nested relative wrappers */}
      <div className="relative h-[360px] md:h-[460px] bg-gray-200 overflow-hidden">
        {!imgError && (
          <img
            src={event.image_url || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80&fm=webp"}
            alt={event.event_title}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {imgError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ImageOff size={40} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {isFree && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-yellow-300 text-gray-900">Free</span>}
              {isSoon && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-orange-500 text-white">Soon</span>}
              {isFull && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-red-500 text-white">Sold Out</span>}
              {event.category && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/20 text-white backdrop-blur-sm">{event.category}</span>}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3 drop-shadow">
              {event.event_title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <span className="flex items-center gap-1.5"><Calendar size={13} />{fmtDate(event.event_start_date)}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />{fmtTime(event.event_start_date)}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} />{event.event_location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-4">

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">About</p>
              <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line">{event.event_description}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Event Details</p>
              <div className="mt-2">
                <DetailRow icon={Calendar} label="Date"     value={fmtDate(event.event_start_date)} />
                <DetailRow icon={Clock}    label="Time"     value={`${fmtTime(event.event_start_date)}${event.event_end_date ? ` – ${fmtTime(event.event_end_date)}` : ""}`} />
                {duration && <DetailRow icon={Clock} label="Duration" value={duration} />}
                <DetailRow icon={MapPin}   label="Location" value={event.event_location || "TBD"} />
                <DetailRow icon={Users}    label="Capacity" value={`${event.registeredCount || 0} / ${event.capacity || "Unlimited"}`} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Organizer</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 text-lg font-bold text-gray-500">
                  {(event.organizer_name || "O")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-[15px]">{event.organizer_name || "Event Organizer"}</p>
                  <p className="text-xs text-gray-400">Event Host</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
                    <Mail size={12} /> Contact
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
                    <Globe size={12} /> Website
                  </button>
                </div>
              </div>
            </motion.div>

            {event.event_location && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
                className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Location</p>
                <div className="h-48 rounded-lg bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <MapPin size={24} />
                  <p className="text-sm font-medium text-gray-600">{event.event_location}</p>
                  <p className="text-xs text-gray-400">Map coming soon</p>
                </div>
              </motion.div>
            )}

            <ReviewsSection eventId={parseInt(id)} />
          </div>

          {/* Right — sticky booking card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="sticky top-20 space-y-3"
            >
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Price</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-gray-900">
                      {isFree ? "Free" : `KES ${event.event_price?.toLocaleString()}`}
                    </span>
                    {!isFree && <span className="text-xs text-gray-400">per person</span>}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  {isOwner ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3">
                        <CheckCircle size={14} className="text-gray-500 shrink-0" />
                        <p className="text-xs font-semibold text-gray-600">You are the organizer</p>
                      </div>
                      <Link to={`/create-event?edit=${id}`} className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
                        <Edit size={14} /> Edit Event
                      </Link>
                      <button onClick={handleDelete} disabled={deleting}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50">
                        <Trash2 size={14} /> {deleting ? "Deleting…" : "Delete Event"}
                      </button>
                    </>
                  ) : isRegistered ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                        <CheckCircle size={14} className="text-green-600 shrink-0" />
                        <p className="text-xs font-semibold text-green-700">You're registered!</p>
                      </div>
                      <Link to={payHref} className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
                        <Ticket size={14} /> Proceed to Payment
                      </Link>
                      <button onClick={handleCancelRegistration}
                        className="flex items-center justify-center w-full py-2.5 rounded border border-gray-200 text-gray-700 text-sm font-semibold hover:border-gray-900 transition-colors">
                        Cancel Registration
                      </button>
                    </>
                  ) : isFull ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-3">
                        <AlertCircle size={14} className="text-red-500 shrink-0" />
                        <p className="text-xs font-semibold text-red-600">Event is full</p>
                      </div>
                      <button disabled className="w-full py-2.5 rounded bg-gray-100 text-gray-400 text-sm font-semibold cursor-default">
                        Join Waitlist
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleRegister}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors">
                        <Ticket size={14} /> Register Now
                      </button>
                      <Link to={payHref} className="flex items-center justify-center w-full py-2.5 rounded bg-yellow-300 text-gray-900 text-sm font-semibold hover:bg-yellow-400 transition-colors">
                        Buy Ticket
                      </Link>
                    </>
                  )}

                  <button onClick={() => setShowShare(true)}
                    className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors">
                    <Share2 size={13} /> Share Event
                  </button>
                </div>

                <div className="px-5 pb-5 pt-0 border-t border-gray-100 mt-1 space-y-2.5">
                  <div className="flex items-start gap-2.5 pt-4">
                    <Shield size={13} className="text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Secure Registration</p>
                      <p className="text-[11px] text-gray-400">Your payment info is protected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Star size={13} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Satisfaction Guaranteed</p>
                      <p className="text-[11px] text-gray-400">Full refund if event doesn't match description</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-[13px] font-bold text-gray-900 mb-1">Need Help?</p>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">Have questions? Reach out to the organizer directly.</p>
                <button className="flex items-center justify-center gap-1.5 w-full py-2 rounded border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-900 transition-colors">
                  <Mail size={12} /> Contact Organizer
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} event={event} />
    </div>
  );
};

export default EventDetails;