import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function FreelancerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/freelancers/${id}/`);
      setFreelancer(res.data);
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Profile load nahi hui.");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/?freelancer=${id}`);
      setReviews(
        Array.isArray(res.data.results) ? res.data.results : res.data
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
        >
          ❌ {error}
        </motion.div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    { label: "Services", value: freelancer.services_count },
    { label: "Completed Jobs", value: freelancer.completed_orders },
    { label: "Rating", value: freelancer.average_rating, isRating: true },
    { label: "Reviews", value: freelancer.reviews_count },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold">{freelancer.username}</h1>
            <p className="opacity-80 mt-1">{freelancer.bio || "No bio added"}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center"
              >
                <h3 className="font-bold text-xl text-gray-800">{stat.value}</h3>
                {stat.isRating ? (
                  <p className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</p>
                ) : (
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 mt-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Services</h2>

          {!freelancer.services || freelancer.services.length === 0 ? (
            <p className="text-gray-500 text-sm">No services yet</p>
          ) : (
            <div className="space-y-3">
              {freelancer.services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <h3 className="font-semibold text-gray-800 text-sm">{service.title}</h3>
                  <span className="text-blue-600 font-bold text-sm">${service.price}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Reviews Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 mt-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Reviews</h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <h3 className="font-semibold text-gray-800 text-sm">{review.client_name}</h3>
                  <p className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</p>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default FreelancerProfile;