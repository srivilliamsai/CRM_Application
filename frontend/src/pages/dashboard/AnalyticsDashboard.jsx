import { useState, useEffect } from 'react';
import { getDashboardAnalytics, getAllReports, createReport, deleteReport } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { FileText, Plus, Trash2, Download, RefreshCw, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newReportName, setNewReportName] = useState('');
    const [newReportType, setNewReportType] = useState('SALES');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [metricsData, reportsData] = await Promise.all([
                getDashboardAnalytics(),
                getAllReports()
            ]);
            setMetrics(metricsData || {});
            setReports(reportsData || []);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateReport = async (e) => {
        e.preventDefault();
        try {
            await createReport({
                name: newReportName,
                type: newReportType,
                generatedBy: 'User', // dynamic user
                content: JSON.stringify({ data: 'Sample Report Content' }) // Mock content
            });
            setShowCreateModal(false);
            setNewReportName('');
            fetchData();
        } catch (error) {
            console.error("Failed to create report:", error);
        }
    };

    const handleDeleteReport = async (id) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await deleteReport(id);
                setReports(reports.filter(r => r.id !== id));
            } catch (error) {
                console.error("Failed to delete report:", error);
            }
        }
    };



    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time insights and reports.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RefreshCw size={20} className={loading ? "animate-spin text-primary" : "text-gray-500"} />
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Create Report
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <TrendingUp size={16} /> +12%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics?.totalRevenue !== undefined ? `$${metrics.totalRevenue}` : '$0'}
                    </div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                </div>

                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                            <Users size={24} />
                        </div>
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                            <TrendingUp size={16} /> +5%
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics?.activeUsers !== undefined ? metrics.activeUsers : '0'}
                    </div>
                    <div className="text-sm text-gray-500">Active Leads</div>
                </div>

                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <Activity size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            Total
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {metrics?.totalActivities || '0'}
                    </div>
                    <div className="text-sm text-gray-500">Activities Logged</div>
                </div>

                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                            <FileText size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            Total
                        </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {reports.length}
                    </div>
                    <div className="text-sm text-gray-500">Generated Reports</div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue & Leads Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics?.salesTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="sales" name="Revenue ($)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="leads" name="New Leads" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Deal Distribution</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        {metrics?.dealDistribution && metrics.dealDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={metrics.dealDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {metrics.dealDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <DollarSign size={48} className="mb-2 opacity-50" />
                                <p>No deals found yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activities Feed */}
            <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activities</h3>
                </div>
                <div className="p-6">
                    {metrics?.recentActivities?.length > 0 ? (
                        <div className="space-y-6">
                            {metrics.recentActivities.map((activity) => (
                                <div key={activity.id} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'CALL' ? 'bg-blue-100 text-blue-600' :
                                            activity.type === 'EMAIL' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                            <Activity size={16} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {new Date(activity.createdAt).toLocaleString()}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                {activity.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No recent activities found.</p>
                    )}
                </div>
            </div>

            {/* Reports List */}
            <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Report Name</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Generated By</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No reports found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                <FileText size={16} />
                                            </div>
                                            {report.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{report.generatedBy}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                    <Download size={16} />
                                                </button>
                                                <button onClick={() => handleDeleteReport(report.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Report Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generate Report</h2>
                        </div>
                        <form onSubmit={handleCreateReport} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Name</label>
                                <input
                                    type="text"
                                    value={newReportName}
                                    onChange={(e) => setNewReportName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                                    placeholder="e.g. Q3 Sales Summary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Report Type</label>
                                <select
                                    value={newReportType}
                                    onChange={(e) => setNewReportType(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                                >
                                    <option value="SALES">Sales Performance</option>
                                    <option value="LEADS">Lead Acquisition</option>
                                    <option value="ACTIVITY">User Activity</option>
                                    <option value="REVENUE">Revenue Forecast</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Generate Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
