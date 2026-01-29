"use client";

import React, { useState } from 'react';
import { useReferrals } from '@/hook/useReferrals';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Copy,
    Share2,
    Users,
    Trophy,
    Gift,
    CheckCircle2,
    Clock,
    ExternalLink,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const ReferralDashboard = () => {
    const { stats, isLoading, applyCode, isApplying, applyError, applySuccess } = useReferrals();
    const [referralCodeInput, setReferralCodeInput] = useState('');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Referral code copied to clipboard!");
    };

    const handleApplyCode = () => {
        if (!referralCodeInput) return;
        applyCode(referralCodeInput);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 size={48} className="animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-bold font-rowdies animate-pulse">Loading referral stats...</p>
            </div>
        );
    }

    const shareUrl = `https://investnaira.com/signup?ref=${stats?.referral_code}`;

    return (
        <div className="space-y-10 pb-20 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-rowdies leading-tight">
                        Refer & <span className="text-primary">Earn</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                        Share the wealth with your friends. Get rewarded every time someone signs up and completes their KYC using your link.
                    </p>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 flex items-center gap-6 shadow-sm">
                    <div className="bg-primary text-white p-4 rounded-2xl">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none mb-1 text-primary">Total Earnings</p>
                        <p className="text-3xl font-black font-rowdies text-gray-900 dark:text-white">₦{parseFloat(stats?.total_earnings || '0').toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Stats & Code */}
                <div className="lg:col-span-12 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Referral Code Card */}
                        <Card className="p-8 rounded-[40px] border-none shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden relative group">
                            <div className="absolute -top-10 -right-10 bg-primary/10 w-40 h-40 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors"></div>

                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black font-rowdies flex items-center gap-2">
                                        <Gift className="text-primary" />
                                        Your Referral Code
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">Share this code with your friends to earn rewards.</p>
                                </div>

                                <div className="flex gap-2">
                                    <div className="flex-1 bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-center font-black text-2xl tracking-[0.2em] font-mono text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700">
                                        {stats?.referral_code}
                                    </div>
                                    <Button
                                        onClick={() => copyToClipboard(stats?.referral_code || '')}
                                        className="h-auto px-6 rounded-2xl bg-primary hover:bg-primary-dark transition-all transform active:scale-95"
                                    >
                                        <Copy size={20} className="mr-2" />
                                        Copy
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 dark:border-slate-800 gap-2 font-bold hover:bg-primary/5 hover:text-primary transition-all">
                                        <Share2 size={18} />
                                        Share Link
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 dark:border-slate-800 gap-2 font-bold hover:bg-sky-500/10 hover:text-sky-500 transition-all">
                                        Twitter
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-gray-200 dark:border-slate-800 gap-2 font-bold hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Apply Code Card */}
                        <Card className="p-8 rounded-[40px] border-none shadow-xl bg-white dark:bg-slate-900/50 backdrop-blur-sm">
                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black font-rowdies flex items-center gap-2">
                                        <ExternalLink className="text-primary" />
                                        Have a code?
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">Enter a friend's referral code to link your accounts.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter 8-digit code"
                                            className="h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 border-none text-lg font-bold text-center uppercase tracking-widest focus:ring-2 focus:ring-primary/20"
                                            value={referralCodeInput}
                                            onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleApplyCode}
                                        disabled={isApplying || !referralCodeInput}
                                        className="w-full h-14 rounded-2xl font-black text-lg bg-gray-900 dark:bg-white dark:text-gray-900 transition-all active:scale-[0.98]"
                                    >
                                        {isApplying ? <Loader2 className="animate-spin mr-2" /> : 'Apply Code'}
                                    </Button>

                                    {applyError && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100 italic font-medium">
                                            <AlertCircle size={14} />
                                            {(applyError as any)?.response?.data?.details || "Invalid referral code."}
                                        </div>
                                    )}
                                    {applySuccess && (
                                        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-xl text-xs border border-green-100 italic font-medium">
                                            <CheckCircle2 size={14} />
                                            Code applied successfully!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black font-rowdies flex items-center gap-3">
                                <Users className="text-primary" />
                                Referral History
                                <Badge className="bg-primary/10 text-primary border-none text-xs font-black">
                                    {stats?.total_referrals} Total
                                </Badge>
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-slate-900/50 rounded-[40px] border border-gray-100 dark:border-slate-800 overflow-hidden shadow-lg">
                            {stats?.referrals && stats.referrals.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-slate-800">
                                    {stats.referrals.map((ref) => (
                                        <div key={ref.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-primary">
                                                    {ref.referred_user_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-white leading-none mb-1">{ref.referred_user_name}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                        Joined {new Date(ref.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right flex items-center gap-8">
                                                <div className="hidden md:block">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase">
                                                        {ref.status === 'COMPLETED' ? (
                                                            <span className="text-green-500 flex items-center gap-1">
                                                                <CheckCircle2 size={14} />
                                                                KYC Verified
                                                            </span>
                                                        ) : ref.status === 'REWARDED' ? (
                                                            <span className="text-primary flex items-center gap-1">
                                                                <Trophy size={14} />
                                                                Rewarded
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-500 flex items-center gap-1">
                                                                <Clock size={14} />
                                                                Pending KYC
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="w-24">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bonus</p>
                                                    <p className="font-black text-gray-900 dark:text-white">₦{parseFloat(ref.reward_amount).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <div className="bg-gray-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <Users size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="text-xl font-black font-rowdies text-gray-900 dark:text-white mb-2">No referrals yet</h3>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto font-medium">
                                        Start sharing your link with friends to earn rewards and climb the leaderboard!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralDashboard;
