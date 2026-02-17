import { useState, useEffect, useRef } from 'react';
import { getAllLeads, createLead, updateLead, deleteLead, createCustomer, updateLeadStatus, getLeadHistory, getUser } from '../../services/api';
import { Plus, Search, Filter, MoreVertical, Phone, Mail, X, Edit, Trash2, UserCheck, Eye, Clock, FileText, Activity, Upload, LayoutGrid, List, User, CheckSquare, Calendar, Star, Flame } from 'lucide-react';
import ImportWizard from '../../components/leads/ImportWizard';

const INITIAL_FORM = { name: '', email: '', phone: '', company: '', source: '', status: 'NEW', score: 0, notes: '' };
const INITIAL_CONVERT_FORM = { firstName: '', lastName: '', email: '', phone: '', company: '', status: 'ACTIVE', source: '' };

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    // Tabs & Filtering
    const [activeTab, setActiveTab] = useState('all'); // all, prospect, follow-up, interested, future-prospect
    const [quickFilter, setQuickFilter] = useState(null); // STARRED, ENGAGED

    // Modal & Form States
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);

    // Convert Modal State
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [convertForm, setConvertForm] = useState(INITIAL_CONVERT_FORM);

    // View Modal State
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewLead, setViewLead] = useState(null);
    const [leadHistory, setLeadHistory] = useState([]);

    // Import Modal State
    const [showImportWizard, setShowImportWizard] = useState(false);

    // Dropdown State
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 }); // Changed from left to right for better alignment
    const dropdownRef = useRef(null);
    const buttonRefs = useRef({}); // Store refs for each button

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchLeads = async () => {
        try {
            const data = await getAllLeads();
            setLeads(data);
        } catch (err) {
            console.error("Failed to fetch leads", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeads(); }, []);

    // --- Filter Logic ---
    // Tabs for Smart Views
    const tabs = [
        { id: 'all', label: 'All Leads', icon: List },
        { id: 'prospect', label: 'Prospect', icon: User },
        { id: 'follow-up', label: 'Follow-up', icon: Phone },
        { id: 'interested', label: 'Interested', icon: CheckSquare },
        { id: 'future-prospect', label: 'Future Prospect', icon: Calendar }
    ];

    const getFilteredLeads = () => {
        let result = [...leads]; // Start with a copy of all leads

        // Tab Filtering
        if (activeTab === 'prospect') result = result.filter(l => l.status === 'NEW' || l.stage === 'PROSPECT');
        if (activeTab === 'follow-up') result = result.filter(l => l.status === 'CONTACTED');
        if (activeTab === 'interested') result = result.filter(l => l.status === 'QUALIFIED');
        if (activeTab === 'future-prospect') result = result.filter(l => l.status === 'NURTURING');

        // 2. Quick Filters
        if (quickFilter === 'STARRED') {
            result = result.filter(l => l.isStarred); // Assuming isStarred exists or will be added
        } else if (quickFilter === 'ENGAGED') {
            result = result.filter(l => l.status === 'CONTACTED' || l.status === 'QUALIFIED');
        }

        return result;
    };

    const displayedLeads = getFilteredLeads();

    // Close dropdown when clicking outside
    // Close dropdown when clicking outside or scrolling
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Check if clicked on the toggle button itself (to allow toggling)
                const clickedButton = Object.values(buttonRefs.current).some(ref => ref && ref.contains(event.target));
                if (!clickedButton) {
                    setActiveDropdown(null);
                }
            }
        };

        const handleScroll = () => setActiveDropdown(null); // Close on scroll

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true); // Capture scroll events

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    const toggleDropdown = (e, leadId) => {
        e.stopPropagation();
        if (activeDropdown === leadId) {
            setActiveDropdown(null);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
            setActiveDropdown(leadId);
        }
    };

    // --- Form Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'score' ? parseInt(value) || 0 : value }));
    };

    const handleConvertChange = (e) => {
        const { name, value } = e.target;
        setConvertForm(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setForm(INITIAL_FORM);
        setIsEditing(false);
        setSelectedLeadId(null);
        setError('');
        setShowModal(true);
    };

    const openEditModal = (lead) => {
        setForm(lead);
        setIsEditing(true);
        setSelectedLeadId(lead.id);
        setError('');
        setShowModal(true);
        setActiveDropdown(null);
    };

    const openConvertModal = (lead) => {
        // Split name into First/Last
        const nameParts = lead.name ? lead.name.split(' ') : [''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setConvertForm({
            firstName,
            lastName,
            email: lead.email || '',
            phone: lead.phone || '',
            company: lead.company || '',
            status: 'ACTIVE',
            source: lead.source || 'LEAD_CONVERSION'
        });
        setSelectedLeadId(lead.id); // Track which lead is being converted
        setError('');
        setShowConvertModal(true);
        setActiveDropdown(null);
    };

    const openViewModal = async (lead) => {
        setViewLead(lead);
        setShowViewModal(true);
        setActiveDropdown(null);
        setLoading(true); // Reuse loading state or add specific one? safe to reuse if careful
        try {
            const history = await getLeadHistory(lead.id);
            setLeadHistory(history);
        } catch (err) {
            console.error("Failed to fetch history", err);
            setLeadHistory([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Action Handlers ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Lead name is required'); return; }
        setError('');
        setSaving(true);
        try {
            // Prepare clean payload (remove extra fields like createdAt, id, etc.)
            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                company: form.company,
                source: form.source,
                status: form.status,
                score: form.score,
                notes: form.notes
            };

            if (isEditing) {
                await updateLead(selectedLeadId, payload);
            } else {
                await createLead(payload);
            }
            setShowModal(false);
            setForm(INITIAL_FORM);
            await fetchLeads();
        } catch (err) {
            // Log full error for debugging
            console.error("Save lead error:", err);
            setError(err.response?.data?.message || 'Failed to save lead. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleConvertSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            // 1. Create Customer
            await createCustomer(convertForm);
            // 2. Update Lead Status
            await updateLeadStatus(selectedLeadId, 'CONVERTED');

            setShowConvertModal(false);
            await fetchLeads();
            // Optional: Show success toast
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to convert lead.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                await deleteLead(id);
                fetchLeads();
            } catch (err) {
                console.error("Failed to delete lead", err);
            }
        }
        setActiveDropdown(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Leads</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your potential customers.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowImportWizard(true)} className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-200">
                        <Upload size={18} />
                        Import
                    </button>
                    <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Add Lead
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6">
                        <Search size={48} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Leads Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                        Your leads list is empty. Add your first lead to start tracking potential customers and sales opportunities.
                    </p>
                    <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-6 py-3">
                        <Plus size={20} />
                        Add First Lead
                    </button>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl mb-4 self-start">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-white dark:bg-card text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4 bg-white dark:bg-card p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                        <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <Filter size={20} />
                        </button>
                    </div>

                    {/* Leads List */}
                    <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Company</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Score</th>
                                        <th className="px-6 py-4 font-medium">Source</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                        {lead.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
                                                        <div className="text-xs text-gray-500">{lead.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{lead.company || '—'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${lead.status === 'NEW' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    lead.status === 'QUALIFIED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                        lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                            lead.status === 'CONVERTED' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
                                                    }`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                        <div className={`h-2 rounded-full ${lead.score >= 70 ? 'bg-green-500' :
                                                            lead.score >= 40 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`} style={{ width: `${lead.score || 0}%` }}></div>
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{lead.score || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{lead.source || '—'}</td>
                                            <td className="px-6 py-4 text-right relative">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                        <Phone size={16} />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                        <Mail size={16} />
                                                    </button>

                                                    {/* Actions Dropdown Button */}
                                                    <button
                                                        ref={el => buttonRefs.current[lead.id] = el}
                                                        onClick={(e) => toggleDropdown(e, lead.id)}
                                                        className={`p-2 rounded-lg transition-colors ${activeDropdown === lead.id ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Fixed Dropdown Menu (Portal-like) */}
            {activeDropdown && (
                <div
                    ref={dropdownRef}
                    className="fixed z-[100] w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-200"
                    style={{ top: dropdownPosition.top, right: dropdownPosition.right }}
                >
                    <button onClick={() => openViewModal(leads.find(l => l.id === activeDropdown))} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                        <Eye size={16} /> View Details
                    </button>
                    <button onClick={() => openEditModal(leads.find(l => l.id === activeDropdown))} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-2">
                        <Edit size={16} /> Edit Lead
                    </button>
                    {leads.find(l => l.id === activeDropdown)?.status !== 'CONVERTED' && (
                        <button onClick={() => openConvertModal(leads.find(l => l.id === activeDropdown))} className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 flex items-center gap-2">
                            <UserCheck size={16} /> Convert to Customer
                        </button>
                    )}
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                    <button onClick={() => handleDelete(activeDropdown)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2">
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            )}

            {/* View Lead Modal */}
            {showViewModal && viewLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                                    {viewLead.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{viewLead.name}</h2>
                                    <p className="text-sm text-gray-500">{viewLead.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Status</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{viewLead.status}</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Score</div>
                                    <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${viewLead.score >= 70 ? 'bg-green-500' : viewLead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        {viewLead.score}
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Source</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{viewLead.source}</div>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    <div className="text-sm text-gray-500 mb-1">Company</div>
                                    <div className="font-semibold text-gray-900 dark:text-white">{viewLead.company || '—'}</div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <UserCheck size={18} /> Contact Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">Phone</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{viewLead.phone || '—'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                                        <span className="text-gray-500">Email</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{viewLead.email || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FileText size={18} /> Current Notes
                                </h3>
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/20 rounded-xl text-sm text-gray-700 dark:text-gray-300 min-h-[80px]">
                                    {viewLead.notes || 'No notes available.'}
                                </div>
                            </div>

                            {/* History Timeline */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Clock size={18} /> Activity History
                                </h3>
                                {leadHistory.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                                        No history recorded yet.
                                    </div>
                                ) : (
                                    <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-800 space-y-6">
                                        {leadHistory.map((item, index) => (
                                            <div key={index} className="relative">
                                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-white dark:ring-gray-900"></div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                                                        {new Date(item.changedAt).toLocaleString()}
                                                    </span>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {item.fieldChanged === 'STATUS' && `Status changed from ${item.oldValue} to ${item.newValue}`}
                                                        {item.fieldChanged === 'SCORE' && `Score updated from ${item.oldValue} to ${item.newValue}`}
                                                        {item.fieldChanged === 'NOTE' && 'Notes updated'}
                                                        {!['STATUS', 'SCORE', 'NOTE'].includes(item.fieldChanged) && `${item.fieldChanged} changed`}
                                                    </div>
                                                    {item.fieldChanged === 'NOTE' && (
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1 border border-gray-100 dark:border-gray-700">
                                                            <div className="line-through opacity-60 mb-1">{item.oldValue || '(empty)'}</div>
                                                            <div className="font-medium text-green-600 dark:text-green-400">{item.newValue}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
                            <button onClick={() => setShowViewModal(false)} className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Lead Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                <input name="name" value={form.name} onChange={handleChange} required
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="e.g. John Smith" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                        placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                        placeholder="+1 234 567 890" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                                <input name="company" value={form.company} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="Acme Inc." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                                    <select name="source" value={form.source} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                                        <option value="">Select source</option>
                                        <option value="WEBSITE">Website</option>
                                        <option value="REFERRAL">Referral</option>
                                        <option value="SOCIAL_MEDIA">Social Media</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="COLD_CALL">Cold Call</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select name="status" value={form.status} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                                        <option value="NEW">New</option>
                                        <option value="CONTACTED">Contacted</option>
                                        <option value="QUALIFIED">Qualified</option>
                                        <option value="UNQUALIFIED">Unqualified</option>
                                        <option value="CONVERTED">Converted</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Score (0–100)</label>
                                <input name="score" type="number" min="0" max="100" value={form.score} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                                    placeholder="Any additional notes..." />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    {saving ? (
                                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
                                    ) : (
                                        <>{isEditing ? 'Update Lead' : 'Add Lead'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Import Wizard */}
            {showImportWizard && (
                <ImportWizard
                    onClose={() => setShowImportWizard(false)}
                    onComplete={() => {
                        setShowImportWizard(false);
                        fetchLeads();
                    }}
                />
            )}

            {/* Convert to Customer Modal */}
            {showConvertModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowConvertModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Convert to Customer</h2>
                            <button onClick={() => setShowConvertModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleConvertSubmit} className="p-6 space-y-4">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Confirm the details below to convert this lead into a new customer. The lead status will be updated to <b>CONVERTED</b>.
                            </p>

                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                                    <input name="firstName" value={convertForm.firstName} onChange={handleConvertChange} required
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                    <input name="lastName" value={convertForm.lastName} onChange={handleConvertChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input name="email" type="email" value={convertForm.email} onChange={handleConvertChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input name="phone" value={convertForm.phone} onChange={handleConvertChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                                <input name="company" value={convertForm.company} onChange={handleConvertChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <button type="button" onClick={() => setShowConvertModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="btn-primary px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-green-600 hover:bg-green-700 border-green-600">
                                    {saving ? (
                                        <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Converting...</>
                                    ) : (
                                        <><UserCheck size={16} /> Confirm & Convert</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
