import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function Freelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    try {
      const res = await API.get("/users/freelancers/");
      setFreelancers(res.data.results || res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold">Available Freelancers</h1>
            <p className="opacity-80 mt-1">Browse profiles and find the right person for your project</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : freelancers.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10"
          >
            Koi freelancer nahi mila!
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {freelancers.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold text-gray-800">
                  {user.username}
                </h2>

                <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                  {user.bio || "No bio added"}
                </p>

                <motion.button
                  onClick={() => navigate(`/freelancers/${user.id}`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-semibold shadow hover:shadow-md transition duration-200"
                >
                  View Profile
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Freelancers;