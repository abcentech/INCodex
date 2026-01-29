import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export interface SavingsPlan {
    id: string;
    tier: string;
    contribution_frequency: string;
    duration: number;
    early_withdrawal_penalty: string;
    min_investment: string;
}

export interface Campaign {
    id: string;
    title: string;
    business?: string;
    business_name?: string;
    description: string;
    start_date: string;
    end_date: string;
    risk_level: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESIVE';
    unit_price: string;
    min_units: number;
    total_units: number;
    current_units: number;
    savings_plans: SavingsPlan[];
    images: { image: string }[];
}

export const useCampaigns = () => {
    const { accessToken } = useAuths();
    const queryClient = useQueryClient();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Fetch all active campaigns
    const { data: campaigns = [], isLoading, error } = useQuery({
        queryKey: ['campaigns', accessToken],
        queryFn: async (): Promise<Campaign[]> => {
            const { data } = await axios.get(`${API_URL}/campaigns/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return data;
        },
        enabled: !!accessToken,
    });

    // Fetch single campaign detail
    const getCampaign = (id: string) => {
        return useQuery({
            queryKey: ['campaign', id, accessToken],
            queryFn: async (): Promise<Campaign> => {
                const { data } = await axios.get(`${API_URL}/campaigns/${id}/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                return data;
            },
            enabled: !!accessToken && !!id,
        });
    };

    // Invest in a campaign
    const investMutation = useMutation({
        mutationFn: async ({ campaignId, units, savingsPlanId }: { campaignId: string, units: number, savingsPlanId: string }) => {
            const { data } = await axios.post(
                `${API_URL}/campaigns/${campaignId}/invest/`,
                { units, savings_plan_id: savingsPlanId },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['user-savings-plans'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return {
        campaigns,
        isLoading,
        error,
        getCampaign,
        invest: investMutation.mutate,
        isInvesting: investMutation.isPending,
        investError: investMutation.error,
        investSuccess: investMutation.isSuccess,
    };
};
