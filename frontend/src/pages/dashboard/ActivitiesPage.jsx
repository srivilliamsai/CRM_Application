import { useState, useEffect } from 'react';
import { getAllActivities, getAllUsers, createActivity, getAllCustomers, getAllLeads, getUser } from '../../services/api';
import { Phone, Mail, Calendar, User, Search, Play, BarChart2, List, Plus, Clock, FileText, CheckSquare, Mic, Activity, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & View State
    const [filterType, setFilterType] = useState('ALL'); // ALL, CALL, EMAIL, MEETING, NOTE, TASK
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState('ALL'); // ALL, TODAY, WEEK, MONTH

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesData, usersData, customersData, leadsData] = await Promise.all([
                    getAllActivities(),
                    getAllUsers(),
                    getAllCustomers(),
                    getAllLeads()
                ]);
                // Sort activities by date (newest first)
                const sortedActivities = activitiesData.sort((a, b) =>
                    new Date(b.startTime || b.createdAt) - new Date(a.startTime || a.createdAt)
                );
                setActivities(sortedActivities);
                setUsers(usersData);
                setCustomers(customersData);
                setLeads(leadsData);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredActivities = activities.filter(activity => {
        const matchesType = filterType === 'ALL' || activity.type === filterType;
        const matchesSearch = (activity.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            getOwnerName(activity.performedBy).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getRelatedName(activity).toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDate = true;
        const activityDate = new Date(activity.startTime || activity.createdAt);
        const today = new Date();

        if (dateRange === 'TODAY') {
            matchesDate = activityDate.toDateString() === today.toDateString();
        } else if (dateRange === 'WEEK') {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            matchesDate = activityDate >= weekAgo;
        } else if (dateRange === 'MONTH') {
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            matchesDate = activityDate >= monthAgo;
        }

        return matchesType && matchesSearch && matchesDate;
    });

    const formatDuration = (seconds) => {
        if (!seconds) return '—';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getOwnerName = (id) => {
        const user = users.find(u => u.id === id);
        return user ? user.fullName || user.username : 'Unknown User';
    };

    const getRelatedName = (activity) => {
        if (activity.customerId) {
            const customer = customers.find(c => c.id === activity.customerId);
            return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Customer';
        }
        if (activity.leadId) {
            const lead = leads.find(l => l.id === activity.leadId);
            return lead ? lead.name : 'Unknown Lead';
        }
        return '—';
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'CALL': return <Phone size={18} className="text-blue-500" />;
            case 'EMAIL': return <Mail size={18} className="text-green-500" />;
            case 'MEETING': return <Calendar size={18} className="text-purple-500" />;
            case 'NOTE': return <FileText size={18} className="text-yellow-500" />;
            case 'TASK': return <CheckSquare size={18} className="text-orange-500" />;
            default: return <Activity size={18} className="text-gray-500" />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'CALL': return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
            case 'EMAIL': return 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300';
            case 'MEETING': return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
            case 'NOTE': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'TASK': return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
            default: return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Metrics
    const calculateMetrics = () => {
        const calls = activities.filter(a => a.type === 'CALL');
        const emails = activities.filter(a => a.type === 'EMAIL');
        const meetings = activities.filter(a => a.type === 'MEETING');

        return {
            totalCalls: calls.length,
            totalEmails: emails.length,
            totalMeetings: meetings.length,
            avgCallDuration: calls.length ? Math.round(calls.reduce((acc, c) => acc + (c.duration || 0), 0) / calls.length) : 0,
            outboundCalls: calls.filter(c => c.direction === 'OUTBOUND').length,
            inboundCalls: calls.filter(c => c.direction === 'INBOUND').length,
        };
    };

    const metrics = calculateMetrics();

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newActivity, setNewActivity] = useState({
        type: 'CALL',
        description: '',
        outcome: 'ANSWERED',
        direction: 'OUTBOUND',
        duration: 0,
        startTime: '', // ISO string
        performedBy: '', // Will default to current user
        relatedTo: 'NONE',
        relatedId: '',
        phoneNumber: '',
        recordingUrl: ''
    });

    const handleCreateModalOpen = () => {
        const currentUser = getUser();
        // Fallback to first user in list if getUser returns null, though it shouldn't for a logged in user
        const currentUserId = currentUser ? currentUser.id : (users.length > 0 ? users[0].id : '');

        setNewActivity({
            type: 'CALL',
            description: '',
            outcome: 'ANSWERED',
            direction: 'OUTBOUND',
            duration: 0,
            startTime: new Date().toISOString().slice(0, 16), // datetime-local format
            performedBy: currentUserId,
            relatedTo: 'NONE',
            relatedId: '',
            phoneNumber: '',
            recordingUrl: ''
        });
        setShowModal(true);
    };

    const handleCreateActivity = async (e) => {
        e.preventDefault();
        try {
            // Reformat startTime to ISO
            const formattedStartTime = newActivity.startTime ? new Date(newActivity.startTime).toISOString() : new Date().toISOString();

            await createActivity({
                ...newActivity,
                startTime: formattedStartTime,
                customerId: newActivity.relatedTo === 'CUSTOMER' ? parseInt(newActivity.relatedId) : null,
                leadId: newActivity.relatedTo === 'LEAD' ? parseInt(newActivity.relatedId) : null,
                duration: parseInt(newActivity.duration) || 0
            });
            setShowModal(false);
            const [activitiesData] = await Promise.all([getAllActivities()]);
            // Re-sort
            const sorted = activitiesData.sort((a, b) => new Date(b.startTime || b.createdAt) - new Date(a.startTime || a.createdAt));
            setActivities(sorted);
        } catch (error) {
            console.error("Failed to create activity", error);
            alert("Failed to create activity. Please check constraints.");
        }
    };

    const getDailyActivityVolume = () => {
        const volume = {};
        activities.forEach(a => {
            const date = new Date(a.startTime || a.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
            volume[date] = (volume[date] || 0) + 1;
        });

        // Last 7 days
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            days.push({ name: dayName, count: volume[dayName] || 0 });
        }
        return days;
    };

    const getCurrentUserName = () => {
        const currentUser = getUser();
        if (currentUser && currentUser.fullName) return currentUser.fullName;
        if (currentUser && currentUser.username) return currentUser.username;
        return getOwnerName(newActivity.performedBy);
    };

    const getRoleLabel = (roles) => {
        if (!roles || roles.length === 0) return '';
        // Prioritize roles
        if (roles.includes('ROLE_ADMIN')) return 'Admin';
        if (roles.includes('ROLE_SALES')) return 'Sales';
        if (roles.includes('ROLE_MARKETING')) return 'Marketing';
        if (roles.includes('ROLE_SUPPORT')) return 'Support';
        return 'User';
    };

    const getOwnerRole = (id) => {
        const user = users.find(u => u.id === id);
        return user ? getRoleLabel(user.roles) : '';
    };

    const getCurrentUserRole = () => {
        const currentUser = getUser();
        return currentUser ? getRoleLabel(currentUser.roles) : '';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ... Header & Metrics ... */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Activities</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track interaction history across your team.</p>
                </div>
                <button onClick={handleCreateModalOpen} className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    <Plus size={20} />
                    Log Activity
                </button>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard
                    label="Total Calls"
                    value={metrics.totalCalls}
                    icon={Phone}
                    color="blue"
                    trend={metrics.inboundCalls > 0 ? `+${metrics.inboundCalls} inbound` : ''}
                />
                <MetricCard label="Total Emails" value={metrics.totalEmails} icon={Mail} color="green" />
                <MetricCard label="Meetings" value={metrics.totalMeetings} icon={Calendar} color="purple" />
                <MetricCard label="Avg Call Duration" value={formatDuration(metrics.avgCallDuration)} icon={Clock} color="orange" />
            </div>

            {/* Charts & Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Trends */}
                <div className="lg:col-span-2 bg-white dark:bg-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart2 size={20} className="text-primary" />
                        Activity Trends
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getDailyActivityVolume()}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'rgba(255, 255, 255, 0.9)' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Stats Widget */}
                <div className="lg:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity size={100} />
                    </div>
                    <h3 className="text-lg font-bold mb-1">Weekly Summary</h3>
                    <p className="text-indigo-100 text-sm mb-6">You're doing great! Keep it up.</p>

                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-indigo-100 text-sm">Calls Made</span>
                            <span className="font-bold text-xl">{metrics.outboundCalls}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/20 pb-2">
                            <span className="text-indigo-100 text-sm">Calls Received</span>
                            <span className="font-bold text-xl">{metrics.inboundCalls}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-indigo-100 text-sm">Total Duration</span>
                            <span className="font-bold text-xl">{formatDuration(metrics.avgCallDuration * metrics.totalCalls)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="sticky top-0 z-10 glass-card p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    {['ALL', 'CALL', 'EMAIL', 'MEETING', 'NOTE', 'TASK'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filterType === type
                                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        />
                    </div>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
                    >
                        <option value="ALL">All Time</option>
                        <option value="TODAY">Today</option>
                        <option value="WEEK">This Week</option>
                        <option value="MONTH">This Month</option>
                    </select>
                </div>
            </div>

            {/* Content Area - Main List */}
            <div className="space-y-4">
                {/* Main List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                    ) : filteredActivities.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No activities found</h3>
                            <p className="text-gray-500">Try adjusting your filters or log a new activity.</p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-card rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredActivities.map((activity) => (
                                    <div key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`p-3 rounded-xl shrink-0 ${getActivityColor(activity.type)}`}>
                                                {getActivityIcon(activity.type)}
                                            </div>

                                            {/* Main Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                            {activity.type}
                                                            <span className="text-gray-400 font-normal">•</span>
                                                            <span className="font-normal text-gray-600 dark:text-gray-300">{getRelatedName(activity)}</span>
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-0.5 max-w-lg break-words">{activity.description}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {new Date(activity.startTime || activity.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap items-center gap-3 mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                                        <User size={12} />
                                                        {getOwnerName(activity.performedBy)}
                                                        {getOwnerRole(activity.performedBy) && (
                                                            <span className="text-xs text-gray-400 bg-gray-200 dark:bg-gray-700/50 px-1.5 py-0.5 rounded-md">
                                                                {getOwnerRole(activity.performedBy)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {activity.duration > 0 && (
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                                            <Clock size={12} />
                                                            {formatDuration(activity.duration)}
                                                        </div>
                                                    )}

                                                    {activity.outcome && (
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${activity.outcome === 'ANSWERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                            activity.outcome === 'MISSED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                            }`}>
                                                            {activity.outcome}
                                                        </span>
                                                    )}

                                                    {activity.recordingUrl && (
                                                        <a href={activity.recordingUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                                            <Play size={12} /> Recording
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets Removed - Moved to Top */}
            </div>

            {/* Create Activity Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus className="text-primary" size={24} />
                                Log New Activity
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateActivity} className="p-6 space-y-5">
                            {/* Performed By Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Performed By</label>
                                <div className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
                                    <User size={16} />
                                    <span>{getCurrentUserName()}</span>
                                    {getCurrentUserRole() && (
                                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                            {getCurrentUserRole()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                                    <select
                                        value={newActivity.type}
                                        onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                    >
                                        <option value="CALL">Call</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="MEETING">Meeting</option>
                                        <option value="NOTE">Note</option>
                                        <option value="TASK">Task</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        value={newActivity.startTime}
                                        onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Related To</label>
                                    <select
                                        value={newActivity.relatedTo}
                                        onChange={(e) => setNewActivity({ ...newActivity, relatedTo: e.target.value, relatedId: '' })}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                                    >
                                        <option value="NONE">None</option>
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="LEAD">Lead</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                        Select {newActivity.relatedTo === 'NONE' ? 'Ref' : newActivity.relatedTo.charAt(0) + newActivity.relatedTo.slice(1).toLowerCase()}
                                    </label>
                                    <select
                                        value={newActivity.relatedId}
                                        onChange={(e) => {
                                            const selectedId = e.target.value;
                                            let phoneNumber = newActivity.phoneNumber;

                                            if (newActivity.relatedTo === 'CUSTOMER') {
                                                const customer = customers.find(c => c.id === parseInt(selectedId));
                                                if (customer && customer.phone) {
                                                    phoneNumber = customer.phone;
                                                }
                                            } else if (newActivity.relatedTo === 'LEAD') {
                                                const lead = leads.find(l => l.id === parseInt(selectedId));
                                                if (lead && lead.phoneNumber) {
                                                    phoneNumber = lead.phoneNumber;
                                                }
                                            }

                                            setNewActivity({
                                                ...newActivity,
                                                relatedId: selectedId,
                                                phoneNumber: phoneNumber
                                            });
                                        }}
                                        disabled={newActivity.relatedTo === 'NONE'}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select...</option>
                                        {newActivity.relatedTo === 'CUSTOMER' && customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                                        ))}
                                        {newActivity.relatedTo === 'LEAD' && leads.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Conditional Fields for Calls */}
                            {newActivity.type === 'CALL' && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Direction</label>
                                            <select
                                                value={newActivity.direction}
                                                onChange={(e) => setNewActivity({ ...newActivity, direction: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="OUTBOUND">Outbound</option>
                                                <option value="INBOUND">Inbound</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Outcome</label>
                                            <select
                                                value={newActivity.outcome}
                                                onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="ANSWERED">Answered</option>
                                                <option value="MISSED">Missed</option>
                                                <option value="VOICEMAIL">Voicemail</option>
                                                <option value="NOT_ANSWERED">Not Answered</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Duration (sec)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={newActivity.duration}
                                                onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="+1..."
                                                value={newActivity.phoneNumber}
                                                onChange={(e) => setNewActivity({ ...newActivity, phoneNumber: e.target.value })}
                                                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><Mic size={12} /> Recording URL (Optional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={newActivity.recordingUrl}
                                            onChange={(e) => setNewActivity({ ...newActivity, recordingUrl: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description / Notes</label>
                                <textarea
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-sm transition-all resize-none"
                                    placeholder="Enter details about this activity..."
                                    rows="4"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30">
                                    <CheckSquare size={18} />
                                    Save Activity
                                </button>
                            </div>
                        </form>
                    </div >
                </div >
            )
            }
        </div >
    );
}

function MetricCard({ label, value, icon: Icon, color, trend }) {
    const colors = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
        green: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30',
        orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30',
    };

    return (
        <div className="bg-white dark:bg-card p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    <Icon size={22} className="shrink-0" />
                </div>
                {trend && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-800 flex items-center gap-1">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
            </div>
        </div>
    );
}
