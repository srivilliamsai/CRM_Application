import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getNotifications, markAsRead, markAllAsRead } from '../../services/api';
import { Bell, Check, Filter } from 'lucide-react';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD
    const navigate = useNavigate();
    const user = getUser();

    useEffect(() => {
        fetchNotifications();
    }, [user?.id]);

    const fetchNotifications = async () => {
        if (user?.id) {
            try {
                const data = await getNotifications(user.id);
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            }
        }
    };

    const handleMarkRead = async (id, e) => {
        e.stopPropagation();
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead(user.id);
        fetchNotifications();
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.readAt) {
            await markAsRead(notif.id);
        }

        if (notif.referenceType === 'LEAD' && notif.referenceId) {
            navigate(`/dashboard/leads?viewId=${notif.referenceId}`);
        } else if (notif.referenceType === 'CUSTOMER' && notif.referenceId) {
            navigate(`/dashboard/customers?viewId=${notif.referenceId}`);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'UNREAD') return !n.readAt;
        return true;
    });

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell className="text-primary" /> Notifications
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Stay updated with your activities</p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="ALL">All Notifications</option>
                        <option value="UNREAD">Unread Only</option>
                    </select>
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 bg-white dark:bg-card border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Check size={16} /> Mark all read
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {filteredNotifications.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                        <p>No notifications found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredNotifications.map(notif => (
                            <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex gap-4 ${notif.readAt ? 'opacity-75' : 'bg-blue-50/10'}`}
                            >
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.readAt ? 'bg-gray-300' : 'bg-primary'}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-medium text-gray-900 dark:text-white mb-1 ${!notif.readAt && 'font-semibold'}`}>
                                            {notif.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{notif.message}</p>
                                </div>
                                {!notif.readAt && (
                                    <button
                                        onClick={(e) => handleMarkRead(notif.id, e)}
                                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors self-center"
                                        title="Mark as read"
                                    >
                                        <Check size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
