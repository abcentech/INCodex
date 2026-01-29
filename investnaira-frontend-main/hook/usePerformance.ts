import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export interface PerformanceHistoryEntry {
    date: string;
    value: string;
}

export interface PerformanceStats {
    total_value: string;
    total_return: string;
    average_roi: string;
    performance_history: PerformanceHistoryEntry[];
}

export const usePerformance = () => {
    const { accessToken } = useAuths();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const { data: performanceStats, isLoading, error } = useQuery({
        queryKey: ['performance-analytics', accessToken],
        queryFn: async (): Promise<PerformanceStats> => {
            const { data } = await axios.get(`${API_URL}/campaigns/performance-analytics/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return data;
        },
        enabled: !!accessToken,
    });

    return {
        performanceStats,
        isLoading,
        error
    };
};
