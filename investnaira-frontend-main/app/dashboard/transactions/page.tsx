"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuths } from "../../../hook/useAuths";
import { formatCurrency, formatDate } from "../../../utils/format";
import StatsCard from "../_components/StatsCard";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, History } from "lucide-react";

const TransactionsPage = () => {
    const { accessToken } = useAuths();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!accessToken) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/transactions/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setTransactions(res.data);
                setFilteredTransactions(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [accessToken]);

    // Handle Filtering
    useEffect(() => {
        let result = transactions;

        // Type Filter
        if (filterType !== "ALL") {
            result = result.filter(tx => tx.transaction_type === filterType);
        }

        // Search Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(tx =>
                tx.description?.toLowerCase().includes(lowerTerm) ||
                tx.amount?.toString().includes(lowerTerm)
            );
        }

        setFilteredTransactions(result);
    }, [searchTerm, filterType, transactions]);

    // Calculate Stats
    const totalIn = transactions
        .filter(t => t.transaction_type === 'DEPOSIT' && t.transaction_status === 'SUCCESS')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const totalOut = transactions
        .filter(t => t.transaction_type === 'WITHDRAWAL' && t.transaction_status === 'SUCCESS')
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
                        Transaction History
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-gilroy text-lg">
                        Keep track of your financial movements.
                    </p>
                </div>
                <button className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    label="Total Inflow"
                    value={totalIn}
                    icon={ArrowDownLeft}
                    className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800"
                />
                <StatsCard
                    label="Total Outflow"
                    value={totalOut}
                    icon={ArrowUpRight}
                    className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800"
                />
                <StatsCard
                    label="Total Transactions"
                    value={transactions.length}
                    icon={History}
                    trend="up"
                    trendValue="All Time"
                />
            </div>

            {/* Main Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Filters Bar */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-slate-800 border-none rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="text-gray-400" size={18} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-sm text-gray-700 dark:text-white cursor-pointer"
                        >
                            <option value="ALL">All Types</option>
                            <option value="DEPOSIT">Deposits</option>
                            <option value="WITHDRAWAL">Withdrawals</option>
                            <option value="INVESTMENT">Investments</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                            {loading ? (
                                [1, 2, 3, 4].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-20 ml-auto"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 dark:bg-slate-800 rounded-full w-16 mx-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx: any) => (
                                    <tr key={tx.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-gilroy">
                                            {formatDate(tx.created_at)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-bold">
                                            {tx.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                                            <span className={`px-2 py-1 rounded-md font-bold ${tx.transaction_type === 'DEPOSIT' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    tx.transaction_type === 'WITHDRAWAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {tx.transaction_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {tx.reference || '-'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-black font-rowdies ${tx.transaction_type === 'DEPOSIT' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {tx.transaction_type === 'DEPOSIT' ? '+' : '-'} {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.transaction_status === 'SUCCESS' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    tx.transaction_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {tx.transaction_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                                <History size={32} className="opacity-50" />
                                            </div>
                                            <p className="font-bold text-lg mb-1">No transactions found</p>
                                            <p className="text-sm">Try adjusting your filters or search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
