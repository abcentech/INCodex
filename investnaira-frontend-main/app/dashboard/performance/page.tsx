"use client";

import React from 'react';
import { usePerformance } from '@/hook/usePerformance';
import { Card } from '@/components/ui/card';
import {
    TrendingUp,
    ArrowUpRight,
    BarChart3,
    Download,
    Calendar,
    PieChart,
    Activity,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const PerformanceAnalytics = () => {
    const { performanceStats, isLoading } = usePerformance();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-gray-500 font-black font-rowdies">Fetching your financial performance...</p>
            </div>
        );
    }

    if (!performanceStats || parseFloat(performanceStats.total_value) === 0) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4 text-center">
                <div className="bg-gray-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity size={32} className="text-gray-400" />
                </div>
                <h1 className="text-3xl font-black font-rowdies mb-4">No Performance Data Yet</h1>
                <p className="text-gray-500 mb-10 max-w-md mx-auto">Start investing in savings plans or campaigns to see your detailed performance reports and ROI analysis.</p>
                <Button onClick={() => window.location.href = '/dashboard/campaigns'} className="h-14 px-8 rounded-2xl font-black bg-primary">
                    Start Investing Now
                </Button>
            </div>
        );
    }

    const { total_value, total_return, average_roi, performance_history } = performanceStats;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-rowdies text-gray-900 dark:text-white">Performance Report</h1>
                    <p className="text-gray-500 font-medium">Detailed analysis of your investment growth and ROI.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl border-gray-200 font-bold">
                        <Calendar className="mr-2" size={18} />
                        Filter Period
                    </Button>
                    <Button className="rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all">
                        <Download className="mr-2" size={18} />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-none shadow-xl bg-white dark:bg-slate-900 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Total Portfolio Value</p>
                    <h2 className="text-3xl font-black font-rowdies text-gray-900 dark:text-white mb-4">
                        {formatCurrency(parseFloat(total_value))}
                    </h2>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <ArrowUpRight size={16} />
                        <span>+8.4% this month</span>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-primary text-white rounded-[40px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ArrowUpRight size={80} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">Total Net Returns</p>
                    <h2 className="text-3xl font-black font-rowdies mb-4">
                        {formatCurrency(parseFloat(total_return))}
                    </h2>
                    <p className="text-sm font-bold text-white/80">Cumulative profit earned</p>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-white dark:bg-slate-900 rounded-[40px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <PieChart size={80} />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Average Annual ROI</p>
                    <h2 className="text-3xl font-black font-rowdies text-gray-900 dark:text-white mb-4">
                        {(parseFloat(average_roi) * 100).toFixed(1)}%
                    </h2>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <BarChart3 size={16} />
                        <span>Outperforming benchmark</span>
                    </div>
                </Card>
            </div>

            {/* Main Performance Chart */}
            <Card className="p-10 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[50px]">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black font-rowdies">Growth Trajectory</h3>
                    <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl">
                        <button className="px-5 py-2 rounded-xl text-xs font-black bg-white dark:bg-slate-700 shadow-sm transition-all">1M</button>
                        <button className="px-5 py-2 rounded-xl text-xs font-black text-gray-500 transition-all hover:bg-white/50 dark:hover:bg-slate-700/50">6M</button>
                        <button className="px-5 py-2 rounded-xl text-xs font-black text-gray-500 transition-all hover:bg-white/50 dark:hover:bg-slate-700/50">1Y</button>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performance_history}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }}
                                tickFormatter={(val) => `₦${val / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }}
                                labelStyle={{ fontWeight: 'black', color: '#0066FF', marginBottom: '8px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#0066FF"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Detailed Metrics Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-none shadow-xl bg-white dark:bg-slate-900 rounded-[40px]">
                    <h4 className="text-xl font-black font-rowdies mb-6">Asset Allocation Performance</h4>
                    <div className="space-y-6">
                        {[
                            { name: 'Campaign Investments', val: '₦1.2M', growth: '+12.5%', color: 'bg-primary' },
                            { name: 'High-Yield Savings', val: '₦850k', growth: '+8.2%', color: 'bg-emerald-500' },
                            { name: 'Fixed Income', val: '₦400k', growth: '+6.1%', color: 'bg-amber-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-3xl transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-gray-500 font-medium">{item.val} Current Value</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-emerald-500 font-black">{item.growth}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Growth</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-xl bg-slate-900 text-white rounded-[40px] flex flex-col justify-center items-center text-center">
                    <div className="bg-white/10 p-4 rounded-3xl mb-6">
                        <BarChart3 size={32} />
                    </div>
                    <h4 className="text-2xl font-black font-rowdies mb-3 text-white">Advanced Insights</h4>
                    <p className="text-white/60 mb-8 max-w-xs font-medium">Unlock deeper analysis, including inflation-adjusted returns and custom benchmark comparison.</p>
                    <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 font-black hover:bg-gray-200 transition-all">
                        Upgrade to Premium
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default PerformanceAnalytics;
