import { useState, useEffect } from 'react';
import { getUser, getAllUsers, getAllCampaigns, getAllLeads, getAllCustomers } from '../../services/api';
import { Megaphone, Mail, Eye, MousePointer, Target, TrendingUp, Users, DollarSign, ArrowUp, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function MarketingDashboard() {
    const user = getUser();
    const firstName = user?.fullName?.split(' ')[0] || 'Marketer';
    const [marketingTeam, setMarketingTeam] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [leads, setLeads] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, campaignsData, leadsData, customersData] = await Promise.allSettled([
                    getAllUsers(user?.companyId),
                    getAllCampaigns(),
                    getAllLeads(),
                    getAllCustomers()
                ]);

                if (usersData.status === 'fulfilled') {
                    const team = usersData.value.filter(u => u.roles.includes('ROLE_MARKETING'));
                    setMarketingTeam(team);
                }
                if (campaignsData.status === 'fulfilled') {
                    setCampaigns(campaignsData.value);
                }
                if (leadsData.status === 'fulfilled') {
                    setLeads(leadsData.value);
                }
                if (customersData.status === 'fulfilled') {
                    setCustomers(customersData.value);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.companyId]);

    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');
    const totalBudget = campaigns.reduce((sum, c) => sum + (parseFloat(c.budget) || 0), 0);
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.openCount || 0), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
    const avgOpenRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;
    const avgClickRate = totalOpened > 0 ? Math.round((totalClicks / totalOpened) * 100) : 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    // Chart Data Preparation

    // 1. Campaign Performance (Top 5 by Sent Count)
    const campaignPerformanceData = campaigns
        .sort((a, b) => (b.sentCount || 0) - (a.sentCount || 0))
        .slice(0, 5)
        .map(c => ({
            name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
            sent: c.sentCount || 0,
            opened: c.openCount || 0,
            clicked: c.clickCount || 0
        }));

    // 2. Lead Gen Trend (Last 7 Days)
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
        }
        return days;
    };

    const last7Days = getLast7Days();
    const leadTrendData = last7Days.map(date => {
        const dayLeads = leads.filter(l => l.createdAt && l.createdAt.startsWith(date));
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        return {
            name: dayName,
            leads: dayLeads.length,
            fullDate: date
        };
    });

    // Recent Leads (Top 5)
    const recentLeads = [...leads]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="glass-card p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Marketing Overview 🚀
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Welcome back, {firstName}! You have {activeCampaigns.length} active campaigns running.
                        </p>
                    </div>
                </div>
            </div>

            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Campaigns" value={campaigns.length} change={`${activeCampaigns.length} Active`} icon={<Megaphone size={24} />} color="purple" />
                <StatCard title="Total Customers" value={customers.length} change="Acquired" icon={<Users size={24} />} color="blue" />
                <StatCard title="Total Leads" value={leads.length} change="In Pipeline" icon={<UserPlus size={24} />} color="green" />
                <StatCard title="Avg Open Rate" value={`${avgOpenRate}%`} change="Across all campaigns" icon={<Eye size={24} />} color="pink" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaign Performance Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Recent Campaign Performance</h3>
                    {campaigns.length > 0 ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={campaignPerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ fill: '#F3F4F6' }}
                                    />
                                    <Bar dataKey="sent" name="Sent" fill="#A78BFA" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="opened" name="Opened" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="clicked" name="Clicked" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                            <Megaphone size={48} className="mb-4 text-gray-300" />
                            <p>No campaign data available yet.</p>
                        </div>
                    )}
                </div>

                {/* Lead Trend Chart */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Lead Gen Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={leadTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#ec4899', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="leads" stroke="#ec4899" fillOpacity={1} fill="url(#colorLeads)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Leads Section */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Recent Leads</h3>
                {recentLeads.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-gray-100 dark:border-gray-800">
                                    <th className="py-3 font-medium">Name</th>
                                    <th className="py-3 font-medium">Email</th>
                                    <th className="py-3 font-medium">Source</th>
                                    <th className="py-3 font-medium">Status</th>
                                    <th className="py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeads.map((lead) => (
                                    <tr key={lead.id} className="text-sm text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="py-3 font-medium">{lead.firstName} {lead.lastName}</td>
                                        <td className="py-3 text-gray-500">{lead.email}</td>
                                        <td className="py-3">
                                            <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-medium">
                                                {lead.source || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.status === 'NEW' ? 'bg-blue-50 text-blue-600' :
                                                lead.status === 'CONVERTED' ? 'bg-green-50 text-green-600' :
                                                    'bg-gray-50 text-gray-600'
                                                }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-500">
                                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No recent leads found.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, color }) {
    const colorMap = {
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
        pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-500',
    };
    return (
        <div className="glass-card p-6 hover:translate-y-[-2px] transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                <div className={`p-2 rounded-xl ${colorMap[color]}`}>{icon}</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
            <div className="text-xs font-medium text-gray-500">
                {change}
            </div>
        </div>
    );
}
