"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCampaigns } from '@/hook/useCampaigns';
import CampaignInvestmentModal from '../../_components/CampaignInvestmentModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/Seperator';
import {
    ChevronLeft,
    Share2,
    Info,
    Shield,
    TrendingUp,
    Zap,
    Building2,
    Calendar,
    Target,
    ArrowRightCircle,
    CheckCircle2,
    Clock,
    BarChart3
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

const CampaignDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { getCampaign } = useCampaigns();
    const { data: campaign, isLoading, error } = getCampaign(id as string);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-gray-500 font-bold font-rowdies animate-pulse uppercase tracking-widest text-sm">Analyzing Opportunity...</p>
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
                <div className="bg-red-50 p-6 rounded-full mb-6">
                    <Info size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-black font-rowdies mb-2">Opportunity Missing</h2>
                <p className="text-gray-500 mb-8 max-w-md">We couldn't retrieve the details for this investment campaign. It might have ended or been removed.</p>
                <Button onClick={() => router.push('/dashboard/campaigns')} className="rounded-xl px-8 h-12 font-bold">
                    Back to Marketplace
                </Button>
            </div>
        );
    }

    const progress = (campaign.current_units / campaign.total_units) * 100;
    const daysRemaining = Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

    const getRiskInfo = (risk: string) => {
        switch (risk) {
            case 'CONSERVATIVE':
                return {
                    label: 'Conservative',
                    icon: <Shield size={18} />,
                    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                    desc: 'Low variance investments focused on capital preservation.'
                };
            case 'BALANCED':
                return {
                    label: 'Balanced',
                    icon: <TrendingUp size={18} />,
                    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
                    desc: 'A mix of safety and growth potential for steady accumulation.'
                };
            case 'AGGRESIVE':
                return {
                    label: 'Aggressive',
                    icon: <Zap size={18} />,
                    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    desc: 'Higher potential returns with increased market exposure.'
                };
            default:
                return { label: risk, icon: <Info size={18} />, color: 'bg-gray-100 text-gray-700', desc: '' };
        }
    };

    const riskInfo = getRiskInfo(campaign.risk_level);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Nav & Action Bar */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/dashboard/campaigns')}
                    className="gap-2 text-gray-500 font-bold hover:text-primary transition-colors"
                >
                    <ChevronLeft size={20} />
                    Back to Marketplace
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl border-gray-200 dark:border-slate-800">
                        <Share2 size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Media & Info */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Hero Section */}
                    <div className="space-y-6">
                        <div className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={campaign.images?.[0]?.image || '/images/campaign-placeholder.jpg'}
                                alt={campaign.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                                <Badge className={`${riskInfo.color} mb-4 border-none text-xs font-black uppercase tracking-widest py-1.5 px-3 rounded-full flex w-fit gap-1.5 items-center shadow-lg backdrop-blur-md`}>
                                    {riskInfo.icon}
                                    {riskInfo.label} Risk
                                </Badge>
                                <h1 className="text-4xl md:text-5xl font-black text-white font-rowdies mb-2 drop-shadow-lg">
                                    {campaign.title}
                                </h1>
                                <div className="flex items-center gap-4 text-gray-300 font-bold text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 size={16} />
                                        {campaign.business_name || "InvestNaira Partner"}
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                    <div className="flex items-center gap-1.5 text-primary">
                                        <TrendingUp size={16} />
                                        12 - 18% Target ROI
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black font-rowdies flex items-center gap-3">
                            <Info className="text-primary" />
                            About this Opportunity
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 text-lg leading-relaxed bg-white dark:bg-slate-900/50 p-8 rounded-3xl border border-gray-100 dark:border-slate-800">
                            {campaign.description}
                        </div>
                    </div>

                    {/* Risk Profile */}
                    <Card className="p-8 border-none bg-primary/5 rounded-3xl">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className={`${riskInfo.color} p-6 rounded-2xl shadow-inner`}>
                                {riskInfo.icon && React.cloneElement(riskInfo.icon as React.ReactElement, { size: 48 })}
                            </div>
                            <div className="space-y-2 flex-1 text-center md:text-left">
                                <h3 className="text-xl font-black font-rowdies">Risk Assessment: {riskInfo.label}</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">{riskInfo.desc}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-center bg-white dark:bg-slate-900 p-4 rounded-2xl w-24 shadow-sm border border-gray-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Volatilty</p>
                                    <p className="font-black text-primary">Low</p>
                                </div>
                                <div className="text-center bg-white dark:bg-slate-900 p-4 rounded-2xl w-24 shadow-sm border border-gray-100 dark:border-slate-800">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Liquidity</p>
                                    <p className="font-black text-primary">Medium</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Business Info */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black font-rowdies">Business Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 border-none bg-white dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl">
                                    <Building2 className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Registered Company</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{campaign.business_name || "InvestNaira Partner"}</p>
                                </div>
                            </Card>
                            <Card className="p-6 border-none bg-white dark:bg-slate-900/50 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center gap-4">
                                <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl">
                                    <CheckCircle2 className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Verification Status</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Fully Vetted</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Right Column: Investment Widget */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="p-8 rounded-[40px] border-none shadow-2xl bg-white dark:bg-slate-900 sticky top-10">
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Investment Summary</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-primary font-rowdies">₦{parseFloat(campaign.unit_price).toLocaleString()}</span>
                                    <span className="text-gray-400 font-bold">/ Unit</span>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-gray-100 dark:border-slate-800/50">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Target ROI</p>
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp size={16} className="text-green-500" />
                                        <p className="font-black text-lg">15.5% avg</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-gray-100 dark:border-slate-800/50">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={16} className="text-amber-500" />
                                        <p className="font-black text-lg">9 - 12 Mos</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Progress Widget */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fundraising Progress</p>
                                        <p className="font-black text-xl text-gray-900 dark:text-white">{progress.toFixed(1)}%</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Remaining</p>
                                        <p className="font-black text-amber-500">{daysRemaining} Days</p>
                                    </div>
                                </div>
                                <Progress value={progress} className="h-3 bg-gray-100 dark:bg-slate-800" />
                                <div className="flex justify-between text-xs font-bold text-gray-400">
                                    <span>{campaign.current_units.toLocaleString()} Units Invested</span>
                                    <span>{campaign.total_units.toLocaleString()} Total</span>
                                </div>
                            </div>

                            {/* Investment Limits */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-bold px-1">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Target size={14} className="text-primary" />
                                        Minimum Investment:
                                    </span>
                                    <span className="text-gray-900 dark:text-white">{campaign.min_units} Units (₦{(campaign.min_units * parseFloat(campaign.unit_price)).toLocaleString()})</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold px-1">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Clock size={14} className="text-primary" />
                                        End Date:
                                    </span>
                                    <span className="text-gray-900 dark:text-white">{format(new Date(campaign.end_date), 'MMM dd, yyyy')}</span>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="pt-4 space-y-4">
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full h-16 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-95 flex gap-3"
                                >
                                    Invest Now
                                    <ArrowRightCircle size={24} />
                                </Button>
                                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest">
                                    Protected by InvestNaira Secure-Shield™
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Analytics Card */}
                    <Card className="p-8 rounded-[40px] border-none bg-gradient-to-br from-primary to-primary-dark text-white overflow-hidden relative">
                        <BarChart3 size={150} className="absolute -bottom-10 -right-10 opacity-10 rotate-12" />
                        <div className="relative z-10 space-y-4">
                            <h4 className="font-black text-xl font-rowdies leading-tight">Projected Growth Analytics</h4>
                            <p className="text-white/70 text-sm font-medium">Based on current market trends, this sector is expected to outperform inflation by 4.2% over the next 12 months.</p>
                            <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-xl border-none font-bold">
                                View Full Analysis
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Investment Modal */}
            {campaign && (
                <CampaignInvestmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    campaign={campaign}
                />
            )}
        </div>
    );
};

export default CampaignDetailPage;
