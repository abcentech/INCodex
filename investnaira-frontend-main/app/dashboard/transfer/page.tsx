"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useWallet } from "../../../hook/useWallet";
import { useAuths } from "../../../hook/useAuths";
import { formatCurrency } from "../../../utils/format";

const TransferPage = () => {
    const { balance, refetch } = useWallet();
    const { accessToken } = useAuths();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessToken) return;

        const numAmount = parseFloat(amount);
        if (!numAmount || numAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (numAmount > balance) {
            toast.error("Insufficient balance");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wallet/transfer/`,
                { email, amount: numAmount, description },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            toast.success("Transfer successful!");
            refetch(); // Update balance
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || "Transfer failed";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Transfer Money</h2>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="mb-6 p-4 bg-green-50 rounded-lg flex justify-between items-center">
                    <span className="text-sm text-green-800 font-medium">Available Balance</span>
                    <span className="text-xl font-bold text-green-700">{formatCurrency(balance)}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="Enter user email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            required
                            min="1"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none h-24 resize-none"
                            placeholder="What is this for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processing..." : "Sends Funds"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferPage;
