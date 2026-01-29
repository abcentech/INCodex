import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuths } from './useAuths';

interface Task {
    id: number;
    title: string;
    description: string;
    action_link: string;
    is_completed: boolean;
    reward_text: string;
}

export const useUserTasks = () => {
    const { accessToken } = useAuths();
    const queryClient = useQueryClient();

    const fetchTasks = async (): Promise<Task[]> => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/tasks/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    };

    const completeTask = async (taskId: number) => {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/tasks/${taskId}/complete/`, {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    };

    const query = useQuery({
        queryKey: ['user-tasks', accessToken],
        queryFn: fetchTasks,
        enabled: !!accessToken,
        staleTime: 60 * 1000,
    });

    const mutation = useMutation({
        mutationFn: completeTask,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['user-tasks', accessToken] });
        },
    });

    return {
        tasks: query.data || [],
        loading: query.isLoading,
        error: query.error,
        completeTask: mutation.mutate,
        isCompleting: mutation.isPending // Updated for v5
    };
};
