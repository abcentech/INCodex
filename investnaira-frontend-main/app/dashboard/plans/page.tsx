"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuths } from "../../../hook/useAuths";
import Link from "next/link";
import { formatCurrency } from "../../../utils/format";

const PlansPage = () => {
    const { accessToken } = useAuths();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            if (!accessToken) return;
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setCampaigns(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [accessToken]);

    if (loading) return <div className="p-8 text-center bg-gray-50 h-full">Loading plans...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Investment Plans</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp: any) => (
                    <div key={camp.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                        <div className="h-32 bg-gray-800 flex items-center justify-center text-white">
                            {/* Placeholder for Campaign Image */}
                            <span className="text-lg font-bold opacity-50">{camp.title}</span>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{camp.title}</h3>
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-bold">
                                    {camp.risk_level}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3">{camp.description}</p>

                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Unit Price</span>
                                    <span className="font-bold text-gray-900">{formatCurrency(parseFloat(camp.unit_price))}</span>
                                </div>
                                <Link href={`/dashboard/plans/${camp.id}`} className="block w-full bg-green-600 text-white text-center py-2 rounded-lg font-medium hover:bg-green-700 transition">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {campaigns.length === 0 && (
                <div className="text-center p-12 text-gray-500">No active investment plans available.</div>
            )}
        </div>
    );
};

export default PlansPage;
