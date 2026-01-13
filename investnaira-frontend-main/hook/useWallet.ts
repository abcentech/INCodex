import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuths } from './useAuths';

export const useWallet = () => {
    const { accessToken } = useAuths();
    const [balance, setBalance] = useState<number>(0);
    const [currency, setCurrency] = useState<string>('NGN');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = async () => {
        if (!accessToken) return;
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wallet/balance/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setBalance(response.data.balance);
            setCurrency(response.data.currency);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch balance');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [accessToken]);

    return { balance, currency, loading, error, refetch: fetchBalance };
};
