import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Smartphone, Building, Wallet, CheckCircle,
  Shield, Lock, Calendar, MapPin, Clock, User, Mail, Phone,
  AlertCircle, Info, ChevronRight, Home, ArrowRight,
} from 'lucide-react';
import { eventsAPI, paymentsAPI } from '../api/index.js';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';
import slugify from 'slugify';

/* ─── Helpers ───────────────────────────────────────────────────────── */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
const fmtTime = (d) => d ? new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';

/* ─── Payment methods ───────────────────────────────────────────────── */
const METHODS = [
  { id: 'M-Pesa',        name: 'M-Pesa',        icon: Smartphone, sub: 'Mobile money'     },
  { id: 'Credit Card',   name: 'Credit Card',   icon: CreditCard, sub: 'Visa, Mastercard' },
  { id: 'Bank Transfer', name: 'Bank Transfer', icon: Building,   sub: 'Direct transfer'  },
  { id: 'PayPal',        name: 'PayPal',        icon: Wallet,     sub: 'PayPal account'   },
];

/* ─── Field component ───────────────────────────────────────────────── */
const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-[11px] text-red-500">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full px-3 py-2.5 border rounded text-[13px] text-gray-900 bg-white focus:outline-none transition-colors placeholder-gray-300 ${
    err ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-gray-900'
  }`;

/* ─── Loading skeleton ──────────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="h-14 bg-white border-b border-gray-200 animate-pulse" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="h-[500px] bg-gray-200 rounded-xl animate-pulse" />
      </div>
    </div>
  </div>
);

/* ─── Success screen ────────────────────────────────────────────────── */
const SuccessScreen = ({ event, formData, onViewEvent }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
        className="w-16 h-16 bg-green-100 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle size={28} className="text-green-600" />
      </motion.div>

      <p className="text-xl font-bold text-gray-900 mb-1">Payment successful</p>
      <p className="text-sm text-gray-400 mb-6">
        You're registered for <span className="font-semibold text-gray-700">{event.event_title}</span>
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Amount paid</span>
          <span className="font-bold text-gray-900">KES {event.event_price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Transaction ID</span>
          <span className="font-mono text-gray-700 text-xs">{formData.transaction_id || '—'}</span>
        </div>
        <div className="pt-2 border-t border-gray-200 text-xs text-gray-400">
          Confirmation sent to <span className="font-medium text-gray-600">{formData.participant_email}</span>
        </div>
      </div>

      <button
        onClick={onViewEvent}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
      >
        View Event <ArrowRight size={13} />
      </button>
      <p className="text-xs text-gray-400 mt-3">Redirecting automatically…</p>
    </motion.div>
  </div>
);

/* ─── Main ──────────────────────────────────────────────────────────── */
const Pay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    participant_name: user?.name || '',
    participant_email: user?.email || '',
    participant_number: '',
    payment_method: 'M-Pesa',
    transaction_id: '',
  });

  useEffect(() => { loadEvent(); }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getById(id);
      if (res.data.success) setEvent(res.data.data);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.participant_name?.trim() || formData.participant_name.trim().length < 2)
      e.participant_name = 'Enter your full name';
    if (!formData.participant_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.participant_email))
      e.participant_email = 'Enter a valid email address';
    if (!formData.participant_number || formData.participant_number.replace(/\s/g, '').length < 10)
      e.participant_number = 'Enter a valid phone number';
    if (!formData.transaction_id && formData.payment_method !== 'Credit Card')
      e.transaction_id = 'Enter the transaction ID';
    if (!user) { toast.error('Please login to complete payment'); navigate('/login'); return false; }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setProcessing(true);
    try {
      const res = await paymentsAPI.create({
        event_id: parseInt(id),
        participant_name: formData.participant_name,
        participant_number: formData.participant_number,
        amount: parseFloat(event.event_price || 0),
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id || `TXN-${Date.now()}`,
      });
      if (res.data.success) {
        setSuccess(true);
        toast.success('Payment successful!');
        setTimeout(() => navigate(`/event-details/${id}/${slugify(event.event_title, { lower: true, strict: true })}`), 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  if (!event) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={20} className="text-gray-400" />
        </div>
        <p className="text-lg font-bold text-gray-900 mb-1">Event not found</p>
        <p className="text-sm text-gray-400 mb-5">This event may have been removed.</p>
        <Link to="/event-listings" className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
          Browse Events <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );

  if (success) return (
    <SuccessScreen
      event={event}
      formData={formData}
      onViewEvent={() => navigate(`/event-details/${id}/${slugify(event.event_title, { lower: true, strict: true })}`)}
    />
  );

  const isFree = !event.event_price || event.event_price === 0;

  return (
    <div className="min-h-screen bg-gray-50 w-screen">

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 h-14 text-[13px] text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors"><Home size={13} /></Link>
            <ChevronRight size={12} />
            <Link to="/event-listings" className="hover:text-gray-600 transition-colors">Events</Link>
            <ChevronRight size={12} />
            <Link to={`/event-details/${id}`} className="hover:text-gray-600 transition-colors truncate max-w-[160px]">{event.event_title}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900 font-medium">Checkout</span>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Participant info */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Participant Information</p>
              <form id="pay-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required error={errors.participant_name}>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                      <input
                        type="text" name="participant_name" placeholder="Jane Doe"
                        value={formData.participant_name} onChange={handleChange}
                        className={`${inputCls(errors.participant_name)} pl-8`}
                      />
                    </div>
                  </Field>
                  <Field label="Email" required error={errors.participant_email}>
                    <div className="relative">
                      <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                      <input
                        type="email" name="participant_email" placeholder="jane@example.com"
                        value={formData.participant_email} onChange={handleChange}
                        className={`${inputCls(errors.participant_email)} pl-8`}
                      />
                    </div>
                  </Field>
                </div>
                <Field label="Phone Number" required error={errors.participant_number}>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      type="tel" name="participant_number" placeholder="+254 7XX XXX XXX"
                      value={formData.participant_number} onChange={handleChange}
                      className={`${inputCls(errors.participant_number)} pl-8`}
                    />
                  </div>
                </Field>
              </form>
            </motion.div>

            {/* Payment method */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
              className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Payment Method</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                {METHODS.map(({ id: mid, name, icon: Icon, sub }) => {
                  const active = formData.payment_method === mid;
                  return (
                    <button
                      key={mid} type="button"
                      onClick={() => setFormData(p => ({ ...p, payment_method: mid }))}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded border text-center transition-all ${
                        active ? 'border-gray-900 bg-gray-900' : 'border-gray-200 bg-white hover:border-gray-400'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-white' : 'text-gray-500'} />
                      <span className={`text-[12px] font-semibold ${active ? 'text-white' : 'text-gray-700'}`}>{name}</span>
                      <span className={`text-[10px] ${active ? 'text-white/60' : 'text-gray-400'}`}>{sub}</span>
                      {active && <CheckCircle size={12} className="absolute top-2 right-2 text-yellow-300" />}
                    </button>
                  );
                })}
              </div>

              {/* Transaction ID */}
              {formData.payment_method !== 'Credit Card' && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-2.5 mb-4">
                    <Info size={13} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-gray-700 mb-1">How to pay with {formData.payment_method}</p>
                      <ol className="text-[12px] text-gray-400 space-y-0.5 list-decimal list-inside">
                        <li>Open your {formData.payment_method} app</li>
                        <li>Send payment to the provided paybill/till number</li>
                        <li>Enter the transaction ID below</li>
                      </ol>
                    </div>
                  </div>
                  <Field label="Transaction ID" required error={errors.transaction_id}>
                    <input
                      type="text" name="transaction_id" placeholder="e.g. QHH123456"
                      form="pay-form"
                      value={formData.transaction_id} onChange={handleChange}
                      className={inputCls(errors.transaction_id)}
                    />
                    <p className="mt-1 text-[11px] text-gray-400">From your payment confirmation message</p>
                  </Field>
                </motion.div>
              )}
            </motion.div>

            {/* Security notice */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Shield size={15} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-gray-900 mb-1.5">Secure Payment Guarantee</p>
                  <ul className="text-[12px] text-gray-400 space-y-1">
                    <li>• Your payment info is encrypted and secure</li>
                    <li>• We never store your full card details</li>
                    <li>• Instant confirmation upon successful payment</li>
                    <li>• Full refund if the event is cancelled</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column — order summary */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="sticky top-20 space-y-3">

              {/* Summary card */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Event image */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fm=webp'}
                    alt={event.event_title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80&fm=webp'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-3 left-3 right-3 text-white text-[13px] font-bold line-clamp-2">{event.event_title}</p>
                </div>

                {/* Event meta */}
                <div className="p-4 space-y-3 border-b border-gray-100">
                  {[
                    { icon: Calendar, val: fmtDate(event.event_start_date) },
                    { icon: Clock,    val: fmtTime(event.event_start_date) },
                    { icon: MapPin,   val: event.event_location || 'TBD'   },
                  ].map(({ icon: Icon, val }, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Icon size={12} className="text-gray-400 shrink-0" />
                      <span className="text-[12px] text-gray-600 truncate">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-400">Ticket price</span>
                    <span className="font-medium text-gray-900">
                      {isFree ? 'Free' : `KES ${event.event_price?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-400">Processing fee</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-[13px] font-bold text-gray-900">Total</span>
                    <span className="text-xl font-extrabold text-gray-900">
                      {isFree ? 'Free' : `KES ${event.event_price?.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                form="pay-form"
                disabled={processing}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-900 text-white text-[14px] font-bold hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Lock size={14} />
                {processing ? 'Processing…' : isFree ? 'Complete Registration' : `Pay KES ${event.event_price?.toLocaleString()}`}
              </button>

              {/* Help */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-[12px] font-bold text-gray-900 mb-1">Need help?</p>
                <p className="text-[11px] text-gray-400 mb-2">Trouble with payment? Reach out.</p>
                <a href="mailto:support@eventhub.co.ke" className="inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  <Mail size={11} /> support@eventhub.co.ke
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pay;