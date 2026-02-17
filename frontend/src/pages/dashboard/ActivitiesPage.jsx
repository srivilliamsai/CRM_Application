import { useState, useEffect } from 'react';
import { getAllActivities, getAllUsers, createActivity, getAllCustomers, getAllLeads } from '../../services/api';
import { Phone, Mail, Calendar, User, Search, Play, BarChart2, List, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ActivitiesPage() {
    const [activities, setActivities] = useState([]);
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('ALL'); // ALL, CALL, EMAIL, MEETING
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('LIST'); // LIST, METRICS

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesData, usersData, customersData, leadsData] = await Promise.all([
                    getAllActivities(),
                    getAllUsers(),
                    getAllCustomers(),
                    getAllLeads()
                ]);
                setActivities(activitiesData);
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
            notAnswered: calls.filter(c => c.outcome === 'NOT_ANSWERED').length,
            voicemail: calls.filter(c => c.outcome === 'VOICEMAIL').length,
            avgDuration: calls.length ? Math.round(calls.reduce((acc, c) => acc + (c.duration || 0), 0) / calls.length) : 0
        };
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

    const [showModal, setShowModal] = useState(false);
    const [newActivity, setNewActivity] = useState({
        type: 'CALL',
        description: '',
        outcome: 'ANSWERED',
        direction: 'OUTBOUND',
        duration: 0,
        performedBy: users.length > 0 ? users[0].id : 1, // Default to first user
        relatedTo: 'NONE', // NONE, CUSTOMER, LEAD
        relatedId: '',
        phoneNumber: ''
    });

    const handleRelatedChange = (type, id) => {
        let phone = '';
        if (type === 'CUSTOMER') {
            const customer = customers.find(c => c.id === parseInt(id));
            phone = customer?.phone || '';
        } else if (type === 'LEAD') {
            const lead = leads.find(l => l.id === parseInt(id));
            phone = lead?.phone || '';
        }
        setNewActivity(prev => ({ ...prev, relatedTo: type, relatedId: id, phoneNumber: phone }));
    };

    const handleCreateActivity = async (e) => {
        e.preventDefault();
        try {
            await createActivity({
                ...newActivity,
                description: newActivity.description || `${newActivity.direction} ${newActivity.type} - ${newActivity.outcome}`,
                startTime: new Date().toISOString(),
                customerId: newActivity.relatedTo === 'CUSTOMER' ? newActivity.relatedId : null,
                leadId: newActivity.relatedTo === 'LEAD' ? newActivity.relatedId : null,
                phoneNumber: newActivity.phoneNumber
            });
            setShowModal(false);
            // Refresh data
            const [activitiesData] = await Promise.all([getAllActivities()]);
            setActivities(activitiesData);
        } catch (error) {
            console.error("Failed to create activity", error);
        }
    };

    const simulateIncomingCall = async () => {
        const outcomes = ['ANSWERED', 'MISSED', 'VOICEMAIL', 'NOT_ANSWERED'];
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        const randomDuration = randomOutcome === 'ANSWERED' ? Math.floor(Math.random() * 300) + 10 : 0;

        const simulatedCall = {
            type: 'CALL',
            direction: 'INBOUND',
            outcome: randomOutcome,
            duration: randomDuration,
            description: `Incoming Call from +1 (555) 01${Math.floor(Math.random() * 99)}`,
            performedBy: users.length > 0 ? users[0].id : 1,
            startTime: new Date().toISOString()
        };

        try {
            await createActivity(simulatedCall);
            // Refresh data
            const [activitiesData] = await Promise.all([getAllActivities()]);
            setActivities(activitiesData);
        } catch (error) {
            console.error("Failed to simulate call", error);
        }
    };

    const getDailyCallVolume = () => {
        const calls = activities.filter(a => a.type === 'CALL');
        const volume = {};

        calls.forEach(call => {
            const date = new Date(call.startTime || call.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
            volume[date] = (volume[date] || 0) + 1;
        });

        // Ensure last 7 days order
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            days.push({ name: dayName, calls: volume[dayName] || 0 });
        }
        return days;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Activities</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track all calls, meetings, and interactions.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={simulateIncomingCall} className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 rounded-xl transition-colors flex items-center gap-2 font-medium">
                        <Phone size={18} />
                        Simulate Call
                    </button>
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Log Activity
                    </button>
                </div>
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
                                        <th className="px-6 py-4 font-medium">Contact</th>
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
                                            <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                                {getRelatedName(activity)}
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        <MetricCard label="Total Calls" value={calculateMetrics().total} color="blue" />
                        <MetricCard label="Outbound" value={calculateMetrics().outbound} color="indigo" />
                        <MetricCard label="Inbound" value={calculateMetrics().inbound} color="purple" />
                        <MetricCard label="Answered" value={calculateMetrics().answered} color="green" />
                        <MetricCard label="Not Ans." value={calculateMetrics().notAnswered} color="orange" />
                        <MetricCard label="Missed" value={calculateMetrics().missed} color="red" />
                        <MetricCard label="Voicemail" value={calculateMetrics().voicemail} color="yellow" />
                        <MetricCard label="Avg Dur." value={formatDuration(calculateMetrics().avgDuration)} color="gray" />
                    </div>

                    <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Call Volume (Last 7 Days)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={getDailyCallVolume()}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                    <Bar dataKey="calls" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Log Activity Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Log Activity</h2>
                        </div>
                        <form onSubmit={handleCreateActivity} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    value={newActivity.type}
                                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="CALL">Call</option>
                                    <option value="EMAIL">Email</option>
                                    <option value="MEETING">Meeting</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Related To</label>
                                    <select
                                        value={newActivity.relatedTo}
                                        onChange={(e) => handleRelatedChange(e.target.value, '')}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="NONE">None</option>
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="LEAD">Lead</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {newActivity.relatedTo === 'CUSTOMER' ? 'Select Customer' : newActivity.relatedTo === 'LEAD' ? 'Select Lead' : 'Select'}
                                    </label>
                                    <select
                                        value={newActivity.relatedId}
                                        onChange={(e) => handleRelatedChange(newActivity.relatedTo, e.target.value)}
                                        disabled={newActivity.relatedTo === 'NONE'}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
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

                            {newActivity.type === 'CALL' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={newActivity.phoneNumber}
                                        onChange={(e) => setNewActivity({ ...newActivity, phoneNumber: e.target.value })}
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            )}

                            {newActivity.type === 'CALL' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Direction</label>
                                            <select
                                                value={newActivity.direction}
                                                onChange={(e) => setNewActivity({ ...newActivity, direction: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="OUTBOUND">Outbound</option>
                                                <option value="INBOUND">Inbound</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Outcome</label>
                                            <select
                                                value={newActivity.outcome}
                                                onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                            >
                                                <option value="ANSWERED">Answered</option>
                                                <option value="MISSED">Missed</option>
                                                <option value="VOICEMAIL">Voicemail</option>
                                                <option value="NOT_ANSWERED">Not Answered</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (seconds)</label>
                                        <input
                                            type="number"
                                            value={newActivity.duration}
                                            onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) || 0 })}
                                            className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                        />
                                    </div>
                                </>
                            )}


                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={newActivity.description}
                                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Add notes..."
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Log Activity
                                </button>
                            </div>
                        </form>
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
