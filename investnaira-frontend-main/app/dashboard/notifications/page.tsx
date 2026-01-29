"use client";

import React, { useState } from 'react';
import { useNotifications } from '@/hook/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Filter, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const NotificationsPage = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread' && notification.is_read) return false;
        if (typeFilter !== 'all' && notification.notification_type !== typeFilter) return false;
        return true;
    });

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'TRANSACTION':
                return '💰';
            case 'SAVINGS':
                return '💵';
            case 'CAMPAIGN':
                return '📢';
            case 'ACHIEVEMENT':
                return '🎯';
            case 'SYSTEM':
                return '🔔';
            default:
                return '🔔';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'TRANSACTION':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'SAVINGS':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'CAMPAIGN':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'ACHIEVEMENT':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const handleNotificationClick = (notificationId: string, actionLink: string | null, isRead: boolean) => {
        if (!isRead) {
            markAsRead(notificationId);
        }

        if (actionLink) {
            window.location.href = actionLink;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white font-rowdies">
                        Notifications
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Stay updated with your financial activities
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        onClick={() => markAllAsRead()}
                        variant="outline"
                        className="gap-2"
                    >
                        <CheckCheck size={18} />
                        Mark all as read ({unreadCount})
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <span className="text-sm font-semibold">Filters:</span>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant={filter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === 'unread' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({unreadCount})
                        </Button>
                    </div>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="TRANSACTION">Transactions</SelectItem>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                            <SelectItem value="CAMPAIGN">Campaigns</SelectItem>
                            <SelectItem value="ACHIEVEMENT">Achievements</SelectItem>
                            <SelectItem value="SYSTEM">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <Card className="p-12 text-center">
                        <Bell size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No notifications
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {filter === 'unread'
                                ? "You're all caught up! No unread notifications."
                                : "You don't have any notifications yet."}
                        </p>
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            onClick={() => handleNotificationClick(
                                notification.id,
                                notification.action_link,
                                notification.is_read
                            )}
                            className={`p-5 cursor-pointer transition hover:shadow-md ${!notification.is_read
                                    ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                                    : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="text-4xl flex-shrink-0">
                                    {getNotificationIcon(notification.notification_type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">
                                            {notification.title}
                                        </h3>
                                        {!notification.is_read && (
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                        )}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                        {notification.message}
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <Badge className={`text-xs ${getTypeColor(notification.notification_type)}`}>
                                            {notification.notification_type}
                                        </Badge>
                                        <span className="text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination placeholder */}
            {filteredNotifications.length > 0 && (
                <div className="text-center text-sm text-gray-500 pt-4">
                    Showing {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
