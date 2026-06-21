import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function ProjectProposals() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await API.get(`/projects/proposals/?project=${projectId}`);
      setProposals(res.data.results || res.data);
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Proposals load nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (proposalId) => {
    setActionLoadingId(proposalId);
    try {
      await API.post(`/projects/proposals/${proposalId}/accept/`);
      fetchProposals();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Accept failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (proposalId) => {
    setActionLoadingId(proposalId);
    try {
      await API.post(`/projects/proposals/${proposalId}/reject/`);
      fetchProposals();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusStyle = (status) =>
    status === "accepted"
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
            <button
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition"
            >
              ← Back to Projects
            </button>
            <h1 className="text-4xl font-bold">Proposals Received</h1>
            <p className="opacity-80 mt-1">Review freelancer proposals for this project</p>
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
            Abhi tak koi proposal nahi aayi
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
                      {proposal.freelancer_name}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    <span>💰 Bid: ${proposal.bid_amount}</span>
                    <span>⏱ Delivery: {proposal.delivery_days} days</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{proposal.cover_letter}</p>

                  {proposal.status === "pending" && (
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleAccept(proposal.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={actionLoadingId === proposal.id}
                        className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-semibold shadow hover:shadow-md transition duration-200 disabled:opacity-60"
                      >
                        {actionLoadingId === proposal.id ? "..." : "✅ Accept"}
                      </motion.button>
                      <motion.button
                        onClick={() => handleReject(proposal.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={actionLoadingId === proposal.id}
                        className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-xl font-semibold hover:bg-red-100 transition duration-200 disabled:opacity-60"
                      >
                        {actionLoadingId === proposal.id ? "..." : "❌ Reject"}
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

export default ProjectProposals;