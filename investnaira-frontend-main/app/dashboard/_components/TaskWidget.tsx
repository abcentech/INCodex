import React, { useEffect, useState } from 'react';
import { useUserTasks } from '../../../hook/useUserTasks';
import { Check, Trophy, ArrowRight, Loader } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Task {
    id: number;
    title: string;
    description: string;
    action_link: string;
    is_completed: boolean;
    reward_text: string;
}

interface TaskWidgetProps {
    onOpenMap: () => void;
    isDemo?: boolean;
}

const mockTasks: Task[] = [
    {
        id: 1,
        title: "Map Your Freedom",
        description: "Use the Wealth Map generator.",
        action_link: "OPEN_WEALTH_MAP",
        is_completed: false,
        reward_text: "100 Wealth Points"
    },
    {
        id: 2,
        title: "Meet NairaAI",
        description: "Ask your AI assistant a question.",
        action_link: "OPEN_CHAT",
        is_completed: false,
        reward_text: "50 Wealth Points"
    },
    {
        id: 3,
        title: "Start Your Streak",
        description: "View the Habit Tracker sidebar.",
        action_link: "SCROLL_TO_SIDEBAR",
        is_completed: false,
        reward_text: "Badge: Consistency Rookie"
    }
];

const TaskWidget = ({ onOpenMap, isDemo = false }: TaskWidgetProps) => {
    // Hooks
    const { tasks: realTasks, loading: tasksLoading, completeTask } = useUserTasks();
    const [localTasks, setLocalTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (isDemo) {
            setLocalTasks(mockTasks);
        } else {
            setLocalTasks(realTasks);
        }
    }, [isDemo, realTasks]);

    const handleAction = async (task: Task) => {
        if (task.is_completed) return;

        // Execute Action
        if (task.action_link === 'OPEN_WEALTH_MAP') {
            onOpenMap();
        } else if (task.action_link === 'SCROLL_TO_SIDEBAR') {
            document.getElementById('tour-streaks')?.scrollIntoView({ behavior: 'smooth' });
        } else if (task.action_link === 'OPEN_CHAT') {
            document.getElementById('naira-ai-trigger')?.click();
        }

        // Optimistic update for demo
        if (isDemo) {
            setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: true } : t));
            return;
        }

        // Mark as complete via API using Mutation
        try {
            completeTask(task.id);
            // Optimistic update for UI responsiveness (optional, as query invalidation handles it)
            setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: true } : t));
        } catch (e) {
            console.error(e);
        }
    };

    if (tasksLoading && !isDemo) return null;

    // Fallback to mock tasks if empty (ensures visibility)
    const displayTasks = localTasks.length > 0 ? localTasks : mockTasks;

    const completedCount = displayTasks.filter(t => t.is_completed).length;
    const progress = (completedCount / displayTasks.length) * 100;

    return (
        <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-500/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="font-bold text-lg font-rowdies">Your Next Moves</h3>
                    <p className="text-indigo-200 text-xs">Complete tasks to unlock badges.</p>
                </div>
                <Badge variant="outline" className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border-none text-white">
                    <Trophy size={14} className="text-yellow-400" />
                    <span className="text-xs font-bold">{completedCount}/{displayTasks.length}</span>
                </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 relative z-10">
                <Progress value={progress} className="h-1.5 bg-white/10" />
            </div>

            <div className="space-y-3 relative z-10">
                {displayTasks.filter(t => !t.is_completed).slice(0, 3).map(task => (
                    <div key={task.id}
                        onClick={() => handleAction(task)}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl cursor-pointer transition group">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-300 group-hover:bg-green-500 group-hover:text-white transition`}>
                                <Check size={14} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{task.title}</h4>
                                <p className="text-[10px] text-indigo-200">{task.reward_text}</p>
                            </div>
                        </div>
                        <ArrowRight size={16} className="text-white/30 group-hover:text-white transition" />
                    </div>
                ))}
                {displayTasks.filter(t => !t.is_completed).length === 0 && (
                    <div className="text-center py-4 bg-white/5 rounded-xl">
                        <p className="font-bold text-green-400 text-sm">All caught up! 🎉</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default TaskWidget;
