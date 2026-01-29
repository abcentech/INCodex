import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

interface Notification {
    id: string;
    user: string;
    title: string;
    message: string;
    notification_type: 'TRANSACTION' | 'SAVINGS' | 'CAMPAIGN' | 'SYSTEM' | 'ACHIEVEMENT';
    is_read: boolean;
    action_link: string | null;
    created_at: string;
}

export const useNotifications = () => {
    const { accessToken } = useAuths();
    const queryClient = useQueryClient();
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Fetch all notifications
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', accessToken],
        queryFn: async (): Promise<Notification[]> => {
            const { data } = await axios.get(`${API_URL}/notifications/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return data;
        },
        enabled: !!accessToken,
        staleTime: 30000, // 30 seconds
    });

    // Fetch unread count
    const { data: unreadCountData } = useQuery({
        queryKey: ['notifications-unread-count', accessToken],
        queryFn: async () => {
            const { data } = await axios.get(`${API_URL}/notifications/unread-count/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return data;
        },
        enabled: !!accessToken,
        refetchInterval: 30000, // Poll every 30 seconds
    });

    const unreadCount = unreadCountData?.unread_count || 0;

    // Mark single notification as read
    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            await axios.post(
                `${API_URL}/notifications/${notificationId}/mark-read/`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', accessToken] });
            queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', accessToken] });
        },
    });

    // Mark all notifications as read
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            await axios.post(
                `${API_URL}/notifications/mark-all-read/`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', accessToken] });
            queryClient.invalidateQueries({ queryKey: ['notifications-unread-count', accessToken] });
        },
    });

    return {
        notifications,
        unreadCount,
        isLoading,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        isMarkingAsRead: markAsReadMutation.isPending,
    };
};
