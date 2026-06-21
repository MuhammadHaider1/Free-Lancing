import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await API.get("/wallet/admin/withdrawals/");
      setWithdrawals(res.data.results || res.data);
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Withdrawals load nahi hui — shayad aapko admin access nahi hai.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoadingId(id);
    try {
      await API.post(`/wallet/admin/withdrawals/${id}/${action}/`);
      fetchWithdrawals();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusStyle = (status) =>
    status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

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
            <h1 className="text-4xl font-bold">Withdrawal Requests</h1>
            <p className="opacity-80 mt-1">Review and process freelancer withdrawal requests</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : withdrawals.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10"
          >
            Koi withdrawal request nahi hai
          </motion.p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {withdrawals.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800">{w.username}</h2>
                      <p className="text-xs text-gray-400">
                        {new Date(w.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(w.status)}`}>
                      {w.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="bg-gray-50 rounded-xl px-4 py-2">
                      <p className="text-gray-400 text-xs">Amount</p>
                      <p className="font-semibold text-gray-800">${w.amount}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-2">
                      <p className="text-gray-400 text-xs">Method</p>
                      <p className="font-semibold text-gray-800">{w.method}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl px-4 py-2 col-span-2">
                      <p className="text-gray-400 text-xs">Account Details</p>
                      <p className="font-semibold text-gray-800">{w.account_details}</p>
                    </div>
                  </div>

                  {w.status === "pending" && (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleAction(w.id, "approve")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={actionLoadingId === w.id}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-semibold shadow hover:shadow-md transition duration-200 disabled:opacity-60"
                      >
                        {actionLoadingId === w.id ? "..." : "✅ Approve"}
                      </motion.button>
                      <motion.button
                        onClick={() => handleAction(w.id, "reject")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={actionLoadingId === w.id}
                        className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-xl font-semibold hover:bg-red-100 transition duration-200 disabled:opacity-60"
                      >
                        {actionLoadingId === w.id ? "..." : "❌ Reject"}
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminWithdrawals;