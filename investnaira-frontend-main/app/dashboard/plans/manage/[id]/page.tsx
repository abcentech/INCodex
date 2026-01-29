"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuths } from "@/hook/useAuths";
import { useSavings } from "@/hook/useSavings";
import { formatCurrency, formatDate } from "@/utils/format";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft,
    Settings,
    Zap,
    Calendar,
    TrendingUp,
    History,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

const PlanManagementPage = () => {
    const { id } = useParams();
    const { accessToken } = useAuths();
    const { toggleAutoTransfer, updateTransferAmount, loading: actionLoading } = useSavings();
    const router = useRouter();

    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newAmount, setNewAmount] = useState("");
    const [isEditingAmount, setIsEditingAmount] = useState(false);

    const fetchPlan = async () => {
        if (!accessToken) return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/savings-plans/${id}/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setPlan(res.data);
            setNewAmount(res.data.transfer_amount || "");
        } catch (e) {
            console.error(e);
            toast.error("Failed to load plan details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, [id, accessToken]);

    const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const enabled = e.target.checked;
        const result = await toggleAutoTransfer(id as string, enabled);
        if (result) {
            setPlan({ ...plan, auto_transfer_enabled: result.auto_transfer_enabled });
        }
    };

    const handleUpdateAmount = async () => {
        const amount = parseFloat(newAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error("Invalid amount");
            return;
        }
        const result = await updateTransferAmount(id as string, amount);
        if (result) {
            setPlan({ ...plan, transfer_amount: result.transfer_amount });
            setIsEditingAmount(false);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading Mission Details...</div>;
    if (!plan) return <div className="p-8 text-center text-gray-500">Mission not found.</div>;

    const progress = Math.min((parseFloat(plan.balance) / parseFloat(plan.goal_amount)) * 100, 100);

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push("/dashboard/plans")}
                    className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
                        Manage Mission
                    </h1>
                    <p className="text-gray-500 font-medium">Control your savings trajectory and automation.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Progress Card */}
                    <Card className="rounded-[40px] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:opacity-10 transition-opacity"></div>
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="mb-2 bg-emerald-100 text-emerald-600 border-none px-3 font-bold uppercase tracking-wider text-[10px]">
                                        {plan.status}
                                    </Badge>
                                    <CardTitle className="text-3xl font-black font-rowdies text-gray-900 dark:text-white">
                                        {plan.title}
                                    </CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Saved Balance</p>
                                    <h2 className="text-3xl font-black text-primary font-rowdies">
                                        {formatCurrency(parseFloat(plan.balance))}
                                    </h2>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-bold text-gray-500">Mission Progress</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white font-rowdies">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-4 bg-gray-100 dark:bg-slate-800 rounded-full" />
                                <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Started {formatDate(plan.start_date)}</span>
                                    <span>Target {formatCurrency(parseFloat(plan.goal_amount))}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase">Goal Type</span>
                                        <p className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                            <TrendingUp size={14} /> {plan.goal_type?.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase">Next Mission Date</span>
                                        <p className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                            <Calendar size={14} /> {formatDate(plan.next_transfer_date)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-gray-400 font-black uppercase">Frequency</span>
                                        <p className="font-bold text-gray-700 dark:text-gray-300">
                                            {plan.savings_plan?.contribution_frequency}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Automation Card */}
                    <Card className="rounded-[40px] border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-black pointer-events-none"></div>
                        <CardHeader className="p-8">
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                                        <Zap size={24} fill="currentColor" />
                                    </div>
                                    <CardTitle className="text-2xl font-black font-rowdies">Auto-Mission</CardTitle>
                                </div>
                                <Switch
                                    checked={plan.auto_transfer_enabled}
                                    onChange={handleToggle}
                                    disabled={actionLoading}
                                />
                            </div>
                            <p className="mt-2 text-slate-400 font-medium max-w-sm">Automatically transfer funds from your wallet to this mission periodically.</p>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 relative z-10">
                            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Automation Amount</span>
                                        {!isEditingAmount ? (
                                            <h3 className="text-2xl font-black font-rowdies text-primary">
                                                {formatCurrency(parseFloat(plan.transfer_amount || 0))}
                                            </h3>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={newAmount}
                                                    onChange={(e) => setNewAmount(e.target.value)}
                                                    className="w-32 bg-slate-800 border-slate-700 text-white h-10 rounded-xl"
                                                />
                                                <Button onClick={handleUpdateAmount} size="sm" className="bg-primary rounded-xl h-10 px-4">Save</Button>
                                                <Button onClick={() => setIsEditingAmount(false)} size="sm" variant="ghost" className="text-white hover:bg-slate-800 h-10 px-4">Cancel</Button>
                                            </div>
                                        )}
                                    </div>
                                    {!isEditingAmount && (
                                        <button
                                            onClick={() => setIsEditingAmount(true)}
                                            className="text-slate-400 hover:text-white transition-colors p-2"
                                        >
                                            <Settings size={20} />
                                        </button>
                                    )}
                                </div>

                                {plan.auto_transfer_enabled ? (
                                    <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                                        <CheckCircle2 size={18} />
                                        <p className="text-xs font-bold">Automation is active. Next run on {formatDate(plan.next_transfer_date)}.</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-orange-400">
                                        <AlertCircle size={18} />
                                        <p className="text-xs font-bold">Automation is paused. Funds will not be transferred automatically.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-8">
                    <Card className="rounded-[40px] border-none shadow-xl bg-white dark:bg-slate-900 p-8">
                        <h3 className="text-xl font-black font-rowdies mb-6 flex items-center gap-2">
                            <History size={20} className="text-primary" /> History
                        </h3>
                        <div className="space-y-6">
                            {plan.last_transfer_date ? (
                                <div className="flex gap-4">
                                    <div className="w-1 h-12 bg-emerald-500 rounded-full"></div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Auto-Transfer Successful</p>
                                        <p className="text-xs text-gray-500">{formatDate(plan.last_transfer_date)}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No automated transfers yet.</p>
                            )}
                            {plan.failed_transfer_count > 0 && (
                                <div className="flex gap-4">
                                    <div className="w-1 h-12 bg-red-500 rounded-full"></div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-red-600 font-rowdies">Failed Attempts</p>
                                        <p className="text-xs text-gray-500">{plan.failed_transfer_count} consecutive failures. Check wallet balance.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="rounded-[40px] border-none shadow-xl bg-primary text-white p-8 overflow-hidden relative">
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h3 className="text-lg font-black font-rowdies mb-4">Plan Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Initial Start</span>
                                <span className="font-bold">{formatDate(plan.start_date)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Early Penalty</span>
                                <span className="font-bold text-yellow-300">{plan.savings_plan?.early_withdrawal_penalty}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-white/70">Min Contribution</span>
                                <span className="font-bold">{formatCurrency(parseFloat(plan.savings_plan?.min_investment))}</span>
                            </div>
                        </div>
                        <Button className="w-full mt-8 bg-white text-primary hover:bg-white/90 rounded-2xl font-bold py-6">
                            Early Withdrawal
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PlanManagementPage;

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
        {children}
    </span>
);
