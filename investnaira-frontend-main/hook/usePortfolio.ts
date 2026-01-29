import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export interface PortfolioAllocation {
    total_assets: string;
    cash: string;
    savings: string;
    campaigns: string;
    percentages: {
        cash: string;
        savings: string;
        campaigns: string;
    };
}

export interface Recommendation {
    type: 'BUY' | 'SELL';
    category: 'CAMPAIGNS' | 'SAVINGS' | 'CASH';
    message: string;
    amount: string;
}

export interface PortfolioStats {
    risk_profile: string;
    current_allocation: PortfolioAllocation;
    target_allocation: {
        SAVINGS: string;
        CAMPAIGNS: string;
    };
    recommendations: Recommendation[];
}

export const usePortfolio = () => {
    const { accessToken } = useAuths();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const { data: portfolioStats, isLoading, error, refetch } = useQuery({
        queryKey: ['portfolio-rebalancing', accessToken],
        queryFn: async (): Promise<PortfolioStats> => {
            const { data } = await axios.get(`${API_URL}/campaigns/portfolio-rebalancing/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return data;
        },
        enabled: !!accessToken,
    });

    return {
        portfolioStats,
        isLoading,
        error,
        refetch
    };
};
