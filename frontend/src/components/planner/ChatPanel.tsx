"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Map, RefreshCcw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function ChatPanel({
  onPlacesFound,
}: {
  onPlacesFound: (places: any[]) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm TripGenie. Tell me where you want to go, for how long, and what you enjoy doing!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
      
      if (data.places && data.places.length > 0) {
        onPlacesFound(data.places);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error connecting to my brain. The backend might be offline." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ role: "ai", content: "Hi! I'm TripGenie. Ready to start a new adventure?" }]);
    onPlacesFound([]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center">
            <Map className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">TripGenie Assistant</h2>
            <p className="text-emerald-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <button onClick={handleClear} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === "user" 
                  ? "bg-emerald-500 text-white rounded-tr-none" 
                  : "bg-white/10 text-slate-200 border border-white/10 rounded-tl-none shadow-lg"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/10 border border-white/10 text-slate-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 bg-slate-950/50">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            className="w-full bg-slate-900 border border-white/10 text-white pl-5 pr-14 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
            placeholder="Plan a 3-day Tokyo trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 w-10 h-10 flex items-center justify-center bg-white text-slate-900 rounded-full hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} className={loading || !input.trim() ? "opacity-50" : ""} />
          </button>
        </form>
        <p className="text-center text-xs text-slate-500 mt-3">AI can make mistakes. Consider verifying important details.</p>
      </div>
    </div>
  );
}
