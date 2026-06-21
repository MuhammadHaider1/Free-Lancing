import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminHome() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/wallet/admin/stats/");
      setStats(res.data);
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Stats load nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats
    ? [
        { title: "Total Users", value: stats.total_users, icon: "👥", color: "from-blue-400 to-blue-600" },
        { title: "Clients", value: stats.total_clients, icon: "🧑‍💼", color: "from-purple-400 to-purple-600" },
        { title: "Freelancers", value: stats.total_freelancers, icon: "🛠", color: "from-green-400 to-green-600" },
        { title: "Total Orders", value: stats.total_orders, icon: "📦", color: "from-indigo-400 to-indigo-600" },
        { title: "Pending Withdrawals", value: stats.pending_withdrawals, icon: "⏳", color: "from-yellow-400 to-yellow-500", link: "/admin/withdrawals" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold"
          >
            Hello Super User {username} 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="opacity-80 mt-2"
          >
            Manage platform activity and review withdrawal requests
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {error ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
          >
            ❌ {error}
          </motion.div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => stat.link && navigate(stat.link)}
                className={`bg-white rounded-2xl shadow-lg p-6 ${stat.link ? "cursor-pointer" : ""}`}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                  {stat.icon}
                </div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold mt-1 text-gray-800">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigate("/admin/withdrawals")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200"
          >
            🏦 Review Withdrawal Requests
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

export default AdminHome;