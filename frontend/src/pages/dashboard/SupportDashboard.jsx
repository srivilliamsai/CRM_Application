import { useState, useEffect } from 'react';
import { getUser, getAllUsers, getAllTickets } from '../../services/api';
import { ArrowUp, ArrowDown, AlertCircle, Clock, ThumbsUp, MessageSquare, Headphones, CheckCircle, AlertTriangle } from 'lucide-react';

export default function SupportDashboard() {
    const user = getUser();
    const firstName = user?.fullName?.split(' ')[0] || 'Support Agent';
    const [supportTeam, setSupportTeam] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, ticketsData] = await Promise.allSettled([
                    getAllUsers(user?.companyId),
                    getAllTickets()
                ]);

                if (usersData.status === 'fulfilled') {
                    const team = usersData.value.filter(u => u.roles.includes('ROLE_SUPPORT'));
                    setSupportTeam(team);
                }
                if (ticketsData.status === 'fulfilled') {
                    setTickets(ticketsData.value);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.companyId]);

    const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');
    const urgentTickets = tickets.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH');

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="glass-card p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Support Center 🎧
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Hey {firstName}! {urgentTickets.length > 0
                                ? <>You have <span className="font-bold text-amber-600">{urgentTickets.length} urgent ticket{urgentTickets.length > 1 ? 's' : ''}</span> to handle.</>
                                : "You're all caught up. No urgent tickets at the moment."}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <Headphones size={16} className="inline mr-2" />Knowledge Base
                        </button>
                        <button className="btn-primary">
                            <AlertCircle size={16} className="inline mr-2" />New Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Team Size" value={supportTeam.length} change="Members" trend="neutral" icon={<Headphones size={24} />} color="blue" />
                <StatCard title="Open Tickets" value={openTickets.length} change={tickets.length > 0 ? `of ${tickets.length} total` : "No tickets"} trend="neutral" icon={<AlertCircle size={24} />} color="red" />
                <StatCard title="Resolved" value={resolvedTickets.length} change={tickets.length > 0 ? `${Math.round((resolvedTickets.length / tickets.length) * 100)}% resolved` : "No data"} trend="neutral" icon={<CheckCircle size={24} />} color="green" />
                <StatCard title="Urgent" value={urgentTickets.length} change={urgentTickets.length > 0 ? "Needs attention" : "All clear"} trend="neutral" icon={<AlertTriangle size={24} />} color="amber" />
            </div>

            {/* Tickets Table + Support Team */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                        Recent Tickets {tickets.length > 0 && <span className="text-sm font-normal text-gray-500">({tickets.length})</span>}
                    </h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center min-h-[250px]">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4">
                                <AlertCircle size={32} className="text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Tickets Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Support tickets will appear here once they are created.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {tickets.slice(0, 10).map((ticket) => (
                                <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${ticket.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                                                ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                                    ticket.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                                        'bg-gray-100 text-gray-600'
                                            }`}>
                                            <AlertTriangle size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ticket.subject}</p>
                                            <p className="text-xs text-gray-500 truncate">{ticket.category || 'General'} · #{ticket.id}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-3 ${ticket.status === 'OPEN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                                        }`}>
                                        {ticket.status?.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Support Team Members */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Support Team</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {supportTeam.map((member, i) => (
                            <div key={member.id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                    {member.fullName ? member.fullName.charAt(0).toUpperCase() : member.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {member.fullName || member.username}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <a href={`tel:${member.phone}`} className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                                        <Headphones size={14} />
                                    </a>
                                    <a href={`mailto:${member.email}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                        <MessageSquare size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                        {supportTeam.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No support team members found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, trend, icon, color }) {
    const colorMap = {
        red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500',
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
