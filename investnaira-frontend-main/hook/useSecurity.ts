import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

export interface LoginHistoryEntry {
    id: number;
    ip_address: string;
    device_info: string;
    location: string | null;
    timestamp: string;
    is_successful: boolean;
}

export interface SecuritySummary {
    is_2fa_enabled: boolean;
    last_login_ip: string | null;
    last_login_device: string | null;
    login_history: LoginHistoryEntry[];
}

export interface Setup2FAResponse {
    secret: string;
    otpauth_url: string;
}

export const useSecurity = () => {
    const { accessToken } = useAuths();
    const queryClient = useQueryClient();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const headers = { Authorization: `Bearer ${accessToken}` };

    const { data: summary, isLoading: isLoadingSummary } = useQuery({
        queryKey: ['security-summary', accessToken],
        queryFn: async (): Promise<SecuritySummary> => {
            const { data } = await axios.get(`${API_URL}/users/security/summary/`, { headers });
            return data;
        },
        enabled: !!accessToken,
    });

    const setup2FAMutation = useMutation({
        mutationFn: async (): Promise<Setup2FAResponse> => {
            const { data } = await axios.get(`${API_URL}/users/security/setup_2fa/`, { headers });
            return data;
        }
    });

    const enable2FAMutation = useMutation({
        mutationFn: async (token: string) => {
            const { data } = await axios.post(`${API_URL}/users/security/enable_2fa/`, { token }, { headers });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['security-summary'] });
        }
    });

    const disable2FAMutation = useMutation({
        mutationFn: async (token: string) => {
            const { data } = await axios.post(`${API_URL}/users/security/disable_2fa/`, { token }, { headers });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['security-summary'] });
        }
    });

    return {
        summary,
        isLoadingSummary,
        setup2FA: setup2FAMutation.mutateAsync,
        isSettingUp2FA: setup2FAMutation.isPending,
        enable2FA: enable2FAMutation.mutateAsync,
        isEnabling2FA: enable2FAMutation.isPending,
        disable2FA: disable2FAMutation.mutateAsync,
        isDisabling2FA: disable2FAMutation.isPending
    };
};
