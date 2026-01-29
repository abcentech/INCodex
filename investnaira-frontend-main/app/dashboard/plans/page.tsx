"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuths } from "../../../hook/useAuths";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCurrency } from "../../../utils/format";
import GoalCard from "../_components/GoalCard";
import StatsCard from "../_components/StatsCard";
import { Plus, Target, Trophy, Clock } from "lucide-react";

const PlansPage = () => {
    const { accessToken } = useAuths();
    const router = useRouter();
    const [userPlans, setUserPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            if (!accessToken) return;
            try {
                // Fetch User's Active Plans instead of generic campaigns
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/user_savings_plans/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setUserPlans(res.data);
            } catch (e) {
                console.error("Failed to fetch plans", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, [accessToken]);

    // Calculate Stats
    const totalGoalBalance = userPlans.reduce((acc, plan) => acc + parseFloat(plan.balance || 0), 0);
    const activeGoals = userPlans.filter(p => p.status === 'ACTIVE').length;

    // Map data to GoalCard props
    const mapPlanToCard = (plan: any) => ({
        id: plan.id,
        title: plan.savings_plan?.campaign?.title || plan.title || "My Savings Goal",
        category: plan.savings_plan?.campaign?.risk_level || "Personal",
        targetAmount: plan.target_amount ? parseFloat(plan.target_amount) : undefined, // Assuming API might have this, else undefined
        currentAmount: parseFloat(plan.balance || 0),
        imageSrc: plan.savings_plan?.campaign?.images?.[0] || "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=2070&auto=format&fit=crop",
        status: plan.status as "ACTIVE" | "COMPLETED" | "PENDING",
        autoTransfer: plan.auto_transfer_enabled,
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
                        Target Missions
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-gilroy text-lg">
                        Track your progress towards financial freedom.
                    </p>
                </div>
                <Link
                    href="/dashboard/pot"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-transform active:scale-95"
                >
                    <Plus size={20} /> New Mission
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    label="Total Goal Balance"
                    value={totalGoalBalance}
                    icon={Target}
                    className="bg-slate-900 text-white dark:bg-slate-800 border-none"
                    trend="up"
                    trendValue="On Track"
                />
                <StatsCard
                    label="Active Missions"
                    value={activeGoals}
                    icon={Clock}
                />
                <StatsCard
                    label="Goals Crush"
                    value={userPlans.filter(p => p.status === 'COMPLETED').length}
                    icon={Trophy}
                />
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Loading State */}
                {loading && [1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-gray-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                ))}

                {!loading && userPlans.length > 0 ? (
                    userPlans.map((plan) => (
                        <GoalCard
                            key={plan.id}
                            {...mapPlanToCard(plan)}
                            onClick={() => {
                                router.push(`/dashboard/plans/manage/${plan.id}`);
                            }}
                        />
                    ))
                ) : !loading && (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Missions</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">You haven't started any savings plans yet. Pick a verified opportunity from the Pot to start your journey.</p>
                        <Link
                            href="/dashboard/pot"
                            className="text-primary font-bold hover:underline"
                        >
                            Explore Opportunities &rarr;
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlansPage;
