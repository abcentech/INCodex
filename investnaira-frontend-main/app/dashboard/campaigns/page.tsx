"use client";

import React, { useState } from 'react';
import { useCampaigns } from '@/hook/useCampaigns';
import CampaignCard from '../_components/CampaignCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const CampaignMarketplace = () => {
    const { campaigns, isLoading } = useCampaigns();
    const [searchQuery, setSearchQuery] = useState('');
    const [riskFilter, setRiskFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    // Filter and sort campaigns
    const filteredCampaigns = campaigns
        .filter(campaign => {
            const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRisk = riskFilter === 'all' || campaign.risk_level === riskFilter;
            return matchesSearch && matchesRisk;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return parseFloat(a.unit_price) - parseFloat(b.unit_price);
            if (sortBy === 'price-high') return parseFloat(b.unit_price) - parseFloat(a.unit_price);
            if (sortBy === 'newest') return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
            return 0;
        });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 size={48} className="animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-bold animate-pulse">Loading amazing opportunities...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-rowdies leading-tight">
                        Investment <span className="text-primary">Marketplace</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
                        Discover high-yield investment opportunities vetted by experts. Start growing your wealth with as little as one unit.
                    </p>
                </div>

                <div className="hidden md:block">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                        <div className="bg-primary text-white p-2 rounded-xl">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-primary">Total Opportunities</p>
                            <p className="text-2xl font-black font-rowdies text-gray-900 dark:text-white">{campaigns.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search by title or description..."
                        className="pl-10 h-12 rounded-xl border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="w-[180px]">
                        <Select value={riskFilter} onValueChange={setRiskFilter}>
                            <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-slate-700">
                                <Filter size={18} className="mr-2 text-gray-400" />
                                <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Risks</SelectItem>
                                <SelectItem value="CONSERVATIVE">🛡️ Conservative</SelectItem>
                                <SelectItem value="BALANCED">⚖️ Balanced</SelectItem>
                                <SelectItem value="AGGRESIVE">🔥 Aggressive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-[180px]">
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-slate-700">
                                <SlidersHorizontal size={18} className="mr-2 text-gray-400" />
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-200 dark:border-slate-700 gap-2 font-bold">
                        <SlidersHorizontal size={18} />
                        Advanced
                    </Button>
                </div>
            </div>

            {/* Campaign Grid */}
            {filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-slate-900/50 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl p-20 text-center">
                    <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Search size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black font-rowdies text-gray-900 dark:text-white mb-2">No opportunities found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        We couldn't find any investment opportunities matching your current filters. Try adjusting your search or filters.
                    </p>
                    <Button
                        variant="link"
                        className="text-primary font-bold"
                        onClick={() => {
                            setSearchQuery('');
                            setRiskFilter('all');
                            setSortBy('newest');
                        }}
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CampaignMarketplace;
