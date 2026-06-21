import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";
import ChatBox from "../components/ChatBox";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [review, setReview] = useState(null);
  const [deliveryFile, setDeliveryFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
    fetchReview();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}/`);
      setOrder(res.data);
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Order load nahi hua.");
    }
  };

  const fetchReview = async () => {
    try {
      const res = await API.get(`/reviews/?order=${id}`);
      if (res.data.length > 0) {
        setReview(res.data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadDelivery = async () => {
    if (!deliveryFile) {
      alert("File select karo");
      return;
    }

    const formData = new FormData();
    formData.append("delivery_file", deliveryFile);

    try {
      await API.post(`/orders/${id}/deliver/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Delivery submitted!");
      fetchOrder();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || "Upload failed");
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

  if (!order) {
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

  const statusBadge =
    order.status === "completed"
      ? "bg-green-100 text-green-700"
      : order.status === "delivered"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  const timelineSteps = [
    { label: "Order Created", done: true },
    {
      label:
        order.status === "delivered" || order.status === "completed"
          ? "Delivery Submitted"
          : "Waiting for Delivery",
      done: order.status === "delivered" || order.status === "completed",
    },
    {
      label:
        order.status === "completed"
          ? "Order Completed"
          : "Waiting for Completion",
      done: order.status === "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 text-white py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1 transition"
            >
              ← Back to Orders
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">Order #{order.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge}`}>
                {order.status}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >

          {/* Order Info */}
          <div className="space-y-3 mb-6">
            {[
              { label: "Client", value: order.client_name },
              { label: "Freelancer", value: order.freelancer_name },
              { label: "Amount", value: `$${order.amount}` },
              { label: "Created", value: new Date(order.created_at).toLocaleDateString() },
              ...(order.delivered_at
                ? [{ label: "Delivered", value: new Date(order.delivered_at).toLocaleDateString() }]
                : []),
            ].map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
              >
                <span className="text-gray-500 text-sm font-medium">{row.label}</span>
                <span className="text-gray-800 font-semibold text-sm">{row.value}</span>
              </motion.div>
            ))}
          </div>

          {/* View Freelancer */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            onClick={() => navigate(`/freelancers/${order.freelancer}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-700 text-white py-3 rounded-xl font-semibold shadow hover:shadow-md transition duration-200 mb-6"
          >
            👤 View Freelancer Profile
          </motion.button>

          {/* Upload Delivery */}
          {order.status === "in_progress" &&
            localStorage.getItem("role") === "freelancer" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6"
              >
                <p className="text-green-700 text-sm font-semibold mb-3">📤 Submit Delivery</p>
                <input
                  type="file"
                  onChange={(e) => setDeliveryFile(e.target.files[0])}
                  className="mb-3 text-xs w-full"
                />
                <motion.button
                  onClick={uploadDelivery}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-xl font-semibold shadow hover:shadow-md transition"
                >
                  Submit Delivery
                </motion.button>
              </motion.div>
            )}

          <hr className="my-6 border-gray-100" />

          {/* Timeline */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-bold mb-4 text-gray-800"
          >
            Order Timeline
          </motion.h2>

          <div className="space-y-3 mb-6">
            {timelineSteps.map((step, i) => (
              <motion.p
                key={step.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05 }}
                className={`text-sm font-medium ${step.done ? "text-green-600" : "text-gray-400"}`}
              >
                {step.done ? "✅" : "⏳"} {step.label}
              </motion.p>
            ))}
          </div>

          {/* Delivery File */}
          {order.delivery_file && (
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              href={`http://127.0.0.1:8000${order.delivery_file}`}
              target="_blank"
              rel="noreferrer"
              className="block text-center bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 mb-4"
            >
              📄 Download Delivery File
            </motion.a>
          )}

          {/* Leave Review */}
          {order.status === "completed" &&
            localStorage.getItem("role") === "client" &&
            !order.review_exists && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                onClick={() => navigate(`/reviews/create/${order.id}`)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 mb-4"
              >
                ⭐ Leave Review
              </motion.button>
            )}

          {/* Existing Review */}
          {review && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-4"
            >
              <h2 className="text-lg font-bold mb-2 text-gray-800">Your Review</h2>
              <p className="text-yellow-500 text-xl">{"⭐".repeat(review.rating)}</p>
              <p className="mt-3 text-gray-700 text-sm">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">Submitted by {review.client_name}</p>
            </motion.div>
          )}

          <ChatBox orderId={order.id} />

        </motion.div>
      </div>
    </div>
  );
}

export default OrderDetail;