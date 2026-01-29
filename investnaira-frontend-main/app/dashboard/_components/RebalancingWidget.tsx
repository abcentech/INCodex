"use client";

import React from 'react';
import { usePortfolio } from '@/hook/usePortfolio';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    RefreshCcw,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
    Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const RebalancingWidget = () => {
    const { portfolioStats, isLoading } = usePortfolio();
    const router = useRouter();

    if (isLoading) {
        return (
            <Card className="p-8 flex flex-col items-center justify-center min-h-[300px] border-none shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[40px]">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-gray-500 font-bold font-rowdies">Analyzing your portfolio...</p>
            </Card>
        );
    }

    if (!portfolioStats || parseFloat(portfolioStats.current_allocation.total_assets) === 0) {
        return (
            <Card className="p-8 border-none shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[40px]">
                <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="text-primary" />
                    <h3 className="text-xl font-black font-rowdies">Portfolio Rebalancing</h3>
                </div>
                <div className="text-center py-10">
                    <p className="text-gray-500 font-medium mb-6">Start investing to see your portfolio analysis and rebalancing recommendations.</p>
                    <Button onClick={() => router.push('/dashboard/campaigns')} className="rounded-2xl font-bold bg-primary hover:bg-primary-dark transition-all">
                        Explore Opportunities
                    </Button>
                </div>
            </Card>
        );
    }

    const { current_allocation, target_allocation, recommendations, risk_profile } = portfolioStats;

    return (
        <Card className="p-8 border-none shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[40px] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <RefreshCcw size={120} className="text-primary" />
            </div>

            <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl">
                            <RefreshCcw className="text-primary" size={24} />
                        </div>
                        <h3 className="text-2xl font-black font-rowdies">Rebalancing</h3>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={14} />
                        {risk_profile} Strategy
                    </Badge>
                </div>

                {/* Allocation Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Current Allocation */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Current Allocation</p>
                            <p className="text-xs font-medium text-gray-400">₦{parseFloat(current_allocation.total_assets).toLocaleString()} Total Assets</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span>Campaigns</span>
                                    <span>{Math.round(parseFloat(current_allocation.percentages.campaigns) * 100)}%</span>
                                </div>
                                <Progress value={parseFloat(current_allocation.percentages.campaigns) * 100} className="h-2.5 bg-gray-100 dark:bg-slate-800" indicatorClassName="bg-primary" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span>Savings + Cash</span>
                                    <span>{Math.round((parseFloat(current_allocation.percentages.savings) + parseFloat(current_allocation.percentages.cash)) * 100)}%</span>
                                </div>
                                <Progress value={(parseFloat(current_allocation.percentages.savings) + parseFloat(current_allocation.percentages.cash)) * 100} className="h-2.5 bg-gray-100 dark:bg-slate-800" indicatorClassName="bg-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Target Allocation */}
                    <div className="space-y-6 opacity-60">
                        <div className="flex justify-between items-end">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Target Allocation</p>
                            <Info size={14} className="text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span>Campaigns</span>
                                    <span>{Math.round(parseFloat(target_allocation.CAMPAIGNS) * 100)}%</span>
                                </div>
                                <Progress value={parseFloat(target_allocation.CAMPAIGNS) * 100} className="h-2.5 bg-gray-50 dark:bg-slate-800/50" indicatorClassName="bg-primary" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span>Savings + Cash</span>
                                    <span>{Math.round(parseFloat(target_allocation.SAVINGS) * 100)}%</span>
                                </div>
                                <Progress value={parseFloat(target_allocation.SAVINGS) * 100} className="h-2.5 bg-gray-50 dark:bg-slate-800/50" indicatorClassName="bg-amber-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-4 pt-4">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <TrendingUp size={16} />
                        Recommended Actions
                    </h4>

                    {recommendations.length > 0 ? (
                        <div className="space-y-3">
                            {recommendations.map((rec, index) => (
                                <div key={index} className={`p-5 rounded-3xl border flex items-center gap-4 transition-all hover:scale-[1.01] ${rec.type === 'BUY'
                                        ? 'bg-emerald-50/50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                                        : 'bg-amber-50/50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/20'
                                    }`}>
                                    <div className={`p-3 rounded-2xl ${rec.type === 'BUY'
                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                        }`}>
                                        {rec.type === 'BUY' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1">{rec.message}</p>
                                        <p className="text-xs text-gray-500 font-medium">Auto-calculated based on your {risk_profile.toLowerCase()} profile.</p>
                                    </div>
                                    <Button
                                        onClick={() => router.push(rec.category === 'CAMPAIGNS' ? '/dashboard/campaigns' : '/dashboard/plans')}
                                        size="sm"
                                        className={`rounded-xl font-bold ${rec.type === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-amber-600 hover:bg-amber-700'
                                            }`}
                                    >
                                        Execute
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-6 bg-blue-50/50 border border-blue-100 dark:bg-blue-500/5 dark:border-blue-500/20 rounded-[30px]">
                            <div className="bg-blue-500 text-white p-2.5 rounded-xl">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <p className="font-black text-blue-900 dark:text-blue-300">Perfectly Balanced!</p>
                                <p className="text-xs text-blue-700/70 dark:text-blue-400 font-medium">Your portfolio perfectly matches your risk profile strategy.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default RebalancingWidget;
