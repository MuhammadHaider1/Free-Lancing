import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function Reviews({ freelancerId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get(`/reviews/?freelancer=${freelancerId}`);
        setReviews(
          Array.isArray(res.data.results) ? res.data.results : res.data
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (freelancerId) {
      fetchReviews();
    }
  }, [freelancerId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reviews</h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"
          />
        </div>
      ) : reviews.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-sm"
        >
          No reviews yet
        </motion.p>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-5"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{review.client_name}</h3>
                  <span className="text-yellow-500 text-sm">
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>

                <p className="mt-3 text-gray-700 text-sm">{review.comment}</p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default Reviews;