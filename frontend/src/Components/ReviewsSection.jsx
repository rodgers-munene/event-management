import { useState, useEffect } from 'react';
import { Star, Send, ThumbsUp, Flag, Trash2, Pencil, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';

/* ─── Star row ──────────────────────────────────────────────────────── */
const Stars = ({ rating, size = 13, interactive = false, onChange }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => onChange(s) : undefined}
        className={interactive ? 'focus:outline-none' : undefined}
        tabIndex={interactive ? 0 : -1}
      >
        <Star
          size={size}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}
        />
      </button>
    ))}
  </div>
);

/* ─── Single review ─────────────────────────────────────────────────── */
const ReviewCard = ({ review, isOwner, onHelpful, onDelete, onEdit }) => (
  <div className="py-5 border-b border-gray-100 last:border-0">
    <div className="flex items-start justify-between gap-3 mb-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {(review.user_name || 'A')[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[13px] font-bold text-gray-900">{review.user_name}</p>
            {review.isVerified && (
              <span className="px-1.5 py-0.5 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">
                Verified
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400">
            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      <Stars rating={review.rating} />
    </div>

    <p className="text-[14px] text-gray-600 leading-relaxed mb-3 ml-11">{review.comment}</p>

    <div className="flex items-center gap-4 ml-11">
      <button onClick={onHelpful} className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
        <ThumbsUp size={11} /> Helpful ({review.helpful})
      </button>
      <button className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-red-500 transition-colors">
        <Flag size={11} /> Report
      </button>
      {isOwner && (
        <>
          <button onClick={onEdit} className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
            <Pencil size={11} /> Edit
          </button>
          <button onClick={onDelete} className="flex items-center gap-1 text-[12px] text-red-400 hover:text-red-600 transition-colors">
            <Trash2 size={11} /> Delete
          </button>
        </>
      )}
    </div>
  </div>
);

/* ─── Main ──────────────────────────────────────────────────────────── */
const ReviewsSection = ({ eventId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Replace with: const res = await reviewsAPI.getByEvent(eventId); setReviews(res.data.data || []);
    setTimeout(() => {
      setReviews([
        { id: 1, user_name: 'John Doe',   rating: 5, comment: 'Amazing event! Learned so much and networked with great people.', created_at: new Date().toISOString(),                    helpful: 12, isVerified: true },
        { id: 2, user_name: 'Jane Smith', rating: 4, comment: 'Great content and speakers. Venue could have been better organized.', created_at: new Date(Date.now() - 86400000).toISOString(), helpful: 8,  isVerified: true },
      ]);
      setLoading(false);
    }, 0);
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
    if (!newReview.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      // await reviewsAPI.create({ eventId, ...newReview });
      const review = { id: Date.now(), user_name: user?.user_name || 'Anonymous', rating: newReview.rating, comment: newReview.comment, created_at: new Date().toISOString(), helpful: 0, isVerified: true };
      setReviews(p => [review, ...p]);
      setNewReview({ rating: 5, comment: '' });
      setEditingId(null);
      toast.success('Review submitted');
    } catch { toast.error('Failed to submit review'); }
    finally { setSubmitting(false); }
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-5">Reviews & Ratings</p>

      {/* Summary */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
        <div className="text-center shrink-0">
          <p className="text-4xl font-extrabold text-gray-900 leading-none mb-1">{avg.toFixed(1)}</p>
          <Stars rating={Math.round(avg)} />
          <p className="text-[11px] text-gray-400 mt-1">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map(n => {
            const count = reviews.filter(r => r.rating === n).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={n} className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 w-2.5">{n}</span>
                <Star size={9} className="text-yellow-400 fill-yellow-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] text-gray-400 w-4 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write review */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Write a Review</p>

          <div className="mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Rating</p>
            <Stars rating={newReview.rating} size={22} interactive onChange={r => setNewReview(p => ({ ...p, rating: r }))} />
          </div>

          <div className="mb-3">
            <textarea
              value={newReview.comment}
              onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))}
              placeholder="Share your experience…"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors bg-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !newReview.comment.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-gray-900 text-white text-[12px] font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <><Loader2 size={12} className="animate-spin" /> Submitting…</> : <><Send size={12} /> Submit Review</>}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-[13px] text-gray-400 mb-2">Login to share your experience</p>
          <a href="/login" className="text-[13px] font-semibold text-gray-900 hover:underline">Login</a>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-center text-[13px] text-gray-400 py-6">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-[13px] text-gray-400 py-6">No reviews yet. Be the first!</p>
      ) : (
        <div>
          {reviews.map(r => (
            <ReviewCard
              key={r.id}
              review={r}
              isOwner={user?.id === r.user_id}
              onHelpful={() => setReviews(p => p.map(x => x.id === r.id ? { ...x, helpful: x.helpful + 1 } : x))}
              onDelete={() => { if (window.confirm('Delete this review?')) { setReviews(p => p.filter(x => x.id !== r.id)); toast.success('Review deleted'); }}}
              onEdit={() => { setEditingId(r.id); setNewReview({ rating: r.rating, comment: r.comment }); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;