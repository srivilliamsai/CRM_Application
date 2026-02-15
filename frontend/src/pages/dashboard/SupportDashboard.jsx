import { useState, useEffect } from 'react';
import { getUser, getAllUsers, getAllTickets } from '../../services/api';
import { AlertCircle, Clock, Headphones, CheckCircle, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                            Support Dashboard 🎧
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Hey {firstName}! {urgentTickets.length > 0
                                ? <>You have <span className="font-bold text-amber-600">{urgentTickets.length} urgent ticket{urgentTickets.length > 1 ? 's' : ''}</span> requiring attention.</>
                                : "You're all caught up. Great work keeping the queue clean!"}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <Link to="/dashboard/tickets" className="btn-primary flex items-center gap-2">
                            Manage Tickets
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Open Tickets" value={openTickets.length} change={tickets.length > 0 ? `of ${tickets.length} total` : "No tickets"} icon={<AlertCircle size={24} />} color="blue" />
                <StatCard title="Urgent" value={urgentTickets.length} change={urgentTickets.length > 0 ? "Needs attention" : "All clear"} icon={<AlertTriangle size={24} />} color="red" />
                <StatCard title="Resolved" value={resolvedTickets.length} change={tickets.length > 0 ? `${Math.round((resolvedTickets.length / tickets.length) * 100)}% resolved` : "No data"} icon={<CheckCircle size={24} />} color="green" />
                <StatCard title="Avg Response" value="2.4h" change="Last 7 days" icon={<Clock size={24} />} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed Placeholder */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                        <Activity size={18} className="text-blue-500" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {tickets.slice(0, 5).map(ticket => (
                            <div key={ticket.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                                <div className={`mt-1 p-2 rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    <TrendingUp size={14} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Ticket #{ticket.id}: {ticket.subject}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Status: {ticket.status} · {new Date(ticket.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {tickets.length === 0 && <p className="text-gray-500 text-sm">No recent activity.</p>}
                    </div>
                </div>

                {/* Team Members */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Support Team</h3>
                    <div className="space-y-4">
                        {supportTeam.map((member, i) => (
                            <div key={member.id || i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, icon, color }) {
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
