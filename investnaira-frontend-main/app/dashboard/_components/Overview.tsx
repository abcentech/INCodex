"use client";
import React, { useEffect, useState } from "react";
import { useWallet } from "../../../hook/useWallet";
import { useTransactions } from "../../../hook/useTransactions";
import { useAnalytics } from "../../../hook/useAnalytics";
import Link from "next/link";
import { formatCurrency } from "../../../utils/format";
import AnalyticsChart from "./AnalyticsChart";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, PieChart, Plus, ArrowRight } from "lucide-react";
import StatsCard from "./StatsCard";
import QuoteSlider from "./QuoteSlider";
import { useOnboardingTour } from "./useOnboardingTour";
import AssetsPieChart from "./AssetsPieChart";
import FreedomMeter from "./FreedomMeter";
import WealthMapModal from "./WealthMapModal";
import TaskWidget from "./TaskWidget";
import RebalancingWidget from "./RebalancingWidget";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Overview = ({ isDemo = false }: { isDemo?: boolean }) => {
    const [showMapModal, setShowMapModal] = useState(false);

    // Real Data Hooks
    const { balance: walletBalance, loading: walletLoading } = useWallet();
    const { transactions: realTransactions, loading: txLoading } = useTransactions();
    const { analytics: realAnalytics, loading: analyticsLoading } = useAnalytics();

    // Initialize Onboarding Tour
    const { startTour } = useOnboardingTour();

    // Mock Data for Demo - 12 Months of Data (2025)
    const mockAnalytics = {
        allocation: {
            net_worth: 28450000,
            savings: 22500000,
            wallet: 5950000
        },
        chart_data: [
            { date: '2025-01-01', balance: 5000000 },
            { date: '2025-01-15', balance: 5800000 },
            { date: '2025-02-01', balance: 6500000 },
            { date: '2025-02-15', balance: 7200000 },
            { date: '2025-03-01', balance: 8000000 },
            { date: '2025-03-15', balance: 8800000 },
            { date: '2025-04-01', balance: 9500000 },
            { date: '2025-04-15', balance: 10500000 },
            { date: '2025-05-01', balance: 11500000 },
            { date: '2025-05-15', balance: 12800000 },
            { date: '2025-06-01', balance: 14000000 },
            { date: '2025-06-15', balance: 15500000 },
            { date: '2025-07-01', balance: 16800000 },
            { date: '2025-07-15', balance: 18000000 },
            { date: '2025-08-01', balance: 19500000 },
            { date: '2025-08-15', balance: 21000000 },
            { date: '2025-09-01', balance: 22500000 },
            { date: '2025-09-15', balance: 23800000 },
            { date: '2025-10-01', balance: 25000000 },
            { date: '2025-10-15', balance: 26000000 },
            { date: '2025-11-01', balance: 27000000 },
            { date: '2025-11-15', balance: 27500000 },
            { date: '2025-12-01', balance: 28000000 },
            { date: '2025-12-31', balance: 28450000 },
        ]
    };

    const mockTransactions = [
        { id: 1, transaction_type: 'DEPOSIT', amount: 450000, description: 'End of Year Bonus', created_at: '2025-12-28T10:30:00Z' },
        { id: 2, transaction_type: 'INVESTMENT', amount: 300000, description: 'Real Estate Fund', created_at: '2025-12-15T14:20:00Z' },
        { id: 3, transaction_type: 'RETURN', amount: 25000, description: 'Nov Dividend Payout', created_at: '2025-11-30T09:15:00Z' },
        { id: 4, transaction_type: 'DEPOSIT', amount: 800000, description: 'Salary - November', created_at: '2025-11-25T08:00:00Z' },
        { id: 5, transaction_type: 'INVESTMENT', amount: 500000, description: 'Tech Index Fund', created_at: '2025-10-10T16:45:00Z' },
        { id: 6, transaction_type: 'WITHDRAWAL', amount: 150000, description: 'Holiday Prep', created_at: '2025-10-05T11:30:00Z' },
        { id: 7, transaction_type: 'DEPOSIT', amount: 800000, description: 'Salary - September', created_at: '2025-09-25T10:00:00Z' },
        { id: 8, transaction_type: 'INVESTMENT', amount: 200000, description: 'Agriculture Bond', created_at: '2025-08-22T13:20:00Z' },
        { id: 9, transaction_type: 'RETURN', amount: 20000, description: 'Quarterly Interest', created_at: '2025-07-18T09:30:00Z' },
        { id: 10, transaction_type: 'DEPOSIT', amount: 800000, description: 'Salary - June', created_at: '2025-06-25T08:00:00Z' },
        { id: 11, transaction_type: 'WITHDRAWAL', amount: 100000, description: 'Utility Payments', created_at: '2025-05-10T15:45:00Z' },
        { id: 12, transaction_type: 'INVESTMENT', amount: 400000, description: 'Fixed Income Fund', created_at: '2025-04-05T12:00:00Z' },
        { id: 13, transaction_type: 'DEPOSIT', amount: 800000, description: 'Salary - March', created_at: '2025-03-25T08:00:00Z' },
        { id: 14, transaction_type: 'INVESTMENT', amount: 250000, description: 'Mutual Fund', created_at: '2025-02-12T14:30:00Z' },
        { id: 15, transaction_type: 'RETURN', amount: 15000, description: 'Interest Payout', created_at: '2025-01-20T10:15:00Z' },
        { id: 16, transaction_type: 'DEPOSIT', amount: 1000000, description: 'Opening Balance', created_at: '2025-01-01T09:00:00Z' },
    ];

    // Determine values based on mode
    const finalBalance = isDemo ? mockAnalytics.allocation.wallet : walletBalance;
    const transactions = isDemo ? mockTransactions : realTransactions;
    const analytics = isDemo ? mockAnalytics : realAnalytics;

    // Combined Loading State
    const isLoading = isDemo ? false : (walletLoading || txLoading || analyticsLoading);
    const { allocation, chart_data } = analytics || { allocation: {}, chart_data: [] };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10" id="tour-welcome">
            {/* Header & Quote Slider */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
                        Good Morning! ☀️
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-gilroy text-lg">
                        Here is your wealth command center overview.
                    </p>
                    <div className="mt-4 flex gap-3">
                        <Button onClick={startTour} variant="secondary" size="sm" className="rounded-full font-bold">
                            Replay Tour
                        </Button>
                    </div>
                </div>
                <div className="md:col-span-1">
                    <QuoteSlider />
                </div>
            </div>

            {/* Financial Freedom Meter */}
            <div id="tour-balance" className="relative group">
                <FreedomMeter currentAssets={allocation.net_worth || 0} />
                <Button
                    onClick={() => setShowMapModal(true)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 transition opacity-0 group-hover:opacity-100"
                >
                    Refine Map
                </Button>
            </div>

            {/* Sub Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    label="Wallet Balance"
                    value={finalBalance}
                    icon={Wallet}
                    onClick={() => window.location.href = '/dashboard/wallet'}
                />

                <StatsCard
                    label="Active Accelerator Value"
                    value={allocation.savings || 0}
                    icon={TrendingUp}
                    trend="up"
                    trendValue="Growing"
                />

                <div className="hidden lg:block">
                    <StatsCard
                        label="Total Accumulation"
                        value={allocation.net_worth || 0}
                        icon={TrendingUp}
                        className="bg-slate-50 dark:bg-slate-800/50"
                    />
                </div>
            </div>


            {/* Portfolio Rebalancing */}
            {!isDemo && (
                <div id="tour-rebalancing">
                    <RebalancingWidget />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Growth Chart */}
                    <Card className="rounded-3xl p-8 shadow-sm border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-xl font-rowdies">Financial Growth</h3>
                                <p className="text-sm text-gray-500">Portfolio performance over time</p>
                            </div>
                            <Select defaultValue="30">
                                <SelectTrigger className="w-[140px] bg-gray-50 dark:bg-slate-800 border-none font-bold">
                                    <SelectValue placeholder="Period" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">Last 30 Days</SelectItem>
                                    <SelectItem value="90">Last 90 Days</SelectItem>
                                    <SelectItem value="year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="h-[300px] w-full">
                            {chart_data && chart_data.length > 0 ? (
                                <AnalyticsChart data={chart_data} />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-gray-100 dark:border-slate-700">
                                    <PieChart size={48} className="mb-4 opacity-20" />
                                    <p>Start investing to see your growth chart</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Quick Actions Panel */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="tour-actions">
                        <Link href="/dashboard/wallet" className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl hover:bg-green-100 dark:hover:bg-green-900/30 transition group cursor-pointer border border-transparent hover:border-green-200">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 mb-3 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="font-bold text-green-800 dark:text-green-400">Deposit</span>
                        </Link>

                        <Link href="/dashboard/pot" className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition group cursor-pointer border border-transparent hover:border-blue-200">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-3 group-hover:scale-110 transition-transform">
                                <TrendingUp size={24} />
                            </div>
                            <span className="font-bold text-blue-800 dark:text-blue-400">Invest</span>
                        </Link>

                        <Link href="/dashboard/plans" className="flex flex-col items-center justify-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition group cursor-pointer border border-transparent hover:border-purple-200">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/30 mb-3 group-hover:scale-110 transition-transform">
                                <Wallet size={24} />
                            </div>
                            <span className="font-bold text-purple-800 dark:text-purple-400">Plans</span>
                        </Link>

                        <Link href="/dashboard/transactions" className="flex flex-col items-center justify-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition group cursor-pointer border border-transparent hover:border-orange-200">
                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mb-3 group-hover:scale-110 transition-transform">
                                <ArrowRight size={24} />
                            </div>
                            <span className="font-bold text-orange-800 dark:text-orange-400">History</span>
                        </Link>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Gamification Task Widget */}
                    <TaskWidget onOpenMap={() => setShowMapModal(true)} isDemo={isDemo} />

                    {/* Habit Streak Tracker */}
                    {/* Habit Streak Tracker */}
                    <Card className="rounded-3xl p-6 shadow-sm border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900" id="tour-streaks">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-orange-500" size={24} />
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg font-rowdies">Habit Streak</h3>
                        </div>
                        <div className="flex justify-between items-center bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl">
                            <p className="text-3xl font-black text-orange-600 font-rowdies">14 <span className="text-sm font-normal">Months</span></p>
                            <Badge variant="outline" className="text-[10px] text-orange-700 dark:text-orange-400 font-bold bg-orange-200 dark:bg-orange-900/50 px-3 py-1 rounded-full text-center border-none">Elite Level</Badge>
                        </div>
                        <p className="mt-4 text-[10px] text-gray-400 uppercase font-black leading-tight">
                            Consistency Reward: <span className="text-primary"> -0.5% Commision</span> unlocked 🔓
                        </p>
                    </Card>

                    {/* Asset Allocation */}
                    <Card className="rounded-3xl p-6 shadow-sm border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900" id="tour-assets">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg font-rowdies mb-6">Asset Allocation</h3>
                        <div className="h-[250px]">
                            <AssetsPieChart allocation={allocation} />
                        </div>
                    </Card>

                    {/* Recent Transactions -> Growth Log */}
                    <Card className="rounded-3xl p-6 shadow-sm border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg font-rowdies">Growth Log</h3>
                            <Link href="/dashboard/transactions" className="text-xs font-bold text-primary hover:text-primary/80">View All</Link>
                        </div>

                        <div className="space-y-4">
                            {transactions.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-8">No recent activity</p>
                            ) : (
                                transactions.slice(0, 5).map((tx: any) => (
                                    <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition cursor-default">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.transaction_type === 'DEPOSIT' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {tx.transaction_type === 'DEPOSIT' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-gray-200 text-sm truncate max-w-[100px]">{tx.description || tx.transaction_type}</p>
                                                <p className="text-[10px] text-primary font-black uppercase tracking-tighter">
                                                    {tx.transaction_type === 'DEPOSIT' ? '+0.04% Freedom' : 'Security Buffer'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`font-bold text-sm ${tx.transaction_type === 'DEPOSIT' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                            {tx.transaction_type === 'DEPOSIT' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <WealthMapModal isOpen={showMapModal} onClose={() => setShowMapModal(false)} />
        </div>
    );
};

export default Overview;
