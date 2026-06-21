import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function Wallet() {
  const role = localStorage.getItem("role");

  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Withdraw form
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    method: "",
    account_details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const summaryRes = await API.get("/wallet/summary/");
      setSummary(summaryRes.data);

      const txRes = await API.get("/wallet/transactions/");
      setTransactions(txRes.data.results || txRes.data);

      if (role === "freelancer") {
        const wRes = await API.get("/wallet/withdrawals/");
        setWithdrawals(wRes.data.results || wRes.data);
      }
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Wallet load nahi hui.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawChange = (e) => {
    setWithdrawForm({ ...withdrawForm, [e.target.name]: e.target.value });
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (parseFloat(withdrawForm.amount) > (summary?.available_balance || 0)) {
      setFormError("Withdrawal amount available balance se zyada hai!");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/wallet/withdrawals/", withdrawForm);
      setWithdrawForm({ amount: "", method: "", account_details: "" });
      setShowWithdrawForm(false);
      fetchWalletData();
    } catch (err) {
      console.log(err);
      setFormError("Kuch error aya! " + JSON.stringify(err.response?.data || ""));
    } finally {
      setSubmitting(false);
    }
  };

  const statusStyle = (status) =>
    status === "completed" || status === "approved"
      ? "bg-green-100 text-green-700"
      : status === "rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-200 text-sm bg-white";

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

  if (loading) {
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

  const statsFreelancer = [
    { label: "Available Balance", value: `$${summary?.available_balance?.toFixed(2) || "0.00"}`, icon: "💰", color: "from-green-400 to-green-600" },
    { label: "Total Earned", value: `$${summary?.total_earned?.toFixed(2) || "0.00"}`, icon: "📈", color: "from-blue-400 to-blue-600" },
    { label: "Pending Withdrawals", value: `$${summary?.pending_withdrawals?.toFixed(2) || "0.00"}`, icon: "⏳", color: "from-yellow-400 to-yellow-500" },
    { label: "Total Withdrawn", value: `$${summary?.total_withdrawn?.toFixed(2) || "0.00"}`, icon: "🏦", color: "from-purple-400 to-purple-600" },
  ];

  const statsClient = [
    { label: "Total Spent", value: `$${summary?.total_spent?.toFixed(2) || "0.00"}`, icon: "💸", color: "from-blue-400 to-blue-600" },
  ];

  const stats = role === "freelancer" ? statsFreelancer : statsClient;

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
            <h1 className="text-4xl font-bold">
              {role === "freelancer" ? "Wallet & Earnings" : "Spending History"}
            </h1>
            <p className="opacity-80 mt-1">
              {role === "freelancer"
                ? "Track your earnings and withdraw your balance"
                : "Track how much you've spent on projects and services"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className={`grid grid-cols-2 ${role === "freelancer" ? "md:grid-cols-4" : "md:grid-cols-1"} gap-4 mb-8`}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                {stat.icon}
              </div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Withdraw Button (freelancer only) */}
        {role === "freelancer" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <motion.button
              onClick={() => setShowWithdrawForm(!showWithdrawForm)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200"
            >
              {showWithdrawForm ? "✕ Cancel" : "🏦 Request Withdrawal"}
            </motion.button>

            <AnimatePresence>
              {showWithdrawForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">

                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4"
                      >
                        ❌ {formError}
                      </motion.div>
                    )}

                    <form onSubmit={handleWithdrawSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={withdrawForm.amount}
                          onChange={handleWithdrawChange}
                          className={inputClass}
                          placeholder={`Max $${summary?.available_balance?.toFixed(2) || "0.00"}`}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Method
                        </label>
                        <select
                          name="method"
                          value={withdrawForm.method}
                          onChange={handleWithdrawChange}
                          className={inputClass}
                          required
                        >
                          <option value="">Select method</option>
                          <option value="JazzCash">JazzCash</option>
                          <option value="EasyPaisa">EasyPaisa</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                      </div>

                      <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2 text-sm">
                          Account Details
                        </label>
                        <input
                          type="text"
                          name="account_details"
                          value={withdrawForm.account_details}
                          onChange={handleWithdrawChange}
                          className={inputClass}
                          placeholder="Account number / IBAN / phone number"
                          required
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 disabled:opacity-70"
                      >
                        {submitting ? "Submitting..." : "Submit Request"}
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Withdrawal History (freelancer only) */}
        {role === "freelancer" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Withdrawal Requests</h2>

            {withdrawals.length === 0 ? (
              <p className="text-gray-500 text-sm">No withdrawal requests yet</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">${w.amount}</p>
                      <p className="text-xs text-gray-500">{w.method} • {new Date(w.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle(w.status)}`}>
                      {w.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Transaction History</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {tx.type === "credit" ? "➕" : tx.type === "debit" ? "➖" : "🏦"} {tx.note || tx.type}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "credit" ? "+" : "-"}${tx.amount}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

export default Wallet;