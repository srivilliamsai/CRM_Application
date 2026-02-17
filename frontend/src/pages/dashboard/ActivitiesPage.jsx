import { useState, useEffect } from 'react';
import { getAllActivities, getAllUsers } from '../../services/api';
import { Phone, Mail, Calendar, User, Search, Filter, Play, BarChart2, List } from 'lucide-react';

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL'); // ALL, CALL, EMAIL, MEETING
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('LIST'); // LIST, METRICS

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesData, usersData] = await Promise.all([
                    getAllActivities(),
                    getAllUsers()
                ]);
                setActivities(activitiesData);
                setUsers(usersData);
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
        const matchesSearch = activity.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getOwnerName(activity.performedBy).toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getActivityIcon = (type) => {
        switch (type) {
            case 'CALL': return <Phone size={18} className="text-blue-500" />;
            case 'EMAIL': return <Mail size={18} className="text-green-500" />;
            case 'MEETING': return <Calendar size={18} className="text-purple-500" />;
            default: return <User size={18} className="text-gray-500" />;
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getOwnerName = (id) => {
        const user = users.find(u => u.id === id);
        return user ? user.fullName || user.username : 'Unknown';
    };

    // Metrics Calculation
    const calculateMetrics = () => {
        const calls = activities.filter(a => a.type === 'CALL');
        return {
            total: calls.length,
            outbound: calls.filter(c => c.direction === 'OUTBOUND').length,
            inbound: calls.filter(c => c.direction === 'INBOUND').length,
            answered: calls.filter(c => c.outcome === 'ANSWERED').length,
            missed: calls.filter(c => c.outcome === 'MISSED').length,
            avgDuration: calls.length ? Math.round(calls.reduce((acc, c) => acc + (c.duration || 0), 0) / calls.length) : 0
        };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Activities</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track all calls, meetings, and interactions.</p>
            </div>

            {/* View Toggles */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setViewMode('LIST')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'LIST'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <List size={18} /> Manage Activities
                </button>
                <button
                    onClick={() => setViewMode('METRICS')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewMode === 'METRICS'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <BarChart2 size={18} /> Phone Metrics
                </button>
            </div>

            {viewMode === 'LIST' && (
                <>
                    <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-card p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            {['ALL', 'CALL', 'EMAIL', 'MEETING'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {type.charAt(0) + type.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
                        {loading ? (
                            <div className="flex h-full items-center justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredActivities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center p-12">
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                                    <Calendar size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No activities found</h3>
                                <p className="text-gray-500">Try adjusting your filters.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Type</th>
                                        <th className="px-6 py-4 font-medium">Description</th>
                                        <th className="px-6 py-4 font-medium">Start Time</th>
                                        <th className="px-6 py-4 font-medium">Duration</th>
                                        <th className="px-6 py-4 font-medium">Outcome</th>
                                        <th className="px-6 py-4 font-medium">Owner</th>
                                        <th className="px-6 py-4 font-medium">Recording</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {filteredActivities.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                                                        {getActivityIcon(activity.type)}
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-white">{activity.type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate" title={activity.description}>
                                                {activity.description || '—'}
                                                {activity.direction && <div className="text-xs text-gray-400">{activity.direction}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(activity.startTime || activity.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                                {formatDuration(activity.duration)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.outcome === 'ANSWERED' ? 'bg-green-100 text-green-700' :
                                                        activity.outcome === 'MISSED' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {activity.outcome || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                        {(getOwnerName(activity.performedBy) || '?').charAt(0)}
                                                    </div>
                                                    <span className="text-sm">{getOwnerName(activity.performedBy)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {activity.recordingUrl ? (
                                                    <button className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                                                        <Play size={14} fill="currentColor" />
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            {viewMode === 'METRICS' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <MetricCard label="Total Calls" value={calculateMetrics().total} color="blue" />
                        <MetricCard label="Outbound Calls" value={calculateMetrics().outbound} color="indigo" />
                        <MetricCard label="Inbound Calls" value={calculateMetrics().inbound} color="purple" />
                        <MetricCard label="Answered" value={calculateMetrics().answered} color="green" />
                        <MetricCard label="Missed" value={calculateMetrics().missed} color="red" />
                        <MetricCard label="Avg Duration" value={formatDuration(calculateMetrics().avgDuration)} color="gray" />
                    </div>

                    <div className="glass-card p-6 min-h-[300px] flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <BarChart2 size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Call Volume Trends will appear here.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MetricCard({ label, value, color }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
        indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
        purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
        green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
        red: 'text-red-600 bg-red-50 dark:bg-red-900/20',
        gray: 'text-gray-600 bg-gray-50 dark:bg-gray-800',
    };

    return (
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</p>
        </div>
    );
}
