import React, { Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    getUser, logout, getUnreadCount, getNotifications, markAsRead, markAllAsRead, sendNotification, getAllUsers,
    searchCustomers, searchLeads, searchDeals, searchTickets
} from '../services/api';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown, Check, Shield } from 'lucide-react';
import { Menu as HeadlessMenu, Transition, Popover, Dialog } from '@headlessui/react';

export default function TopBar({ toggleSidebar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();
    const [unreadCount, setUnreadCount] = React.useState(0);
    const [notifications, setNotifications] = React.useState([]);
    const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false);
    const [requestMessage, setRequestMessage] = React.useState('');

    // Search State
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState({
        customers: [],
        leads: [],
        deals: [],
        tickets: []
    });
    const [isSearching, setIsSearching] = React.useState(false);

    // Debounce Search
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setIsSearching(true);
                try {
                    const [customers, leads, deals, tickets] = await Promise.all([
                        searchCustomers(searchQuery).catch(() => []),
                        searchLeads(searchQuery).catch(() => []),
                        searchDeals(searchQuery).catch(() => []),
                        searchTickets(searchQuery).catch(() => [])
                    ]);

                    setSearchResults({
                        customers: customers.map(c => ({
                            id: c.id,
                            title: `${c.firstName} ${c.lastName}`,
                            subtitle: c.email || c.company,
                            type: 'Customer',
                            link: `/dashboard/customers?viewId=${c.id}`
                        })),
                        leads: leads.map(l => ({
                            id: l.id,
                            title: `${l.firstName} ${l.lastName}`,
                            subtitle: l.company || l.email,
                            type: 'Lead',
                            link: `/dashboard/leads?viewId=${l.id}`
                        })),
                        deals: deals.map(d => ({
                            id: d.id,
                            title: d.title,
                            subtitle: `$${d.value?.toLocaleString()} • ${d.stage}`,
                            type: 'Deal',
                            link: `/dashboard/deals` // Todo: Add viewId support to DealsPage
                        })),
                        tickets: tickets.map(t => ({
                            id: t.id,
                            title: `Ticket #${t.id}: ${t.subject}`,
                            subtitle: t.status,
                            type: 'Ticket',
                            link: `/dashboard/tickets` // Todo: Add viewId support to TicketsPage
                        }))
                    });
                } catch (error) {
                    console.error("Search failed", error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults({ customers: [], leads: [], deals: [], tickets: [] });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleRequestAccess = async () => {
        if (!requestMessage.trim()) return;

        try {
            // Find Admin ID dynamically
            const users = await getAllUsers(user.companyId);
            const admin = users.find(u => u.roles && u.roles.includes('ROLE_ADMIN'));

            if (!admin) {
                console.error("No admin found to send request to.");
                alert("Failed to find an admin to send the request to.");
                return;
            }

            console.log("Sending request to Admin:", admin.username, "(ID:", admin.id, ")");

            await sendNotification({
                recipientUserId: admin.id,
                type: 'IN_APP',
                title: `Access Request from ${user.username}`,
                message: requestMessage,
                source: 'USER_DASHBOARD',
                status: 'SENT'
            });

            // Close modal and reset message
            setIsRequestModalOpen(false);
            setRequestMessage('');
            alert('Request sent to admin successfully!');
        } catch (error) {
            console.error("Failed to send request", error);
            alert('Failed to send request. Please try again.');
        }
    };


    React.useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            // Poll for notifications every 5 seconds
            const interval = setInterval(fetchNotifications, 5000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    const fetchNotifications = async () => {
        try {
            const countData = await getUnreadCount(user.id);
            setUnreadCount(countData.unreadCount);
            if (countData.unreadCount > 0) {
                const notifs = await getNotifications(user.id);
                setNotifications(notifs.slice(0, 5)); // Show recent 5
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleMarkRead = async (id) => {
        await markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        await markAllAsRead(user.id);
        fetchNotifications();
    };

    const handleNotificationClick = async (notif) => {
        // 1. Mark as read
        if (!notif.readAt) {
            await handleMarkRead(notif.id);
        }

        // 2. Navigate based on reference
        if (notif.referenceType === 'LEAD' && notif.referenceId) {
            navigate(`/dashboard/leads?viewId=${notif.referenceId}`);
        } else if (notif.referenceType === 'CUSTOMER' && notif.referenceId) {
            navigate(`/dashboard/customers?viewId=${notif.referenceId}`);
        }

        // Close popover (React headless ui closes on click usually, but if not we might need ref)
    };

    const getBreadcrumbs = () => {
        const path = location.pathname.split('/').filter(Boolean);
        return path.map((part, index) => {
            const isLast = index === path.length - 1;
            return (
                <span key={index} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    <span className={`text-sm ${isLast ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 capitalize'}`}>
                        {part.replace(/-/g, ' ')}
                    </span>
                </span>
            );
        });
    };

    return (
        <header className="h-16 bg-white/80 dark:bg-card/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left: Mobile Menu & Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Menu size={20} />
                </button>
                <div className="hidden md:flex items-center">
                    {/* Breadcrumbs removed as per user request */}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search (Visual only for now) */}
                {/* Search */}
                <div className="hidden md:flex relative group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search leads, customers, deals..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all focus:w-80"
                    />

                    {/* Search Results Dropdown */}
                    {(searchQuery.length > 1 && (isSearching || Object.keys(searchResults).some(k => searchResults[k].length > 0))) && (
                        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 max-h-[80vh] overflow-y-auto z-50">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                            ) : (
                                <>
                                    {Object.entries(searchResults).map(([category, items]) => (
                                        items.length > 0 && (
                                            <div key={category} className="py-2">
                                                <h3 className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/95 dark:bg-card/95 backdrop-blur-sm">
                                                    {category} ({items.length})
                                                </h3>
                                                {items.map(item => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            navigate(item.link);
                                                            setSearchQuery('');
                                                            setSearchResults({ customers: [], leads: [], deals: [], tickets: [] });
                                                        }}
                                                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between group/item"
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {item.subtitle}
                                                            </p>
                                                        </div>
                                                        <span className="text-xs text-gray-400 group-hover/item:text-primary opacity-0 group-hover/item:opacity-100 transition-all">
                                                            Jump to
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    ))}
                                    {Object.values(searchResults).every(arr => arr.length === 0) && (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No results found for "{searchQuery}"
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <Popover className="relative">
                    <Popover.Button className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors outline-none">
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-card"></span>
                        )}
                    </Popover.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 mt-2 w-80 bg-white dark:bg-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50">
                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <span className="font-semibold text-sm">Notifications</span>
                                <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                                    Mark all read
                                </button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                                ) : (
                                    notifications.map(notif => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer ${notif.readAt ? 'opacity-60' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-sm text-gray-900 dark:text-white">{notif.title}</span>
                                                {!notif.readAt && (
                                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                                            <span className="text-[10px] text-gray-400 mt-2 block">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => { navigate('/dashboard/notifications'); }}
                                    className="w-full py-2 text-xs text-center text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors"
                                >
                                    View All Notifications
                                </button>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </Popover>

                {/* Profile Dropdown */}
                <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center gap-2 p-1 pl-2 pr-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors outline-none border border-gray-200 dark:border-gray-700">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                            {user?.username}
                        </span>
                        <ChevronDown size={14} className="text-gray-400" />
                    </HeadlessMenu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-card rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50 focus:outline-none">
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                        {user?.roles?.[0]?.replace('ROLE_', '')}
                                    </span>
                                </div>
                            </div>

                            <div className="py-1">
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button className={`${active ? 'bg-gray-50 dark:bg-gray-800' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}>
                                            <User size={16} className="mr-3 text-gray-400 group-hover:text-primary" />
                                            Profile
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button className={`${active ? 'bg-gray-50 dark:bg-gray-800' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}>
                                            <Settings size={16} className="mr-3 text-gray-400 group-hover:text-primary" />
                                            Settings
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => setIsRequestModalOpen(true)}
                                            className={`${active ? 'bg-gray-50 dark:bg-gray-800' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                                        >
                                            <Shield size={16} className="mr-3 text-gray-400 group-hover:text-primary" />
                                            Request Access
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                            </div>

                            <div className="py-1 border-t border-gray-100 dark:border-gray-800">
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => { logout(); navigate('/login'); }}
                                            className={`${active ? 'bg-red-50 dark:bg-red-900/10' : ''} group flex w-full items-center px-4 py-2 text-sm text-red-600`}
                                        >
                                            <LogOut size={16} className="mr-3 text-red-500" />
                                            Sign out
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                            </div>
                        </HeadlessMenu.Items>
                    </Transition>
                </HeadlessMenu>
            </div>
            {/* Request Access Modal */}
            <Transition appear show={isRequestModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsRequestModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-card p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-800">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center gap-2"
                                    >
                                        <Shield className="text-primary" size={24} />
                                        Request Admin Access
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Describe what permissions or access you need. An admin will review your request.
                                        </p>
                                        <textarea
                                            className="mt-4 w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-primary dark:text-white p-3"
                                            rows="4"
                                            placeholder="I need access to delete customers because..."
                                            value={requestMessage}
                                            onChange={(e) => setRequestMessage(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-transparent bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                                            onClick={() => setIsRequestModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-xl border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={handleRequestAccess}
                                            disabled={!requestMessage.trim()}
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </header>
    );
}
