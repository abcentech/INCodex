"use client";
import { useState } from "react";
import axios from "axios";
import { useAuths } from "./useAuths";
import { toast } from "react-toastify";

export const useSavings = () => {
    const { accessToken } = useAuths();
    const [loading, setLoading] = useState(false);

    const toggleAutoTransfer = async (planId: string, enabled: boolean) => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/campaigns/savings-plans/${planId}/toggle-auto-transfer/`,
                { auto_transfer_enabled: enabled },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success(res.data.details);
            return res.data;
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.details || "Failed to toggle auto-transfer");
        } finally {
            setLoading(false);
        }
    };

    const updateTransferAmount = async (planId: string, amount: number) => {
        if (!accessToken) return;
        setLoading(true);
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/campaigns/savings-plans/${planId}/transfer-amount/`,
                { transfer_amount: amount },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            toast.success(res.data.details);
            return res.data;
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.details || "Failed to update transfer amount");
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        toggleAutoTransfer,
        updateTransferAmount
    };
};
