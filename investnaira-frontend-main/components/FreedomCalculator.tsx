"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, ShieldCheck } from "lucide-react";
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
        balance = (balance + (monthly * 12)) * (1 + rate / 100);
    }
    return data;
};

const FreedomCalculator = () => {
    const { theme } = useTheme();
    const [initialInvestment, setInitialInvestment] = useState(100000);
    const [monthlyContribution, setMonthlyContribution] = useState(25000);
    const [years, setYears] = useState(15);

    const isDarkMode = theme === 'dark';

    const highGrowthRate = 18.0; // Target rate for wealth accelerators
    const inflationRate = 6.0;

    const freedomData = calculateWealthData(initialInvestment, monthlyContribution, years, highGrowthRate);
    const inflationData = calculateWealthData(initialInvestment, monthlyContribution, years, inflationRate);

    // Combine for chart
    const chartData = freedomData.map((item, index) => ({
        year: `Year ${item.year}`,
        Freedom: item.amount,
        Inflation: inflationData[index].amount
    }));

    const finalFreedom = freedomData[freedomData.length - 1].amount;
    const finalInflation = inflationData[inflationData.length - 1].amount;

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
        notation: "compact",
    });

    const fullFormatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    });

    return (
        <section className="py-24 px-4 lg:px-14 bg-white dark:bg-slate-950 border-t border-b dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-extrabold font-rowdies mb-6 dark:text-white text-gray-900">
                            The <span className="text-primary">2-Minute</span> Freedom Map
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                            Don't just save. Build a bridge to your future self.
                            Adjust the sliders below to see your potential.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Controls */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">I can start with</label>
                                    <span className="text-primary font-bold text-xl">{fullFormatter.format(initialInvestment)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="1000000"
                                    step="5000"
                                    value={initialInvestment}
                                    onChange={(e) => setInitialInvestment(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">I'll add monthly</label>
                                    <span className="text-primary font-bold text-xl">{fullFormatter.format(monthlyContribution)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="5000"
                                    max="500000"
                                    step="5000"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between mb-4">
                                    <label className="text-sm font-bold uppercase tracking-wider text-gray-500">For a duration of</label>
                                    <span className="text-primary font-bold text-xl">{years} Years</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="40"
                                    value={years}
                                    onChange={(e) => setYears(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>

                        <div className="p-8 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-primary" size={24} />
                                <h3 className="text-2xl font-bold dark:text-white">Future Freedom Fund</h3>
                            </div>
                            <p className="text-4xl font-extrabold text-primary font-rowdies">
                                {fullFormatter.format(finalFreedom)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                vs. {fullFormatter.format(finalInflation)} if you left it in a standard bank account (6% yield).
                            </p>
                            <div className="pt-4">
                                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                    Secure This Future <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-7 h-[500px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorFreedom" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#333" : "#eee"} />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fill: isDarkMode ? '#666' : '#999', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tickFormatter={(value) => formatter.format(value)}
                                    tick={{ fill: isDarkMode ? '#666' : '#999', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                                    }}
                                    formatter={(value: any) => [fullFormatter.format(Number(value) || 0), ""]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Inflation"
                                    stroke="#94a3b8"
                                    fillOpacity={0}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="Freedom"
                                    stroke="#16a34a"
                                    fillOpacity={1}
                                    fill="url(#colorFreedom)"
                                    strokeWidth={4}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FreedomCalculator;
