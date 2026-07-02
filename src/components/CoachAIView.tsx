import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { CoachMessage } from "../types";

interface CoachAIViewProps {
  chatHistory: CoachMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<CoachMessage[]>>;
}

export default function CoachAIView({ chatHistory, setChatHistory }: CoachAIViewProps) {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Should I adjust goals because of my 5% higher heart rate?",
    "Give me an active recovery plan with 40g protein.",
    "Help me swap Overhead Press in my Push Day A workout.",
    "Explain how hydration affects my neural muscle output.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    setError(null);
    const userMsg: CoachMessage = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Coach AI server endpoint");
      }

      const data = await response.json();
      
      const aiMsg: CoachMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while contacting Coach AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-[1000px] mx-auto bg-[#1e1e1e] border border-[#2c2c2e] rounded-2xl overflow-hidden glass-card">
      {/* Coach Header info */}
      <div className="px-6 py-4 border-b border-[#2c2c2e] flex items-center justify-between bg-[#131313]/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/20 flex items-center justify-center text-[#c3f400] relative">
            <Bot size={22} />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#1e1e1e]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[#ffffff] text-sm">Coach AI</h3>
            <p className="font-mono text-[9px] text-[#c3f400] tracking-widest uppercase">Elite Neural Trainer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#c3f400] animate-pulse" />
          <span className="font-mono text-[10px] text-[#c4c9ac]">ACTIVE ADAPTIVE AI</span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
            <Bot size={40} className="text-[#c3f400] mb-3 opacity-80" />
            <h4 className="font-display font-bold text-[#ffffff] text-lg">Initiate Training Feedback</h4>
            <p className="text-xs text-[#c4c9ac] mt-2 leading-relaxed">
              Coach AI synthesizes sleep patterns, neural stress levels, and active nutrition targets to build customized advice. Choose an athletic query or type your own.
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs border ${
                    isUser
                      ? "bg-[#2a2a2a] border-[#444933] text-[#c3f400]"
                      : "bg-[#c3f400]/10 border-[#c3f400]/20 text-[#c3f400]"
                  }`}
                >
                  {isUser ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble Container */}
                <div className="space-y-1">
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-[#c3f400] text-[#161e00] font-medium rounded-tr-none"
                        : "bg-[#131313] text-[#e5e2e1] border border-[#2c2c2e]/80 rounded-tl-none shadow-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`font-mono text-[8px] text-[#c4c9ac] px-1 ${isUser ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            );
          })
        )}

        {/* Loading Typing indicator */}
        {loading && (
          <div className="flex gap-3 mr-auto max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-[#c3f400]/10 border border-[#c3f400]/20 flex items-center justify-center text-[#c3f400]">
              <Bot size={16} />
            </div>
            <div className="bg-[#131313] text-[#e5e2e1] border border-[#2c2c2e]/80 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 bg-[#c3f400] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-[#c3f400] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-[#c3f400] rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* Error Block */}
        {error && (
          <div className="bg-red-950/20 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-start gap-3 text-xs max-w-md mx-auto">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Query Failed</p>
              <p className="mt-1 opacity-85">{error}</p>
              <button
                onClick={() => handleSendMessage(chatHistory[chatHistory.length - 1]?.text || "Retry")}
                className="mt-2 text-[#c3f400] hover:underline font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={10} /> RETRY CONNECTION
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick prompts */}
      {chatHistory.length === 0 && (
        <div className="px-6 py-3 border-t border-[#2c2c2e] bg-[#131313]/30">
          <p className="font-mono text-[9px] text-[#c4c9ac] mb-2 uppercase tracking-widest">QUICK FEEDBACK QUERIES</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] font-sans text-[#e5e2e1] hover:text-[#161e00] hover:bg-[#c3f400] bg-[#2a2a2a] border border-[#2c2c2e] hover:border-transparent rounded-lg px-3 py-1.5 transition-all text-left cursor-pointer duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box */}
      <div className="p-4 border-t border-[#2c2c2e] bg-[#131313]/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Discuss workout alterations or macro goals with Coach AI..."
            className="flex-1 bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] disabled:opacity-40 rounded-xl px-5 py-3 font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
