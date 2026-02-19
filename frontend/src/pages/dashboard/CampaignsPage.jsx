import { useState, useEffect } from 'react';
import { getUser, getAllUsers, getAllCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../../services/api';
import { ArrowUp, ArrowDown, Eye, MousePointer, Megaphone, Users, Mail, Globe, Share2, Zap, Plus, MoreHorizontal, X, Calendar, DollarSign, Target, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function CampaignsPage() {
    const user = getUser();
    const firstName = user?.fullName?.split(' ')[0] || 'Marketer';
    const [marketingTeam, setMarketingTeam] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [viewCampaign, setViewCampaign] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showSimulateModal, setShowSimulateModal] = useState(false);
    const [simulateData, setSimulateData] = useState({
        sentCount: 0,
        openCount: 0,
        clickCount: 0,
        conversionCount: 0,
        bounceRate: 0
    });

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'EMAIL',
        status: 'DRAFT',
        startDate: '',
        endDate: '',
        budget: '',
        goal: '',
        targetAudience: ''
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, [user?.companyId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersData, campaignsData] = await Promise.allSettled([
                getAllUsers(user?.companyId),
                getAllCampaigns()
            ]);

            if (usersData.status === 'fulfilled') {
                // const team = usersData.value.filter(u => u.roles.includes('ROLE_MARKETING'));
                // setMarketingTeam(team); // Team not used in this view anymore
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setFormData({
            name: '',
            description: '',
            type: 'EMAIL',
            status: 'DRAFT',
            startDate: '',
            endDate: '',
            budget: '',
            goal: '',
            targetAudience: ''
        });
        setIsEditing(false);
        setSelectedCampaignId(null);
        setShowCreateModal(true);
        setActiveDropdown(null);
    };

    const openEditModal = (campaign, e) => {
        if (e) e.stopPropagation();
        setFormData({
            name: campaign.name,
            description: campaign.description || '',
            type: campaign.type,
            status: campaign.status,
            startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
            endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
            budget: campaign.budget || '',
            goal: campaign.goal || '',
            targetAudience: campaign.targetAudience || ''
        });
        setIsEditing(true);
        setSelectedCampaignId(campaign.id);
        setShowCreateModal(true);
        setActiveDropdown(null);
        setViewCampaign(null); // Close view modal if open
    };

    const openViewModal = (campaign, e) => {
        if (e) e.stopPropagation();
        setViewCampaign(campaign);
        setActiveDropdown(null);
    };

    const deleteCampaignHandler = async (id, e) => {
        if (e) e.stopPropagation();
        await handleDelete(id);
    };

    const openSimulateModal = (campaign, e) => {
        if (e) e.stopPropagation();
        setSimulateData({
            sentCount: campaign.sentCount || 0,
            openCount: campaign.openCount || 0,
            clickCount: campaign.clickCount || 0,
            conversionCount: campaign.conversionCount || 0,
            bounceRate: campaign.bounceRate || 0
        });
        setSelectedCampaignId(campaign.id);
        setShowSimulateModal(true);
        setActiveDropdown(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                budget: parseFloat(formData.budget) || 0,
                targetAudience: parseInt(formData.targetAudience) || 0,
                startDate: formData.startDate ? `${formData.startDate}T09:00:00` : null,
                endDate: formData.endDate ? `${formData.endDate}T17:00:00` : null
            };

            if (isEditing) {
                await updateCampaign(selectedCampaignId, payload);
            } else {
                await createCampaign(payload);
            }
            setShowCreateModal(false);
            await fetchData(); // Refresh list
        } catch (error) {
            console.error("Failed to save campaign", error);
            alert("Failed to save campaign. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
            try {
                await deleteCampaign(id);
                await fetchData();
            } catch (error) {
                console.error("Failed to delete campaign", error);
                alert("Failed to delete campaign.");
            }
        }
        setActiveDropdown(null);
    };



    const handleSimulateSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // We need to fetch the existing campaign first to preserve other fields
            const campaignToUpdate = campaigns.find(c => c.id === selectedCampaignId);
            const payload = {
                ...campaignToUpdate,
                startDate: campaignToUpdate.startDate ? `${campaignToUpdate.startDate}` : null, // Keep existing format if possible or re-format
                endDate: campaignToUpdate.endDate ? `${campaignToUpdate.endDate}` : null,
                ...simulateData,
                sentCount: parseInt(simulateData.sentCount),
                openCount: parseInt(simulateData.openCount),
                clickCount: parseInt(simulateData.clickCount),
                conversionCount: parseInt(simulateData.conversionCount),
                bounceRate: parseFloat(simulateData.bounceRate)
            };

            // The startDate/endDate might come back from API as "2023-01-01T10:00:00". 
            // The create/update payload expects this format, so we should be fine passing it back.
            // However, let's ensure we don't break the dates.

            await updateCampaign(selectedCampaignId, payload);
            setShowSimulateModal(false);
            await fetchData();
        } catch (error) {
            console.error("Failed to update stats", error);
            alert("Failed to update stats.");
        } finally {
            setSaving(false);
        }
    };

    const toggleDropdown = (id, e) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE');
    const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + (c.openCount || 0), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
    const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

    const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversionCount || 0), 0);
    const avgBounceRate = campaigns.length > 0 ? (campaigns.reduce((sum, c) => sum + (c.bounceRate || 0), 0) / campaigns.length).toFixed(1) : 0;

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
                            Campaign Management 📣
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Hey {firstName}! {activeCampaigns.length > 0
                                ? <>You have <span className="font-bold text-purple-600">{activeCampaigns.length} active campaign{activeCampaigns.length > 1 ? 's' : ''}</span> running.</>
                                : "No active campaigns — launch one to engage your audience!"}
                        </p>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button onClick={openCreateModal} className="btn-primary">
                            <Plus size={16} className="inline mr-2" />New Campaign
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Operational Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard title="Total Campaigns" value={campaigns.length} change={activeCampaigns.length > 0 ? `${activeCampaigns.length} active` : "No active"} icon={<Megaphone size={24} />} color="purple" />
                <StatCard title="Total Sent" value={totalSent.toLocaleString()} change={campaigns.length > 0 ? `Across ${campaigns.length} campaigns` : "No campaigns"} icon={<Mail size={24} />} color="blue" />
                <StatCard title="Open Rate" value={`${openRate}%`} change={totalSent > 0 ? `${totalOpened.toLocaleString()} opened` : "No data"} icon={<Eye size={24} />} color="green" />
                <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} change={totalOpened > 0 ? `${Math.round((totalClicks / totalOpened) * 100)}% click rate` : "No data"} icon={<MousePointer size={24} />} color="pink" />
                <StatCard title="Conversions" value={totalConversions} change="Total conversions" icon={<Target size={24} />} color="indigo" />
                <StatCard title="Bounce Rate" value={`${avgBounceRate}%`} change="Avg. bounce rate" icon={<div className="rotate-180"><ArrowUp size={24} /></div>} color="red" />
            </div>

            {/* Campaigns */}
            <div className="w-full glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Campaigns {campaigns.length > 0 && <span className="text-sm font-normal text-gray-500">({campaigns.length})</span>}
                    </h3>
                    <button onClick={openCreateModal} className="md:hidden btn-primary text-xs px-3 py-1.5">
                        <Plus size={14} className="inline mr-1" />New
                    </button>
                </div>

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
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm mb-4">
                            Create your first marketing campaign to start reaching your audience.
                        </p>
                        <button onClick={openCreateModal} className="btn-primary">
                            Launch Campaign
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {campaigns.map((campaign) => (
                            <div key={campaign.id} className={`group flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${activeDropdown === campaign.id ? 'z-20' : ''}`}>
                                <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => openViewModal(campaign)}>
                                    <div className={`p-2 rounded-lg flex-shrink-0 ${campaign.type === 'EMAIL' ? 'bg-blue-100 text-blue-600' :
                                        campaign.type === 'SOCIAL_MEDIA' ? 'bg-pink-100 text-pink-600' :
                                            campaign.type === 'WEBINAR' ? 'bg-green-100 text-green-600' :
                                                'bg-purple-100 text-purple-600'
                                        }`}>
                                        {typeIcon(campaign.type)}
                                    </div>
                                    <div className="min-w-0 cursor-pointer">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{campaign.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{campaign.type?.replace('_', ' ')} · {campaign.sentCount || 0} sent</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${campaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                        campaign.status === 'DRAFT' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300' :
                                            campaign.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                campaign.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                                        }`}>
                                        {campaign.status}
                                    </span>

                                    <div className="relative">
                                        <button onClick={(e) => toggleDropdown(campaign.id, e)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-all opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {activeDropdown === campaign.id && (
                                            <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-200">
                                                <button onClick={(e) => openViewModal(campaign, e)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                                    <Eye size={16} /> View Details
                                                </button>
                                                <button onClick={(e) => openEditModal(campaign, e)} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-2">
                                                    <Megaphone size={16} /> Edit Campaign
                                                </button>
                                                <button onClick={(e) => deleteCampaignHandler(campaign.id, e)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2">
                                                    <X size={16} /> Delete
                                                </button>
                                                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                                                <button onClick={(e) => openSimulateModal(campaign, e)} className="w-full text-left px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 flex items-center gap-2">
                                                    <Target size={16} /> Simulate Activity
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>




            {/* Create/Edit Campaign Modal */}
            {
                showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
                                </h2>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Campaign Name</label>
                                    <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Summer Sale 2024"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Campaign description..."
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all h-24 resize-none" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                        <select name="type" value={formData.type} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all">
                                            <option value="EMAIL">Email Blast</option>
                                            <option value="SOCIAL_MEDIA">Social Media</option>
                                            <option value="WEBINAR">Webinar</option>
                                            <option value="SMS">SMS Campaign</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all">
                                            <option value="DRAFT">Draft</option>
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                                        <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                                        <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Budget ($)</label>
                                        <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} placeholder="5000"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Goal</label>
                                        <input type="text" name="goal" value={formData.goal} onChange={handleInputChange} placeholder="e.g. 100 Leads"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Audience Size</label>
                                    <input type="number" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="e.g. 5000"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving}
                                        className="flex-[2] btn-primary px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50">
                                        {saving ? 'Saving...' : (isEditing ? 'Update Campaign' : 'Launch Campaign')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* View Campaign Modal */}
            {
                viewCampaign && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setViewCampaign(null)}></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-t-2xl">
                                <button onClick={() => setViewCampaign(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-white transition-colors">
                                    <X size={20} />
                                </button>
                                <div className="absolute -bottom-10 left-8 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
                                    {typeIcon(viewCampaign.type)}
                                </div>
                            </div>

                            <div className="pt-12 px-8 pb-8 space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{viewCampaign.name}</h2>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${viewCampaign.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {viewCampaign.status}
                                        </span>
                                        <span className="text-gray-400 text-sm">•</span>
                                        <span className="text-sm text-gray-500">{viewCampaign.type.replace('_', ' ')}</span>
                                    </div>
                                    {viewCampaign.description && (
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                                            {viewCampaign.description}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Budget</p>
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                                            <DollarSign size={16} className="text-green-500" />
                                            {viewCampaign.budget ? parseInt(viewCampaign.budget).toLocaleString() : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Goal</p>
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                                            <Target size={16} className="text-purple-500" />
                                            {viewCampaign.goal || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Audience</p>
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                                            <Users size={16} className="text-blue-500" />
                                            {viewCampaign.targetAudience ? viewCampaign.targetAudience.toLocaleString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <Calendar size={18} className="text-gray-400" />
                                        <span>
                                            {viewCampaign.startDate || 'No start date'} — {viewCampaign.endDate || 'No end date'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                        <CheckCircle size={18} className="text-blue-500" />
                                        <span>{viewCampaign.sentCount || 0} Messages Sent</span>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button onClick={() => openEditModal(viewCampaign)} className="flex-1 py-2.5 text-sm font-bold text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors">
                                        Edit Campaign
                                    </button>
                                    <button onClick={() => setViewCampaign(null)} className="flex-1 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Simulate Stats Modal */}
            {
                showSimulateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowSimulateModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Simulate Activity
                                </h2>
                                <button onClick={() => setShowSimulateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSimulateSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Sent</label>
                                    <input type="number" value={simulateData.sentCount} onChange={(e) => setSimulateData({ ...simulateData, sentCount: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Opened</label>
                                    <input type="number" value={simulateData.openCount} onChange={(e) => setSimulateData({ ...simulateData, openCount: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Clicks</label>
                                    <input type="number" value={simulateData.clickCount} onChange={(e) => setSimulateData({ ...simulateData, clickCount: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-purple-500 outline-none transition-all" />
                                </div>
                                <button type="submit" disabled={saving}
                                    className="w-full btn-primary px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50">
                                    {saving ? 'Updating...' : 'Update Stats'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
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
