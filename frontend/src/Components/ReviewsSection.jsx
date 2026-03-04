import { useState, useEffect } from 'react';
import { Star, Send, ThumbsUp, Flag, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';

const ReviewsSection = ({ eventId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      // const response = await reviewsAPI.getByEvent(eventId);
      // setReviews(response.data.data || []);
      
      // Temporary mock data for demonstration
      setReviews([
        {
          id: 1,
          user_name: 'John Doe',
          rating: 5,
          comment: 'Amazing event! Learned so much and networked with great people.',
          created_at: new Date().toISOString(),
          helpful: 12,
          isVerified: true,
        },
        {
          id: 2,
          user_name: 'Jane Smith',
          rating: 4,
          comment: 'Great content and speakers. Venue could have been better organized.',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          helpful: 8,
          isVerified: true,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to write a review');
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      // await reviewsAPI.create({ eventId, ...newReview });
      
      // Optimistic update
      const review = {
        id: Date.now(),
        user_name: user?.user_name || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString(),
        helpful: 0,
        isVerified: true,
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    // await reviewsAPI.markHelpful(reviewId);
    setReviews(reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    // await reviewsAPI.delete(reviewId);
    setReviews(reviews.filter(r => r.id !== reviewId));
    toast.success('Review deleted');
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Reviews & Ratings
      </h2>

      {/* Rating Summary */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex gap-1 justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(r => r.rating === rating).length;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-3">{rating}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Write a Review
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= newReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Review
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this event..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !newReview.comment.trim()}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Login to write a review and share your experience
          </p>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Login Now
          </button>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this event!
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwner={user?.id === review.user_id}
              onHelpful={() => handleHelpful(review.id)}
              onDelete={() => handleDelete(review.id)}
              onEdit={() => {
                setEditingId(review.id);
                setNewReview({ rating: review.rating, comment: review.comment });
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ReviewCard = ({ review, isOwner, onHelpful, onDelete, onEdit }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
            {review.user_name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {review.user_name}
              </p>
              {review.isVerified && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium">
                  Verified Attendee
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {review.comment}
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={onHelpful}
          className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          Helpful ({review.helpful})
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">
          <Flag className="w-4 h-4" />
          Report
        </button>
        {isOwner && (
          <>
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
