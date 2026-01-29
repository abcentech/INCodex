import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export const useAnalytics = () => {
    const { accessToken } = useAuths();

    const fetchAnalytics = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/wallet/analytics/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['analytics', accessToken],
        queryFn: fetchAnalytics,
        enabled: !!accessToken,
        staleTime: 60 * 1000,
    });

    return {
        analytics: data || { allocation: {}, chart_data: [] },
        loading: isLoading,
        error
    };
};
