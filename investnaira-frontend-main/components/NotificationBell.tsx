"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hook/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    // Get only the 5 most recent notifications for the dropdown
    const recentNotifications = notifications.slice(0, 5);

    const handleNotificationClick = (notificationId: string, actionLink: string | null) => {
        markAsRead(notificationId);
        setIsOpen(false);

        if (actionLink) {
            window.location.href = actionLink;
        }
    };

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
            default:
                return '🔔';
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
            >
                <Bell size={24} className="text-gray-700 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Content */}
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAllAsRead()}
                                    className="text-xs"
                                >
                                    Mark all read
                                </Button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {recentNotifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Bell size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                recentNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification.id, notification.action_link)}
                                        className={`p-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition ${!notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="text-2xl flex-shrink-0">
                                                {getNotificationIcon(notification.notification_type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-semibold text-sm text-gray-900 dark:text-white">
                                                        {notification.title}
                                                    </p>
                                                    {!notification.is_read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {recentNotifications.length > 0 && (
                            <div className="p-3 border-t border-gray-200 dark:border-slate-700">
                                <Link
                                    href="/dashboard/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center text-sm font-semibold text-primary hover:text-primary/80 transition"
                                >
                                    View all notifications
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
