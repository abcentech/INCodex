"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Campaign } from '@/hook/useCampaigns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, TrendingUp, Shield, Zap } from 'lucide-react';

interface CampaignCardProps {
    campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
    const progress = (campaign.current_units / campaign.total_units) * 100;

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'CONSERVATIVE':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'BALANCED':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'AGGRESIVE':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case 'CONSERVATIVE':
                return <Shield size={14} />;
            case 'BALANCED':
                return <TrendingUp size={14} />;
            case 'AGGRESIVE':
                return <Zap size={14} />;
            default:
                return null;
        }
    };

    const imageUrl = campaign.images?.[0]?.image || '/images/campaign-placeholder.jpg';

    return (
        <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white dark:bg-slate-900/50 backdrop-blur-sm">
            <Link href={`/dashboard/campaigns/${campaign.id}`}>
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={campaign.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={`${getRiskColor(campaign.risk_level)} border-none flex gap-1 items-center px-2 py-1`}>
                            {getRiskIcon(campaign.risk_level)}
                            {campaign.risk_level}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-black text-xl text-gray-900 dark:text-white line-clamp-1 font-rowdies">
                            {campaign.title}
                        </h3>
                        <ArrowUpRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                        {campaign.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Price per unit</p>
                            <p className="font-black text-lg text-primary">₦{parseFloat(campaign.unit_price).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">ROI Estimated</p>
                            <p className="font-black text-lg text-green-500">12 - 18%</p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-500">Funded</span>
                            <span className="text-primary">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-100 dark:bg-slate-800" />
                        <div className="flex justify-between text-[10px] text-gray-400">
                            <span>{campaign.current_units.toLocaleString()} units</span>
                            <span>{campaign.total_units.toLocaleString()} units</span>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

export default CampaignCard;
