import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function ChatBox({ orderId }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await API.get("/chat/conversations/");
      const conversations = res.data.results || res.data;

      const conv = conversations.find(c => c.order === orderId);

      if (conv) {
        setConversation(conv);
        setMessages(conv.messages);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      if (!conversation) {
        alert("Conversation not found");
        return;
      }

      await API.post("/chat/messages/", {
        conversation: conversation.id,
        text: text
      });

      setText("");
      fetchChat();
    } catch (err) {
      console.log("SEND MESSAGE ERROR:", err.response?.data || err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-5"
    >
      <h2 className="font-bold text-lg mb-3 text-gray-800">💬 Chat</h2>

      <div className="bg-white rounded-xl h-60 overflow-y-auto p-3 shadow-inner">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-6 w-6 border-3 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-6">No messages yet</p>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="border-b border-gray-100 py-2 last:border-b-0"
              >
                <b className="text-sm text-gray-700">{msg.sender_name}</b>
                <p className="text-sm text-gray-600">{msg.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex mt-3 gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write message..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition duration-200"
        />

        <motion.button
          onClick={sendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 rounded-xl font-semibold shadow hover:shadow-md transition duration-200"
        >
          Send
        </motion.button>
      </div>
    </motion.div>
  );
}

export default ChatBox;