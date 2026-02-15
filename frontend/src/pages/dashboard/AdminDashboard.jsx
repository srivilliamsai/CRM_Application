import React from 'react';
import { getUser, getAllUsers, getAllLeads, getAllCustomers, getAllDeals, getAllTickets, getAllCampaigns } from '../../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUp, ArrowDown, DollarSign, Users, ShoppingBag, Activity, TrendingUp, Shield, Target, Briefcase, AlertCircle, Mail } from 'lucide-react';

export default function AdminDashboard() {
    const user = getUser();
    const firstName = user?.fullName?.split(' ')[0] || 'User';
    const role = user?.roles?.[0]?.replace('ROLE_', '') || 'MEMBER';
    const [users, setUsers] = React.useState([]);
    const [stats, setStats] = React.useState({ leads: 0, customers: 0, deals: 0, tickets: 0, campaigns: 0, revenue: 0 });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Check if user is logged in
                if (!user) return;

                const [usersRes, leadsRes, customersRes, dealsRes, ticketsRes, campaignsRes] = await Promise.allSettled([
                    getAllUsers(user?.companyId),
                    getAllLeads(),
                    getAllCustomers(),
                    getAllDeals(),
                    getAllTickets(),
                    getAllCampaigns()
                ]);

                if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
                    setUsers(usersRes.value);
                } else {
                    setUsers([]);
                }

                const deals = (dealsRes.status === 'fulfilled' && Array.isArray(dealsRes.value)) ? dealsRes.value : [];
                const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON');
                const revenue = wonDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

                setStats({
                    leads: (leadsRes.status === 'fulfilled' && Array.isArray(leadsRes.value)) ? leadsRes.value.length : 0,
                    customers: (customersRes.status === 'fulfilled' && Array.isArray(customersRes.value)) ? customersRes.value.length : 0,
                    deals: deals.length,
                    tickets: (ticketsRes.status === 'fulfilled' && Array.isArray(ticketsRes.value)) ? ticketsRes.value.length : 0,
                    campaigns: (campaignsRes.status === 'fulfilled' && Array.isArray(campaignsRes.value)) ? campaignsRes.value.length : 0,
                    revenue: revenue,
                });
            } catch (error) {
                console.error("Failed to fetch data", error);
                // Set empty state on error to prevent crashes
                setUsers([]);
                setStats({ leads: 0, customers: 0, deals: 0, tickets: 0, campaigns: 0, revenue: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.companyId]); // Add dependency

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    const roleData = [
        { name: 'Sales', value: users.filter(u => u.roles && u.roles.includes('ROLE_SALES')).length, color: '#10B981' },
        { name: 'Marketing', value: users.filter(u => u.roles && u.roles.includes('ROLE_MARKETING')).length, color: '#8B5CF6' },
        { name: 'Support', value: users.filter(u => u.roles && u.roles.includes('ROLE_SUPPORT')).length, color: '#F59E0B' },
        { name: 'Admin', value: users.filter(u => u.roles && u.roles.includes('ROLE_ADMIN')).length, color: '#3B82F6' },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="glass-card p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome back, {firstName}! 👋
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Here's the holistic view of your business. {stats.leads > 0 || stats.deals > 0
                                ? `${stats.leads} leads, ${stats.deals} deals, ${stats.customers} customers tracked.`
                                : 'Start adding data to see your business dashboard come to life.'}
                        </p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Shield size={20} className="text-blue-500" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {role.charAt(0) + role.slice(1).toLowerCase()} Team
                        </span>
                    </div>
                </div>
                {/* Debug: Show Permissions */}
                <div className="mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-800/50">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wider">Active Permissions</p>
                    <div className="flex flex-wrap gap-2">
                        {user?.permissions && user.permissions.length > 0 ? (
                            user.permissions.map((perm, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono border border-blue-200 dark:border-blue-800">
                                    {perm}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500 italic">No specific permissions assigned (or re-login required)</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid - Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Team" value={users.length} change="Active members" icon={<Users size={24} />} color="blue" />
                <StatCard title="Sales Team" value={users.filter(u => u.roles && u.roles.includes('ROLE_SALES')).length} change="Members" icon={<DollarSign size={24} />} color="green" />
                <StatCard title="Marketing Team" value={users.filter(u => u.roles && u.roles.includes('ROLE_MARKETING')).length} change="Members" icon={<ShoppingBag size={24} />} color="purple" />
                <StatCard title="Support Team" value={users.filter(u => u.roles && u.roles.includes('ROLE_SUPPORT')).length} change="Members" icon={<Shield size={24} />} color="orange" />
            </div>

            {/* Stats Grid - Business */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MiniStat label="Leads" value={stats.leads} icon={<Target size={18} />} color="blue" />
                <MiniStat label="Customers" value={stats.customers} icon={<Users size={18} />} color="purple" />
                <MiniStat label="Deals" value={stats.deals} icon={<Briefcase size={18} />} color="emerald" />
                <MiniStat label="Tickets" value={stats.tickets} icon={<AlertCircle size={18} />} color="amber" />
                <MiniStat label="Campaigns" value={stats.campaigns} icon={<Mail size={18} />} color="pink" />
                <MiniStat label="Revenue" value={formatCurrency(stats.revenue)} icon={<DollarSign size={18} />} color="green" />
            </div>

            {/* Role Distribution & Team Members */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Role Distribution Pie Chart */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Role Distribution</h3>
                    {roleData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
                            <Users size={32} className="text-gray-300 mb-3" />
                            <p className="text-gray-400 text-sm">No team members yet.</p>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                                        {roleData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Real Team Members List */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Team Members</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {users.map((member, i) => (
                            <div key={member.id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                                    {member.fullName ? member.fullName.charAt(0).toUpperCase() : member.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {member.fullName || member.username}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${member.roles && member.roles.includes('ROLE_ADMIN') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                    member.roles && member.roles.includes('ROLE_SALES') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                        member.roles && member.roles.includes('ROLE_MARKETING') ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                    }`}>
                                    {member.roles && member.roles.length > 0 ? member.roles[0].replace('ROLE_', '') : 'User'}
                                </span>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">Loading members...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, color }) {
    const colorMap = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500',
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

function MiniStat({ label, value, icon, color }) {
    const colorMap = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500',
        pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-500',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
    };
    return (
        <div className="glass-card p-4 text-center hover:translate-y-[-2px] transition-transform duration-300">
            <div className={`p-2 rounded-xl ${colorMap[color]} w-fit mx-auto mb-2`}>{icon}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
        </div>
    );
}
