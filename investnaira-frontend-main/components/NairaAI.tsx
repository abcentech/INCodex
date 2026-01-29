"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, User, Bot, Globe, Shield } from 'lucide-react';
import { useAuths } from '@/hook/useAuths';
import { useChatbot } from '@/hook/useChatbot';

const NairaAI = () => {
    const { accessToken } = useAuths();
    const { askAdvisor, loading: isTyping } = useChatbot();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: "Hello! I'm NairaAI, your personal wealth assistant. How can I help you build your freedom map today?" }
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!accessToken) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Please sign in or create an account to get personalized financial advice from NairaAI! 🪄" }]);
            return;
        }
        if (!input.trim() || isTyping) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");

        const aiResponse = await askAdvisor(currentInput);
        if (aiResponse) {
            setMessages(prev => [...prev, aiResponse]);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold font-rowdies tracking-tight">NairaAI</h3>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase opacity-80">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                        Online Wealth Advisor
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth" ref={scrollRef}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'assistant' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'assistant'
                                        ? 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
                                        : 'bg-primary text-white rounded-tr-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                            <button onClick={() => setInput("What are the fees?")} className="whitespace-nowrap bg-gray-50 dark:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-full border border-gray-100 dark:border-white/5 hover:border-primary transition">🚀 Fees?</button>
                            <button onClick={() => setInput("Is it safe?")} className="whitespace-nowrap bg-gray-50 dark:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-full border border-gray-100 dark:border-white/5 hover:border-primary transition">🛡️ Safety?</button>
                            <button onClick={() => setInput("What is Freedom?")} className="whitespace-nowrap bg-gray-50 dark:bg-slate-800 text-[10px] font-bold px-3 py-2 rounded-full border border-gray-100 dark:border-white/5 hover:border-primary transition">📈 Freedom?</button>
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t dark:border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="w-full bg-gray-100 dark:bg-slate-800 border-0 rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-primary outline-none dark:text-white"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white relative group"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-20 bg-white dark:bg-slate-900 text-gray-800 dark:text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg whitespace-nowrap border border-gray-100 dark:border-white/5 pointer-events-none group-hover:block"
                    >
                        Questions? Ask NairaAI 🪄
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
};

export default NairaAI;
