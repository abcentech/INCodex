"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuths } from "../../../../hook/useAuths";
import { formatCurrency, formatDate } from "../../../../utils/format";
import { toast } from "react-toastify";
import { useWallet } from "../../../../hook/useWallet";

const PlanDetailPage = () => {
    const { id } = useParams();
    const { accessToken } = useAuths();
    const { balance, refetch } = useWallet();
    const router = useRouter();

    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [amount, setAmount] = useState("");
    const [investing, setInvesting] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!accessToken) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/${id}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setCampaign(res.data);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load plan details");
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, accessToken]);

    const handleInvest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;

        const numAmount = parseFloat(amount);
        if (numAmount < parseFloat(selectedPlan.min_investment)) {
            toast.error(`Minimum investment is ${formatCurrency(parseFloat(selectedPlan.min_investment))}`);
            return;
        }
        if (numAmount > balance) {
            toast.error("Insufficient wallet balance");
            return;
        }

        setInvesting(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/campaigns/user_savings_plans/`,
                {
                    savings_plan: selectedPlan.id,
                    amount: numAmount,
                    units_bought: Math.floor(numAmount / parseFloat(campaign.unit_price || 1)) // Estimate units
                },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success("Investment successful!");
            refetch(); // Update balance
            router.push("/dashboard/plans");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.details || "Investment failed";
            toast.error(msg);
        } finally {
            setInvesting(false);
        }
    };

    if (loading) return <div className="p-8 text-center bg-gray-50 h-full">Loading details...</div>;
    if (!campaign) return <div className="p-8 text-center text-gray-500">Plan not found</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2">
                ← Back to Plans
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
                        <p className="text-gray-500 text-sm mb-6">
                            Runs from {formatDate(campaign.start_date)} to {formatDate(campaign.end_date)}
                        </p>

                        <div className="prose max-w-none text-gray-700">
                            <h3 className="text-lg font-bold mb-2">Description</h3>
                            <p>{campaign.description}</p>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="block text-xs text-gray-500 uppercase">Risk Level</span>
                                <span className="font-bold text-gray-900">{campaign.risk_level}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="block text-xs text-gray-500 uppercase">Unit Price</span>
                                <span className="font-bold text-gray-900">{formatCurrency(parseFloat(campaign.unit_price))}</span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <span className="block text-xs text-gray-500 uppercase">Total Units</span>
                                <span className="font-bold text-gray-900">{campaign.total_units}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Investment Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Invest Now</h3>

                        <div className="mb-6 bg-green-50 p-4 rounded-lg">
                            <span className="text-sm text-green-800">Your Wallet Balance</span>
                            <div className="text-2xl font-bold text-green-700">{formatCurrency(balance)}</div>
                        </div>

                        {!selectedPlan ? (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500 mb-2">Select a plan to continue:</p>
                                {campaign.savings_plans && campaign.savings_plans.map((plan: any) => (
                                    <div key={plan.id}
                                        onClick={() => setSelectedPlan(plan)}
                                        className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-900">{plan.tier}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{plan.contribution_frequency}</span>
                                        </div>
                                        <p className="text-xs text-gray-500">Min: {formatCurrency(parseFloat(plan.min_investment))}</p>
                                    </div>
                                ))}
                                {(!campaign.savings_plans || campaign.savings_plans.length === 0) && (
                                    <p className="text-sm text-gray-400 italic">No open plans available.</p>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleInvest}>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-700">Selected: {selectedPlan.tier}</span>
                                        <button type="button" onClick={() => setSelectedPlan(null)} className="text-xs text-blue-600 hover:underline">Change</button>
                                    </div>
                                    <label className="block text-xs text-gray-500 mb-1">Amount to Invest</label>
                                    <input
                                        type="number"
                                        required
                                        min={selectedPlan.min_investment}
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Min: {formatCurrency(parseFloat(selectedPlan.min_investment))}</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={investing}
                                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                >
                                    {investing ? "Processing..." : "Confirm Investment"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailPage;
