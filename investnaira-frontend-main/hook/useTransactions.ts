import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export const useTransactions = () => {
    const { accessToken } = useAuths();

    const fetchTransactions = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/wallet/transactions/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['transactions', accessToken],
        queryFn: fetchTransactions,
        enabled: !!accessToken,
        staleTime: 60 * 1000,
    });

    return {
        transactions: data || [],
        loading: isLoading,
        error
    };
};
