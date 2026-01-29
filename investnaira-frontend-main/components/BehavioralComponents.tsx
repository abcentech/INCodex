"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, TrendingDown, TrendingUp, Users, Flame, Target } from 'lucide-react';

export const CoffeeComparison = () => {
    return (
        <section className="py-24 px-4 bg-gray-50 dark:bg-slate-900 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold font-rowdies mb-4 dark:text-white">The Cost of <span className="text-primary">Waiting</span></h2>
                    <p className="text-gray-600 dark:text-gray-400">Small daily decisions create massive future outcomes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-xl border border-red-100 dark:border-red-900/20"
                        whileHover={{ y: -10 }}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-2xl text-red-600 dark:text-red-400">
                                <Coffee size={32} />
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white">Daily Coffee / Snack</h3>
                        </div>
                        <p className="text-4xl font-bold text-red-600 mb-2">₦2,500</p>
                        <p className="text-gray-500 mb-6 italic">"It's just a small expense..."</p>
                        <div className="pt-6 border-t dark:border-white/10 text-gray-400">
                            Future Value in 20 years: <span className="font-bold">₦0</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-green-100 dark:border-green-900/20 relative"
                        whileHover={{ y: -10 }}
                    >
                        <div className="absolute -top-4 -right-4 bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                            RECOMMENDED
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-2xl text-primary">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-2xl font-bold dark:text-white">InvestNaira Habit</h3>
                        </div>
                        <p className="text-4xl font-bold text-primary mb-2">₦2,500</p>
                        <p className="text-gray-500 mb-6 italic">"Purchasing my future freedom."</p>
                        <div className="pt-6 border-t dark:border-white/10 text-primary">
                            Future Value in 20 years: <span className="font-bold text-2xl font-rowdies">₦54,200,000*</span>
                        </div>
                    </motion.div>
                </div>
                <p className="text-center mt-12 text-xs text-gray-400">*Based on 18% CAGR and monthly consistency.</p>
            </div>
        </section>
    );
};

export const CommunityStreaks = () => {
    const builders = [
        { name: "Tunde O.", streak: "14 Months", goal: "Family Estate", progress: 68 },
        { name: "Blessing E.", streak: "8 Months", goal: "Early Retirement", progress: 42 },
        { name: "Chioma A.", streak: "22 Months", goal: "Legacy Fund", progress: 89 },
        { name: "Abubakar M.", streak: "11 Months", goal: "Global Education", progress: 55 },
    ];

    return (
        <section className="py-24 px-4 bg-white dark:bg-slate-950">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 text-primary font-bold mb-4">
                            <Users size={20} />
                            <span className="uppercase tracking-widest text-sm">Wealth is Better Together</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold font-rowdies dark:text-white">Join the <span className="text-primary">10,000+</span> Movement</h2>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="p-2 bg-primary rounded-lg text-white">
                            <Flame size={20} />
                        </div>
                        <p className="text-sm font-bold dark:text-white">Current Top Streak: 24 Months</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {builders.map((builder, i) => (
                        <motion.div
                            key={i}
                            className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                    {builder.name[0]}
                                </div>
                                <div className="flex items-center gap-1 text-orange-500 font-bold text-sm bg-orange-500/10 px-3 py-1 rounded-full">
                                    <Flame size={14} /> {builder.streak}
                                </div>
                            </div>
                            <h4 className="font-bold text-lg dark:text-white mb-1">{builder.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{builder.goal}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400 uppercase">Progress</span>
                                    <span className="text-primary">{builder.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${builder.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
