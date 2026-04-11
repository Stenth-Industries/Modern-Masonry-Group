import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Sparkles } from 'lucide-react';

const KimiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Modern Masonry Assistant. How can I help you find the perfect architectural solutions today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please ensure the backend is running and your API key is set.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-[var(--brass)] text-black rounded-full flex items-center justify-center shadow-2xl transition-shadow hover:shadow-[0_0_20px_rgba(196,163,90,0.5)]"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brass)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--brass)] border-2 border-black"></span>
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-[60] w-[400px] h-[600px] bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
          >
            <div className="p-6 bg-[#161616] border-b border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brass)]/10 flex items-center justify-center text-[var(--brass)]">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-white text-sm font-black tracking-widest uppercase">Kimi 2.5</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Online Assistant</span>
                  </div>
                </div>
              </div>
              <Sparkles size={16} className="text-[var(--brass)] opacity-50" />
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-white/5 text-white/40' : 'bg-[var(--brass)]/10 text-[var(--brass)]'}`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-white/5 text-white/80 rounded-tr-none' 
                        : 'bg-white/[0.03] text-white/60 border border-white/[0.03] rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-[var(--brass)]/10 flex items-center justify-center text-[var(--brass)]">
                      <Bot size={14} />
                    </div>
                    <div className="bg-white/[0.03] p-4 rounded-2xl rounded-tl-none border border-white/[0.03] flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)]/40 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)]/40 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brass)]/40 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#161616] border-t border-white/[0.05]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about materials or designs..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-[#0f0f0f] border border-white/10 rounded-2xl pl-5 pr-12 py-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brass)]/40 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--brass)] text-black rounded-xl flex items-center justify-center hover:bg-[var(--brass-light)] transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[9px] text-center mt-4 text-white/20 font-bold uppercase tracking-[0.2em]">
                Powered by Kimi 2.5
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KimiAssistant;
