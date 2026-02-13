import { useState, useEffect } from 'react';
import { getUser, getAllUsers, getAllCampaigns } from '../../services/api';
import { ArrowUp, ArrowDown, Eye, MousePointer, Megaphone, Users, Mail, Globe, Share2, Zap, Plus } from 'lucide-react';

export default function MarketingDashboard() {
    const user = getUser();
    const firstName = user?.fullName?.split(' ')[0] || 'Marketer';
    const [marketingTeam, setMarketingTeam] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, campaignsData] = await Promise.allSettled([
                    getAllUsers(user?.companyId),
                    getAllCampaigns()
                ]);

                if (usersData.status === 'fulfilled') {
                    const team = usersData.value.filter(u => u.roles.includes('ROLE_MARKETING'));
                    setMarketingTeam(team);
                }
                if (campaignsData.status === 'fulfilled') {
                    setCampaigns(campaignsData.value);
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
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.openCount || 0), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

    const typeIcon = (type) => {
        switch (type) {
            case 'EMAIL': return <Mail size={16} />;
            case 'SOCIAL_MEDIA': return <Share2 size={16} />;
            case 'WEBINAR': return <Globe size={16} />;
            case 'SMS': return <Zap size={16} />;
            default: return <Megaphone size={16} />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="glass-card p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Marketing Hub 📣
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Hey {firstName}! {activeCampaigns.length > 0
                                ? <>You have <span className="font-bold text-purple-600">{activeCampaigns.length} active campaign{activeCampaigns.length > 1 ? 's' : ''}</span> running.</>
                                : "No active campaigns — launch one to engage your audience!"}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button className="btn-primary">
                            <Plus size={16} className="inline mr-2" />New Campaign
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Campaigns" value={campaigns.length} change={activeCampaigns.length > 0 ? `${activeCampaigns.length} active` : "No active"} icon={<Megaphone size={24} />} color="purple" />
                <StatCard title="Total Sent" value={totalSent.toLocaleString()} change={campaigns.length > 0 ? `Across ${campaigns.length} campaigns` : "No campaigns"} icon={<Mail size={24} />} color="blue" />
                <StatCard title="Open Rate" value={`${openRate}%`} change={totalSent > 0 ? `${totalOpened.toLocaleString()} opened` : "No data"} icon={<Eye size={24} />} color="green" />
                <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} change={totalOpened > 0 ? `${Math.round((totalClicks / totalOpened) * 100)}% click rate` : "No data"} icon={<MousePointer size={24} />} color="pink" />
            </div>

            {/* Campaigns List + Team */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Campaigns */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                        Campaigns {campaigns.length > 0 && <span className="text-sm font-normal text-gray-500">({campaigns.length})</span>}
                    </h3>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center min-h-[250px]">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-full mb-4">
                                <Megaphone size={32} className="text-purple-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Campaigns Yet</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
                                Create your first marketing campaign to start reaching your audience.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${campaign.type === 'EMAIL' ? 'bg-blue-100 text-blue-600' :
                                                campaign.type === 'SOCIAL_MEDIA' ? 'bg-pink-100 text-pink-600' :
                                                    campaign.type === 'WEBINAR' ? 'bg-green-100 text-green-600' :
                                                        'bg-purple-100 text-purple-600'
                                            }`}>
                                            {typeIcon(campaign.type)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{campaign.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{campaign.type?.replace('_', ' ')} · {campaign.sentCount || 0} sent</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-3 ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                            campaign.status === 'DRAFT' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300' :
                                                campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    campaign.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                                        }`}>
                                        {campaign.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Marketing Team */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Marketing Team</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {marketingTeam.map((member, i) => (
                            <div key={member.id || i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
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
                        {marketingTeam.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No marketing team members found.</p>
                        )}
                    </div>
                </div>
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
