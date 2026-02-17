import { useState, useEffect } from 'react';
import { getUser, getAllUsers, getAllDeals, getAllLeads } from '../../services/api';
import { ArrowUp, ArrowDown, DollarSign, Target, Users, TrendingUp, Phone, Calendar, Briefcase } from 'lucide-react';
import LeadFunnelChart from '../../components/charts/LeadFunnelChart';
import DailyTrendChart from '../../components/charts/DailyTrendChart';

export default function SalesDashboard() {
    const user = getUser();
    const firstName = user?.fullName?.split(' ')[0] || 'Sales Agent';
    const [salesTeam, setSalesTeam] = useState([]);
    const [deals, setDeals] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, dealsData, leadsData] = await Promise.allSettled([
                    getAllUsers(user?.companyId),
                    getAllDeals(),
                    getAllLeads()
                ]);

                if (usersData.status === 'fulfilled') {
                    const team = usersData.value.filter(u => u.roles.includes('ROLE_SALES'));
                    setSalesTeam(team);
                }
                if (dealsData.status === 'fulfilled') {
                    setDeals(dealsData.value);
                }
                if (leadsData.status === 'fulfilled') {
                    setLeads(leadsData.value);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.companyId]);

    const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON');
    const totalRevenue = wonDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
    const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;
    const activeDeals = deals.filter(d => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    // Pipeline stage counts for funnel
    const stages = ['PROSPECTING', 'QUALIFICATION', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON'];
    const funnelData = stages.map(stage => ({
        name: stage.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        value: deals.filter(d => d.stage === stage).length
    }));

    // Daily Lead Trend Data (Last 30 Days)
    const getLast30Days = () => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    // Process leads into daily counts
    const dailyTrendData = getLast30Days().map(date => {
        const count = leads.filter(l => l.createdAt && l.createdAt.startsWith(date)).length;
        // Format date for display (e.g., "Sep 1")
        const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return { date: displayDate, count };
    });

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="glass-card p-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Sales Dashboard 💰
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Hey {firstName}! {activeDeals.length > 0
                                ? <>You have <span className="font-bold text-emerald-600">{activeDeals.length} active deal{activeDeals.length > 1 ? 's' : ''}</span> in your pipeline.</>
                                : "Your pipeline is empty — time to start some conversations!"}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Phone size={16} className="inline mr-2" />Log Call
                        </button>
                        <button className="btn-primary">
                            <Briefcase size={16} className="inline mr-2" />New Deal
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Team Size" value={salesTeam.length} change="Members" icon={<Users size={24} />} color="green" />
                <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} change={wonDeals.length > 0 ? `${wonDeals.length} deal${wonDeals.length > 1 ? 's' : ''} closed` : "No closed deals"} icon={<DollarSign size={24} />} color="blue" />
                <StatCard title="Deals Won" value={wonDeals.length} change={deals.length > 0 ? `of ${deals.length} total` : "No deals"} icon={<Target size={24} />} color="purple" />
                <StatCard title="Win Rate" value={`${winRate}%`} change={deals.length > 0 ? `Based on ${deals.length} deals` : "No data"} icon={<ArrowUp size={24} />} color="emerald" />
            </div>

            {/* Charts Section: Funnel & Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipeline Funnel */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <Target size={18} /> Lead Funnel
                    </h3>
                    <div className="h-[300px]">
                        {deals.length > 0 ? (
                            <LeadFunnelChart data={funnelData} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                No deal data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Daily Lead Trend */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp size={18} /> Daily Lead Addition
                    </h3>
                    <div className="h-[300px]">
                        {leads.length > 0 ? (
                            <DailyTrendChart data={dailyTrendData} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                No lead data available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Active Deals */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Active Deals</h3>
                {activeDeals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center min-h-[200px]">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-full mb-4">
                            <Briefcase size={32} className="text-purple-500" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                            No active deals yet. Create a new deal to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeDeals.slice(0, 8).map((deal) => (
                            <div key={deal.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{deal.title}</p>
                                    <p className="text-xs text-gray-500">{deal.stage?.replace('_', ' ')}</p>
                                </div>
                                <span className="text-sm font-bold text-primary ml-3">{formatCurrency(deal.value || 0)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Sales Team */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Sales Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {salesTeam.map((member, i) => (
                        <div key={member.id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                {member.fullName ? member.fullName.charAt(0).toUpperCase() : member.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {member.fullName || member.username}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                            </div>
                        </div>
                    ))}
                    {salesTeam.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4 col-span-full">No sales team members found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, color }) {
    const colorMap = {
        green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500',
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
