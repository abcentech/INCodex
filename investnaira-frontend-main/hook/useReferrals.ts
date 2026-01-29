import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export interface ReferralStats {
    referral_code: string;
    total_referrals: number;
    total_earnings: string;
    referrals: {
        id: string;
        referred_user_name: string;
        status: 'PENDING' | 'COMPLETED' | 'REWARDED';
        reward_amount: string;
        created_at: string;
        completed_at: string | null;
    }[];
}

export const useReferrals = () => {
    const { accessToken } = useAuths();
    const queryClient = useQueryClient();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Fetch referral stats and list
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['referral-stats', accessToken],
        queryFn: async (): Promise<ReferralStats> => {
            const { data } = await axios.get(`${API_URL}/referrals/stats/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return data;
        },
        enabled: !!accessToken,
    });

    // Apply referral code
    const applyCodeMutation = useMutation({
        mutationFn: async (code: string) => {
            const { data } = await axios.post(
                `${API_URL}/referrals/apply-code/`,
                { referral_code: code },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['referral-stats'] });
        },
    });

    return {
        stats,
        isLoading,
        error,
        applyCode: applyCodeMutation.mutate,
        isApplying: applyCodeMutation.isPending,
        applyError: applyCodeMutation.error,
        applySuccess: applyCodeMutation.isSuccess,
    };
};
