import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../services/api";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const res = await API.get(`/services/${id}/`);
      setService(res.data);
    } catch (err) {
      console.log(err);
      setError("Kuch error aya! Service load nahi hui.");
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

  if (!service) {
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

  const detailRows = [
    { label: "Delivery", value: `${service.delivery_days} Days` },
    { label: "Category", value: service.category },
    { label: "Freelancer", value: service.freelancer_name },
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
              ← Back to Services
            </button>
            <h1 className="text-4xl font-bold">{service.title}</h1>
            <p className="opacity-80 mt-1">Service details and pricing</p>
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

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-5"
          >
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Description
            </label>
            <p className="text-gray-600 text-sm leading-relaxed">
              {service.description}
            </p>
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <span className="inline-block bg-blue-50 text-blue-600 font-bold text-2xl px-4 py-2 rounded-xl">
              ${service.price}
            </span>
          </motion.div>

          {/* Detail Rows */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {detailRows.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
              >
                <span className="text-gray-500 text-sm font-medium">{row.label}</span>
                <span className="text-gray-800 font-semibold text-sm">{row.value}</span>
              </motion.div>
            ))}
          </div>

          {/* Tips Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6"
          >
            <p className="text-green-700 text-sm font-semibold mb-2">💡 Before you order:</p>
            <ul className="text-green-600 text-xs space-y-1">
              <li>✅ Check delivery time fits your deadline</li>
              <li>✅ Review freelancer's profile and past work</li>
              <li>✅ Message them if you have questions</li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.button
            onClick={() => navigate(`/freelancers/${service.freelancer}`)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200"
          >
            👤 View Freelancer Profile
          </motion.button>

        </motion.div>
      </div>
    </div>
  );
}

export default ServiceDetail;