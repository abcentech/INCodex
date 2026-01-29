"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Moon, Sun, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const calculateWealthData = (initial: number, monthly: number, years: number, rate: number) => {
    let balance = initial;
    const data = [];
    for (let i = 0; i <= years; i++) {
        data.push({
            year: i,
            amount: Math.round(balance),
        });
        // Compound annually for simplicity in this visual, plus monthly contributions
        balance = (balance + (monthly * 12)) * (1 + rate / 100);
    }
    return data;
};

const BuffettRecord = () => {
    const { theme, toggleTheme } = useTheme();
    const [initialInvestment, setInitialInvestment] = useState(100000);
    const [monthlyContribution, setMonthlyContribution] = useState(10000);
    const [contributionFreq, setContributionFreq] = useState("Monthly"); // Monthly or Quarterly
    const [years, setYears] = useState(10);
    const [showModal, setShowModal] = useState(false);

    const isDarkMode = theme === 'dark';

    const buffettRate = 20.1;
    const savingsRate = 5.0;

    // Adjust contribution based on frequency for calculation (annualized)
    const monthlyCalc = contributionFreq === "Monthly" ? monthlyContribution : monthlyContribution / 3;

    const buffettData = calculateWealthData(initialInvestment, monthlyCalc, years, buffettRate);
    const savingsData = calculateWealthData(initialInvestment, monthlyCalc, years, savingsRate);

    // Combine for chart
    const chartData = buffettData.map((item, index) => ({
        year: `Year ${item.year}`,
        Buffett: item.amount,
        Savings: savingsData[index].amount
    }));

    const finalBuffett = buffettData[buffettData.length - 1].amount;
    const finalSavings = savingsData[savingsData.length - 1].amount;

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
        notation: "compact", // Use compact notation for chart
    });

    const fullFormatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    });

    return (
        <section className={`py-20 px-4 transition-colors duration-500 bg-gray-50 dark:bg-slate-900 border-t dark:border-gray-800`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold font-rowdies mb-4 dark:text-white text-gray-900">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">8th Wonder</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Simulate your wealth growth using the same compounding power that built Berkshire Hathaway.
                        </p>
                    </motion.div>

                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition shadow-sm"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-700" />}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Controls */}
                    <motion.div
                        className="lg:col-span-4 space-y-8 bg-white dark:bg-white/5 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Initial Investment (₦)</label>
                            <input
                                type="number"
                                value={initialInvestment}
                                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                className="w-full bg-gray-100 dark:bg-black/30 border-0 rounded-xl p-4 text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-gray-600 dark:text-gray-400">Recurring Contribution (₦)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                    className="flex-1 bg-gray-100 dark:bg-black/30 border-0 rounded-xl p-4 text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition"
                                />
                                <select
                                    value={contributionFreq}
                                    onChange={(e) => setContributionFreq(e.target.value)}
                                    className="bg-gray-100 dark:bg-black/30 border-0 rounded-xl px-4 font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                >
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-4 text-gray-600 dark:text-gray-400">Duration: <span className="text-green-600 dark:text-green-400 text-lg">{years} Years</span></label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={years}
                                onChange={(e) => setYears(parseInt(e.target.value))}
                                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Standard Savings (5%)</span>
                                <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{formatter.format(finalSavings)}</span>
                            </div>
                            <div className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/50">
                                <span className="font-semibold text-green-800 dark:text-green-400">InvestNaira Potential</span>
                                <span className="font-mono font-bold text-xl text-green-700 dark:text-green-400">{formatter.format(finalBuffett)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Chart */}
                    <motion.div
                        className="lg:col-span-8 bg-white dark:bg-white/5 p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 flex flex-col"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold dark:text-white text-gray-900">Growth Projection</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Visualizing 20.1% CAGR vs 5% Inflation/Savings</p>
                            </div>
                            <Info
                                className="text-gray-400 hover:text-green-500 cursor-pointer transition"
                                onClick={() => setShowModal(true)}
                            />
                        </div>

                        <div className="flex-1 min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBuffett" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.5} />
                                            <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#333" : "#eee"} vertical={false} />
                                    <XAxis
                                        dataKey="year"
                                        tick={{ fill: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}
                                        tickLine={false}
                                        interval={Math.floor(years / 5)}
                                    />
                                    <YAxis
                                        tick={{ fill: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}
                                        tickLine={false}
                                        tickFormatter={(value) => formatter.format(value)}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDarkMode ? '#1e293b' : '#fff',
                                            borderRadius: '12px',
                                            border: 'none',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                        }}
                                        labelStyle={{ color: isDarkMode ? '#ccc' : '#333' }}
                                        formatter={(value: number) => [fullFormatter.format(value), ""]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Savings"
                                        stroke={isDarkMode ? "#94a3b8" : "#94a3b8"}
                                        fillOpacity={1}
                                        fill="url(#colorSavings)"
                                        strokeWidth={2}
                                        activeDot={{ r: 6 }}
                                        animationDuration={1500}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="Buffett"
                                        stroke="#4CAF50"
                                        fillOpacity={1}
                                        fill="url(#colorBuffett)"
                                        strokeWidth={3}
                                        activeDot={{ r: 8 }}
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 dark:text-white max-w-lg w-full p-8 rounded-3xl shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold mb-4 font-rowdies">Compound Interest Explained</h3>
                            <p className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                This simulation compares a standard savings rate (5%) against the historical performance of Warren Buffett's Berkshire Hathaway (~20.1% CAGR).
                            </p>
                            <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600 dark:text-gray-300">
                                <li><strong>Initial Investment:</strong> Your starting capital.</li>
                                <li><strong>Monthly/Quarterly:</strong> Regular additions fuel the compounding fire.</li>
                                <li><strong>CAGR:</strong> Compound Annual Growth Rate.</li>
                            </ul>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-600 transition shadow-lg"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BuffettRecord;
