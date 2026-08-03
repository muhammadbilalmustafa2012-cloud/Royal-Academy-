import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, X, Sparkles, User, Minimize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

// Quick-reply suggestion chips
const SUGGESTION_CHIPS = [
  '📋 Fee Structure',
  '📅 Timings',
  '🎓 Available Courses',
  '📍 Location',
  '✅ Admission Process',
];

// Format bold **text** from AI responses
function formatBotText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#4ffbe6]">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Assalamu Alaikum! 👋 Welcome to **Royal Academy** AI Assistant.\n\nI can help you with courses, fee structure, timings, and admissions. How can I assist you today?",
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Prevent duplicate in-flight requests
  const isRequestInFlight = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading || isRequestInFlight.current) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);
    setError(null);
    isRequestInFlight.current = true;

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const botReply = data.reply || "Thank you for reaching out to Royal Academy! Call us at **0329-0247580** or visit our campus in Mansoorabad, Faisalabad.";

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      console.error('AI Chat error:', err);
      setError('Could not reach AI. Check your connection.');
      setMessages(prev => [...prev, {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "📍 **Royal Academy** is located at Mansoorabad, Farooqabad, Street 14, Faisalabad.\n📞 Call us directly: **0329-0247580**\n🌐 Or use the Admissions tab to apply online.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
      isRequestInFlight.current = false;
    }
  }, [loading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleChipClick = (chip: string) => {
    // Strip emoji prefix for the actual message
    const text = chip.replace(/^[^\w]+/, '').trim();
    sendMessage(text);
  };

  const showChips = messages.length <= 1 && !loading;

  return (
    <>
      {/* ── Floating Launcher Button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-5 z-40 bg-gradient-to-tr from-[#6200ee] via-[#7c3aed] to-[#4ffbe6] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          title="Ask Royal Academy AI Assistant"
          aria-label="Open AI Chat"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <Sparkles className="w-3 h-3 text-[#FFD700] absolute -top-1 -right-1 animate-ping" />
          </div>
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2 text-xs font-bold transition-all duration-300">
            AI Assistant
          </span>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          className="fixed bottom-5 right-5 z-50 w-80 sm:w-96 bg-[#0f1419] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            height: 520,
            animation: 'pageFadeIn 0.25s ease forwards',
          }}
          role="dialog"
          aria-label="Royal Academy AI Chat"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#6200ee] to-[#2c3ea3] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center ring-2 ring-[#4ffbe6]/30">
                <Bot className="w-5 h-5 text-[#4ffbe6]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm flex items-center gap-1">
                  Royal Academy AI
                  <Sparkles className="w-3 h-3 text-[#FFD700]" />
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[10px] text-gray-200">Online · Admissions & Course Support</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-all"
              aria-label="Close chat"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="px-3 py-1.5 bg-red-900/40 border-b border-red-500/30 text-red-300 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-2 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#6200ee] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5 text-[#4ffbe6]" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-2.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#6200ee] text-white rounded-br-none'
                      : 'bg-white/8 text-gray-200 border border-white/8 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">
                    {m.sender === 'bot' ? formatBotText(m.text) : m.text}
                  </p>
                  <div className={`text-[9px] mt-1 ${m.sender === 'user' ? 'text-white/60 text-right' : 'text-gray-500'}`}>
                    {m.time}
                  </div>
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded-full bg-[#6200ee] flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-[#4ffbe6]" />
                </div>
                <div className="p-2.5 rounded-2xl rounded-bl-none bg-white/8 border border-white/8 flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Reply Suggestion Chips */}
          {showChips && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-2.5 py-1 rounded-full bg-[#6200ee]/20 border border-[#6200ee]/40 text-[#a78bfa] text-[10px] font-semibold hover:bg-[#6200ee]/40 hover:border-[#6200ee] transition-all active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-[#1b2025] border-t border-white/8 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about fees, timings, admissions..."
              className="flex-1 px-3 py-2 bg-white/6 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6200ee] transition-colors"
              disabled={loading}
              maxLength={500}
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 bg-[#6200ee] hover:bg-[#7c3aed] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-95 btn-ripple"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
