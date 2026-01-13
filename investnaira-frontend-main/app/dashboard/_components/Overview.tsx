"use client";
import React, { useEffect, useState } from "react";
import { useWallet } from "../../../hook/useWallet";
import axios from "axios";
import { useAuths } from "../../../hook/useAuths";
import Link from "next/link";
import { formatCurrency } from "../../../utils/format";
import AnalyticsChart from "./AnalyticsChart";
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Overview = () => {
    const { balance, loading: walletLoading } = useWallet();
    const { accessToken } = useAuths();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;
            try {
                const [txRes, analyticsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions/`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/analytics/`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    })
                ]);

                setTransactions(txRes.data);
                setAnalytics(analyticsRes.data);
            } catch (e) {
                console.error("Dashboard data fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [accessToken]);

    if (walletLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const { allocation, chart_data } = analytics || { allocation: {}, chart_data: [] };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Balance Card */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Wallet size={48} className="text-primary" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Wallet Balance</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{formatCurrency(balance)}</span>
                    </div>
                    <div className="mt-4 flex gap-3">
                        <Link href="/dashboard/wallet" className="text-xs bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition shadow-sm hover:shadow">
                            Fund Wallet
                        </Link>
                    </div>
                </div>

                {/* Investment Stats */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingUp size={48} className="text-green-600" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Investments</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">{formatCurrency(allocation.savings || 0)}</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 w-fit px-2 py-1 rounded-md">
                        <TrendingUp size={12} />
                        <span>Growing daily</span>
                    </div>
                </div>

                {/* Net Worth */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
                    <h3 className="text-sm font-medium opacity-70 mb-1">Total Net Worth</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{formatCurrency(allocation.net_worth || 0)}</span>
                    </div>
                    <p className="text-xs opacity-50 mt-2">Combined Wallet & Investments</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Financial Growth</h3>
                        <div className="flex gap-2">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-600">Last 30 Days</span>
                        </div>
                    </div>
                    {chart_data && chart_data.length > 0 ? (
                        <AnalyticsChart data={chart_data} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                            No chart data available yet
                        </div>
                    )}
                </div>

                {/* Recent Transactions Side List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                        <h3 className="font-bold text-gray-800">Recent Activity</h3>
                        <Link href="/dashboard/transactions" className="text-xs font-medium text-primary hover:text-primary/80 transition flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto max-h-[400px] custom-scrollbar">
                        {transactions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                <div className="p-3 bg-gray-100 rounded-full mb-3">
                                    <Wallet size={24} className="text-gray-400" />
                                </div>
                                <p>No transactions yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {transactions.slice(0, 6).map((tx: any) => (
                                    <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${tx.transaction_type === 'DEPOSIT' || tx.transaction_type === 'RETURN'
                                                    ? 'bg-green-100 text-green-600 group-hover:bg-green-200'
                                                    : 'bg-red-50 text-red-500 group-hover:bg-red-100'
                                                }`}>
                                                {tx.transaction_type === 'DEPOSIT' || tx.transaction_type === 'RETURN'
                                                    ? <ArrowDownRight size={18} />
                                                    : <ArrowUpRight size={18} />
                                                }
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm truncate max-w-[120px]">{tx.description || tx.transaction_type}</p>
                                                <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold text-sm ${tx.transaction_type === 'DEPOSIT' || tx.transaction_type === 'RETURN'
                                                ? 'text-green-600'
                                                : 'text-gray-800'
                                            }`}>
                                            {tx.transaction_type === 'DEPOSIT' || tx.transaction_type === 'RETURN' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions (Optional, or can remain in Sidebar/BottomNav) */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent rounded-xl p-1">
                {/* Placeholder for future widgets or ads */}
            </div>
        </div>
    );
};

export default Overview;
