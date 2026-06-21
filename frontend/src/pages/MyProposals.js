import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function MyProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await API.get("/projects/proposals/");
      setProposals(res.data.results || res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (status) =>
    status === "accepted"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

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
            <h1 className="text-4xl font-bold">My Proposals</h1>
            <p className="opacity-80 mt-1">Track the proposals you've sent to clients</p>
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
        ) : proposals.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-10"
          >
            No proposals sent yet
          </motion.p>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {proposals.map((proposal, i) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {proposal.project_title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    <span>💰 Bid: ${proposal.bid_amount}</span>
                    <span>⏱ Delivery: {proposal.delivery_days} days</span>
                  </div>

                  <p className="text-gray-600 text-sm">{proposal.cover_letter}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}

export default MyProposals;