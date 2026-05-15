import { useEffect, useState } from 'react';
import { FiStar, FiX } from 'react-icons/fi';
import { addReview, getMyReview } from '../../services/api';
import toast from 'react-hot-toast';

export default function RatingPopup({ product, onClose }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH DIRECTLY FROM BACKEND - 100% FRESH DATA
  useEffect(() => {
    const fetchReview = async () => {
      try {
        // Safe ID extraction - handles both product object and raw string ID
        const productId = product?._id || product;
        const { data } = await getMyReview(productId);
        if (data.review) {
          setRating(data.review.rating);
          setComment(data.review.comment || '');
          setAlreadyReviewed(true);
        } else {
          setRating(0);
          setComment('');
          setAlreadyReviewed(false);
        }
      } catch (err) {
        console.log("Review fetch error:", err);
      }
    };

    if (product?._id) {
      fetchReview();
    }
  }, [product?._id]);

  // ✅ SUBMIT / UPDATE
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Safe ID extraction - handles both product object and raw string ID
      const productId = product?._id || product;

      await addReview(productId, {
        rating,
        comment
      });

      toast.success(
        alreadyReviewed
          ? "Review updated! ⭐"
          : "Thanks for your review! ⭐"
      );
      onClose();

    } catch (err) {
      console.log(err.response);
      toast.error(err.response?.data?.message || "Failed to save review");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-sm animate-fade-in">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {alreadyReviewed ? "Your Review" : "Rate this product"}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-4">
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/100'} 
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover mx-auto mb-3"
          />
          <p className="font-semibold text-gray-900">{product.name}</p>
        </div>

        {/* ⭐ STARS */}
        <div className="flex justify-center gap-2 mb-4">
          {[1,2,3,4,5].map((star) => (
            <FiStar
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className={`cursor-pointer text-2xl transition-transform hover:scale-110 ${
                (hover || rating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* COMMENT */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border rounded-lg p-3 text-sm mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2.5 rounded-lg w-full font-medium transition active:scale-95"
        >
          {loading ? 'Saving...' : alreadyReviewed ? "Update Review" : "Submit Review"}
        </button>

      </div>
    </div>
  );
}