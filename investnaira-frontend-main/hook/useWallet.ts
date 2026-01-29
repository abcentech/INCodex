import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export const useWallet = () => {
    const { accessToken } = useAuths();

    const fetchBalance = async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/wallet/balance/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['wallet-balance', accessToken],
        queryFn: fetchBalance,
        enabled: !!accessToken,
        staleTime: 60000, // 1 minute
    });

    return {
        balance: data?.balance || 0,
        currency: data?.currency || 'NGN',
        loading: isLoading,
        error: error ? (error as Error).message : null,
        refetch
    };
};
