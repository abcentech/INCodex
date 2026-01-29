"use client";

import React, { useState } from 'react';
import { Campaign, useCampaigns } from '@/hook/useCampaigns';
import { useWallet } from '@/hook/useWallet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2, Wallet as WalletIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CampaignInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    campaign: Campaign;
}

const CampaignInvestmentModal = ({ isOpen, onClose, campaign }: CampaignInvestmentModalProps) => {
    const [units, setUnits] = useState<number>(campaign.min_units);
    const [selectedPlanId, setSelectedPlanId] = useState<string>(campaign.savings_plans[0]?.id || '');
    const { wallet } = useWallet();
    const { invest, isInvesting, investSuccess, investError } = useCampaigns();

    const unitPrice = parseFloat(campaign.unit_price);
    const totalAmount = units * unitPrice;
    const balance = wallet?.balance ? parseFloat(wallet.balance) : 0;
    const isInsufficient = totalAmount > balance;

    const handleInvest = () => {
        if (!selectedPlanId) return;
        invest({
            campaignId: campaign.id,
            units,
            savingsPlanId: selectedPlanId
        });
    };

    const handleOnClose = () => {
        if (!isInvesting) {
            onClose();
        }
    };

    if (investSuccess) {
        return (
            <Dialog open={isOpen} onOpenChange={handleOnClose}>
                <DialogContent className="sm:max-w-[425px] text-center p-10">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                            <CheckCircle2 size={48} className="text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-black font-rowdies mb-2">Investment Successful!</DialogTitle>
                    <DialogDescription className="text-lg mb-6">
                        Congratulations! You've successfully invested <strong>{units} units</strong> in <strong>{campaign.title}</strong>.
                    </DialogDescription>
                    <Button onClick={onClose} className="w-full h-12 rounded-xl font-bold">
                        Back to Marketplace
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOnClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
                <div className="bg-primary/5 p-6 border-b border-primary/10">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black font-rowdies">Confirm Investment</DialogTitle>
                        <DialogDescription className="text-gray-500 font-medium">
                            {campaign.title} • {campaign.risk_level} Risk
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-6">
                    {/* Units Selector */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <Label htmlFor="units" className="text-sm font-bold text-gray-400 uppercase tracking-wider">Number of Units</Label>
                            <span className="text-xs font-bold text-primary">Min: {campaign.min_units} • Available: {campaign.total_units - campaign.current_units}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setUnits(Math.max(campaign.min_units, units - 1))}
                                className="h-12 w-12 rounded-xl border-gray-200 dark:border-slate-800"
                            >
                                -
                            </Button>
                            <Input
                                id="units"
                                type="number"
                                value={units}
                                onChange={(e) => setUnits(Math.max(campaign.min_units, parseInt(e.target.value) || 0))}
                                className="h-12 text-center text-xl font-black border-gray-200 dark:border-slate-800 rounded-xl bg-gray-50 dark:bg-slate-800/50"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setUnits(Math.min(campaign.total_units - campaign.current_units, units + 1))}
                                className="h-12 w-12 rounded-xl border-gray-200 dark:border-slate-800"
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* Savings Plan Selector */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Select Investment Strategy</Label>
                        <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                            <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-slate-800">
                                <SelectValue placeholder="Select a savings plan" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaign.savings_plans.map((plan) => (
                                    <SelectItem key={plan.id} value={plan.id}>
                                        {plan.tier} - {plan.contribution_frequency} ({plan.duration} days)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 space-y-3 border border-gray-100 dark:border-slate-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Unit Price</span>
                            <span className="font-bold">₦{unitPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Subtotal ({units} units)</span>
                            <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Transaction Fee</span>
                            <span className="font-bold text-green-500">₦0.00 (Free)</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <span className="font-black text-gray-900 dark:text-white">Total Amount</span>
                            <span className="font-black text-xl text-primary font-rowdies">₦{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Wallet Check */}
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${isInsufficient
                            ? 'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30 text-red-600'
                            : 'bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 text-blue-600'
                        }`}>
                        <WalletIcon size={20} />
                        <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70 leading-none mb-1">Your Wallet Balance</p>
                            <p className="font-black">₦{balance.toLocaleString()}</p>
                        </div>
                        {isInsufficient && (
                            <Badge variant="destructive" className="bg-red-500 text-white font-bold">Insufficient</Badge>
                        )}
                    </div>

                    {/* Error Message */}
                    {investError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                            <AlertCircle size={16} />
                            <p className="font-medium">{(investError as any)?.response?.data?.details || "Something went wrong. Please try again."}</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isInvesting}
                        className="h-14 flex-1 rounded-xl text-gray-500 font-bold hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleInvest}
                        disabled={isInvesting || isInsufficient || !selectedPlanId}
                        className="h-14 flex-[2] rounded-xl font-black text-lg shadow-xl shadow-primary/20"
                    >
                        {isInvesting ? (
                            <><Loader2 className="mr-2 animate-spin" /> Processing...</>
                        ) : (
                            'Confirm Investment'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CampaignInvestmentModal;
