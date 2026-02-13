import { useState, useEffect } from 'react';
import { getAllLeads, getAllCustomers, getAllDeals, getAllTickets, getAllCampaigns, getDashboardAnalytics } from '../../services/api';
import { TrendingUp, Users, Briefcase, Target, Mail, AlertCircle, DollarSign } from 'lucide-react';

export default function ReportsPage() {
    const [stats, setStats] = useState({
        leads: 0,
        customers: 0,
        deals: 0,
        tickets: 0,
        campaigns: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [leadsByStatus, setLeadsByStatus] = useState({});
    const [dealsByStage, setDealsByStage] = useState({});

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [leadsRes, customersRes, dealsRes, ticketsRes, campaignsRes] = await Promise.allSettled([
                    getAllLeads(),
                    getAllCustomers(),
                    getAllDeals(),
                    getAllTickets(),
                    getAllCampaigns()
                ]);

                const leads = leadsRes.status === 'fulfilled' ? leadsRes.value : [];
                const customers = customersRes.status === 'fulfilled' ? customersRes.value : [];
                const deals = dealsRes.status === 'fulfilled' ? dealsRes.value : [];
                const tickets = ticketsRes.status === 'fulfilled' ? ticketsRes.value : [];
                const campaigns = campaignsRes.status === 'fulfilled' ? campaignsRes.value : [];

                const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON');
                const totalRevenue = wonDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

                setStats({
                    leads: leads.length,
                    customers: customers.length,
                    deals: deals.length,
                    tickets: tickets.length,
                    campaigns: campaigns.length,
                    revenue: totalRevenue,
                });

                // Group leads by status
                const lByStatus = {};
                leads.forEach(l => {
                    lByStatus[l.status] = (lByStatus[l.status] || 0) + 1;
                });
                setLeadsByStatus(lByStatus);

                // Group deals by stage
                const dByStage = {};
                deals.forEach(d => {
                    dByStage[d.stage] = (dByStage[d.stage] || 0) + 1;
                });
                setDealsByStage(dByStage);

            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Analytics & Reports</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Insights into your business performance across all services.</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MiniStat label="Total Leads" value={stats.leads} icon={<Target size={20} />} color="blue" />
                <MiniStat label="Customers" value={stats.customers} icon={<Users size={20} />} color="purple" />
                <MiniStat label="Deals" value={stats.deals} icon={<Briefcase size={20} />} color="emerald" />
                <MiniStat label="Tickets" value={stats.tickets} icon={<AlertCircle size={20} />} color="amber" />
                <MiniStat label="Campaigns" value={stats.campaigns} icon={<Mail size={20} />} color="pink" />
                <MiniStat label="Revenue" value={formatCurrency(stats.revenue)} icon={<DollarSign size={20} />} color="green" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leads by Status */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Leads by Status</h3>
                    {Object.keys(leadsByStatus).length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <TrendingUp size={32} className="text-gray-300 mb-3" />
                            <p className="text-gray-400 text-sm">No lead data available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(leadsByStatus).map(([status, count]) => {
                                const maxCount = Math.max(...Object.values(leadsByStatus), 1);
                                const width = Math.max((count / maxCount) * 100, 10);
                                const colors = {
                                    NEW: 'from-blue-400 to-blue-600',
                                    CONTACTED: 'from-yellow-400 to-yellow-600',
                                    QUALIFIED: 'from-green-400 to-green-600',
                                    UNQUALIFIED: 'from-red-400 to-red-600',
                                    CONVERTED: 'from-purple-400 to-purple-600',
                                };
                                return (
                                    <div key={status} className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-gray-500 w-24 text-right">{status}</span>
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-7 overflow-hidden">
                                            <div
                                                className={`bg-gradient-to-r ${colors[status] || 'from-gray-400 to-gray-600'} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700`}
                                                style={{ width: `${width}%` }}
                                            >
                                                <span className="text-xs font-bold text-white">{count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Deals by Stage */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Deals by Stage</h3>
                    {Object.keys(dealsByStage).length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
                            <TrendingUp size={32} className="text-gray-300 mb-3" />
                            <p className="text-gray-400 text-sm">No deal data available yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(dealsByStage).map(([stage, count]) => {
                                const maxCount = Math.max(...Object.values(dealsByStage), 1);
                                const width = Math.max((count / maxCount) * 100, 10);
                                const colors = {
                                    PROSPECTING: 'from-blue-400 to-blue-600',
                                    QUALIFICATION: 'from-yellow-400 to-yellow-600',
                                    PROPOSAL: 'from-indigo-400 to-indigo-600',
                                    NEGOTIATION: 'from-purple-400 to-purple-600',
                                    CLOSED_WON: 'from-green-400 to-green-600',
                                    CLOSED_LOST: 'from-red-400 to-red-600',
                                };
                                return (
                                    <div key={stage} className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-gray-500 w-28 text-right">{stage.replace('_', ' ')}</span>
                                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-7 overflow-hidden">
                                            <div
                                                className={`bg-gradient-to-r ${colors[stage] || 'from-gray-400 to-gray-600'} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700`}
                                                style={{ width: `${width}%` }}
                                            >
                                                <span className="text-xs font-bold text-white">{count}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
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
