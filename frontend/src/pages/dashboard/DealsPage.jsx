import { useState, useEffect } from 'react';
import { getAllDeals, createDeal, updateDeal, deleteDeal, getAllCustomers, createCustomer } from '../../services/api';
import { Plus, Briefcase, X, DollarSign, Calendar, Building, Search, LayoutGrid, List as ListIcon, MoreHorizontal, User, Phone, Mail, Link as LinkIcon } from 'lucide-react';
import DealStats from './DealStats';
import { PipelineChart, RevenueChart } from './DealCharts';

const COLUMNS = {
    NEW: { id: 'NEW', title: 'New', color: 'bg-blue-500', light: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
    QUALIFIED: { id: 'QUALIFIED', title: 'Qualified', color: 'bg-yellow-500', light: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-700 dark:text-yellow-300' },
    PROPOSAL: { id: 'PROPOSAL', title: 'Proposal', color: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300' },
    NEGOTIATION: { id: 'NEGOTIATION', title: 'Negotiation', color: 'bg-purple-500', light: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300' },
    CLOSED_WON: { id: 'CLOSED_WON', title: 'Closed Won', color: 'bg-green-500', light: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-300' },
    CLOSED_LOST: { id: 'CLOSED_LOST', title: 'Closed Lost', color: 'bg-red-500', light: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-300' },
};

export default function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [viewMode, setViewMode] = useState('kanban');
    const [searchQuery, setSearchQuery] = useState('');

    const [customerMode, setCustomerMode] = useState('select'); // 'select' or 'create'
    const [newCustomer, setNewCustomer] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: ''
    });

    const [form, setForm] = useState({
        title: '',
        description: '',
        value: '',
        stage: 'NEW',
        priority: 'MEDIUM',
        expectedCloseDate: '',
        type: 'NEW_BUSINESS',
        leadSource: '',
        nextStep: '',
        probability: '',
        campaignSource: '',
        customerId: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Actions State
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [viewDeal, setViewDeal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDealId, setSelectedDealId] = useState(null);

    const toggleDropdown = (dealId, e) => {
        e.stopPropagation();
        if (activeDropdown === dealId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(dealId);
        }
    };

    const openViewModal = (deal) => {
        setViewDeal(deal);
        setActiveDropdown(null);
    };

    const openEditModal = (deal) => {
        setForm({
            title: deal.title,
            description: deal.description || '',
            value: deal.value,
            stage: deal.stage,
            priority: deal.priority,
            expectedCloseDate: deal.expectedCloseDate || '',
            type: deal.type || 'NEW_BUSINESS',
            leadSource: deal.leadSource || '',
            nextStep: deal.nextStep || '',
            probability: deal.probability || '',
            campaignSource: deal.campaignSource || '',
            customerId: deal.customer ? deal.customer.id : (deal.customerId || '')
        });
        setIsEditing(true);
        setSelectedDealId(deal.id);
        setCustomerMode('select'); // Default to select mode for editing
        setShowModal(true);
        setActiveDropdown(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this deal?')) {
            try {
                await deleteDeal(id);
                // Refresh
                const dealsData = await getAllDeals();
                setDeals(dealsData);
            } catch (err) {
                console.error("Failed to delete deal", err);
                alert('Failed to delete deal');
            }
        }
        setActiveDropdown(null);
    };

    const openCreateModal = () => {
        setForm({
            title: '',
            description: '',
            value: '',
            stage: 'NEW',
            priority: 'MEDIUM',
            expectedCloseDate: '',
            type: 'NEW_BUSINESS',
            leadSource: '',
            nextStep: '',
            probability: '',
            campaignSource: '',
            customerId: ''
        });
        setIsEditing(false);
        setSelectedDealId(null);
        setCustomerMode('select');
        setShowModal(true);
    };

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const [dealsData, customersData] = await Promise.all([
                    getAllDeals(),
                    getAllCustomers()
                ]);
                setDeals(dealsData);
                setCustomers(customersData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            let finalCustomerId = form.customerId;

            // If creating a new customer, do that first
            if (customerMode === 'create') {
                const customerData = await createCustomer(newCustomer);
                finalCustomerId = customerData.id;
                // Refresh customer list so it appears next time
                const updatedCustomers = await getAllCustomers();
                setCustomers(updatedCustomers);
            }

            if (!finalCustomerId) {
                throw new Error("Please select or create a customer.");
            }

            if (isEditing) {
                await updateDeal(selectedDealId, { ...form, customerId: finalCustomerId });
            } else {
                await createDeal({ ...form, customerId: finalCustomerId });
            }

            setShowModal(false);
            const data = await getAllDeals();
            setDeals(data);

            // Reset forms
            setForm({
                title: '',
                description: '',
                value: '',
                stage: 'NEW',
                priority: 'MEDIUM',
                expectedCloseDate: '',
                customerId: ''
            });
            setNewCustomer({ firstName: '', lastName: '', email: '', phone: '', company: '' });
            setCustomerMode('select');

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to create deal.');
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (value) => {
        if (!value) return '$0';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    const filteredDeals = deals.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deal.description && deal.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getDealsByStage = (stage) => filteredDeals.filter(d => d.stage === stage);

    // Split COLUMNS into two rows
    const columnsArray = Object.values(COLUMNS);
    const firstRowColumns = columnsArray.slice(0, 3);
    const secondRowColumns = columnsArray.slice(3, 6);

    const KanbanRow = ({ columns }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => {
                const columnDeals = getDealsByStage(column.id);
                const totalValue = columnDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);

                return (
                    <div key={column.id} className="flex flex-col h-full">
                        {/* Column Header */}
                        <div className="mb-4">
                            <div className={`flex items-center justify-between mb-2 px-1`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${column.color} shadow-sm`}></div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">{column.title}</h3>
                                </div>
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">
                                    {columnDeals.length}
                                </span>
                            </div>
                            <div className={`h-1 w-full rounded-full ${column.light.replace('bg-', 'bg-gradient-to-r from-transparent via-')}`}></div>
                            <div className="flex justify-between items-center px-1 mt-1">
                                <span className="text-[10px] text-gray-400 font-medium">TOTAL VALUE</span>
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatCurrency(totalValue)}</span>
                            </div>
                        </div>

                        {/* Deals List */}
                        <div className="space-y-3 flex-1 min-h-[150px] bg-gray-50/30 dark:bg-gray-800/20 rounded-xl p-2">
                            {columnDeals.map((deal) => (
                                <div key={deal.id} className="group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer relative">
                                    <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${deal.priority === 'HIGH' ? 'bg-red-500' : deal.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-300'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                                    <div className="flex justify-between items-start mb-3 relative">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-relaxed pr-6 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {deal.title}
                                        </h4>
                                        <button onClick={(e) => toggleDropdown(deal.id, e)} className="text-gray-300 hover:text-gray-500 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <MoreHorizontal size={16} />
                                        </button>

                                        {activeDropdown === deal.id && (
                                            <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-200">
                                                <button onClick={() => openViewModal(deal)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                                    <Briefcase size={16} /> View Details
                                                </button>
                                                <button onClick={() => openEditModal(deal)} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-2">
                                                    <LayoutGrid size={16} /> Edit Deal
                                                </button>
                                                <button onClick={() => handleDelete(deal.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2">
                                                    <X size={16} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {deal.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{deal.description}</p>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-400 font-medium mb-0.5">VALUE</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(deal.value)}</span>
                                        </div>
                                        {deal.expectedCloseDate && (
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] text-gray-400 font-medium mb-0.5">CLOSING</span>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                                                    <Calendar size={10} />
                                                    <span className="font-medium">{deal.expectedCloseDate}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {columnDeals.length === 0 && (
                                <div className="h-32 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 text-xs font-medium bg-white dark:bg-gray-800">
                                    <Briefcase size={24} className="mb-2 opacity-50" />
                                    <span>No Deals</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Deals & Pipeline</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your sales opportunities and track revenue.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                    <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-5 py-2.5 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-shadow">
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="font-semibold">Add Deal</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500 font-medium">Loading pipeline...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* LINE 1: Stats */}
                    <div className="grid grid-cols-1">
                        <DealStats deals={deals} />
                    </div>

                    {/* LINE 2: Pipeline Chart */}
                    <div className="grid grid-cols-1">
                        <PipelineChart deals={deals} />
                    </div>

                    {/* LINE 3: Revenue Chart */}
                    <div className="grid grid-cols-1">
                        <RevenueChart deals={deals} />
                    </div>

                    {/* Controls for Board */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Briefcase size={20} className="text-indigo-500" />
                            {viewMode === 'kanban' ? 'Pipeline Board' : 'All Deals'}
                        </h2>
                        <div className="relative w-full sm:w-72 group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search pipeline..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* LINE 4 & 5: Kanban Rows (if in Kanban mode) */}
                    {viewMode === 'kanban' ? (
                        <div className="space-y-8">
                            {/* Line 4 */}
                            <KanbanRow columns={firstRowColumns} />

                            {/* Line 5 */}
                            <KanbanRow columns={secondRowColumns} />
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Close Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {filteredDeals.map((deal) => (
                                            <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900 dark:text-white">{deal.title}</div>
                                                    {deal.description && <div className="text-xs text-gray-500 truncate max-w-[200px]">{deal.description}</div>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${COLUMNS[deal.stage]
                                                        ? `${COLUMNS[deal.stage].light.replace('bg-', 'bg-opacity-50 ')} ${COLUMNS[deal.stage].text} border-${COLUMNS[deal.stage].color.replace('bg-', '')}/20`
                                                        : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {COLUMNS[deal.stage]?.title || deal.stage}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(deal.value)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                    {deal.expectedCloseDate || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${deal.priority === 'HIGH' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                                        deal.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                            'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}>
                                                        {deal.priority || 'MEDIUM'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right relative">
                                                    <button onClick={(e) => toggleDropdown(deal.id, e)} className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        <MoreHorizontal size={18} />
                                                    </button>

                                                    {activeDropdown === deal.id && (
                                                        <div className="absolute right-8 top-8 z-50 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-200 text-left">
                                                            <button onClick={() => openViewModal(deal)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                                                <Briefcase size={16} /> View Details
                                                            </button>
                                                            <button onClick={() => openEditModal(deal)} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-2">
                                                                <LayoutGrid size={16} /> Edit Deal
                                                            </button>
                                                            <button onClick={() => handleDelete(deal.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2">
                                                                <X size={16} /> Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredDeals.length === 0 && (
                                <div className="p-12 text-center text-gray-400 text-sm">No deals found matching your search.</div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Deal' : 'New Opportunity'}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{isEditing ? 'Update deal details' : 'Add a deal to your pipeline'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl text-red-700 dark:text-red-300 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            {/* 1. Customer Section (Top Priority as requested) */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Customer Connection</label>

                                <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 p-1 rounded-lg mb-4 w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setCustomerMode('select')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${customerMode === 'select' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                                    >
                                        <LinkIcon size={14} /> Link Existing
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCustomerMode('create')}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${customerMode === 'create' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                                    >
                                        <Plus size={14} /> Create New
                                    </button>
                                </div>

                                {customerMode === 'select' ? (
                                    <div className="relative">
                                        <Building size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                        <select name="customerId" value={form.customerId} onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium appearance-none">
                                            <option value="">Select Customer to Link...</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} • {c.company}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 mb-1"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input name="firstName" placeholder="First Name" value={newCustomer.firstName} onChange={handleCustomerChange} required
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-transparent focus:border-indigo-500 outline-none text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input name="lastName" placeholder="Last Name" value={newCustomer.lastName} onChange={handleCustomerChange} required
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-transparent focus:border-indigo-500 outline-none text-sm" />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="relative">
                                                <Building size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input name="company" placeholder="Company Name" value={newCustomer.company} onChange={handleCustomerChange} required
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-transparent focus:border-indigo-500 outline-none text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input name="email" type="email" placeholder="Email" value={newCustomer.email} onChange={handleCustomerChange} required
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-transparent focus:border-indigo-500 outline-none text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input name="phone" placeholder="Phone" value={newCustomer.phone} onChange={handleCustomerChange}
                                                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-transparent focus:border-indigo-500 outline-none text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. Deal Details */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Deal Title</label>
                                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Q3 Software License - ACME Corp"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Deal Value</label>
                                    <div className="relative">
                                        <DollarSign size={18} className="absolute left-4 top-3.5 text-gray-400" />
                                        <input name="value" type="number" value={form.value} onChange={handleChange} required placeholder="0.00"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Date</label>
                                    <input name="expectedCloseDate" type="date" value={form.expectedCloseDate} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                </div>
                            </div>
                            {/* Removed old Customer Section placement */}

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Stage</label>
                                    <div className="relative">
                                        <select name="stage" value={form.stage} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium appearance-none">
                                            {Object.values(COLUMNS).map(col => (
                                                <option key={col.id} value={col.id}>{col.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Probability (%)</label>
                                    <input name="probability" type="number" min="0" max="100" value={form.probability} onChange={handleChange} placeholder="50"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                    <select name="type" value={form.type} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium">
                                        <option value="NEW_BUSINESS">New Business</option>
                                        <option value="EXISTING_BUSINESS">Existing Business</option>
                                        <option value="RENEWAL">Renewal</option>
                                        <option value="UPSELL">Upsell</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Source</label>
                                    <select name="leadSource" value={form.leadSource} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium">
                                        <option value="">Select Source</option>
                                        <option value="WEBSITE">Website</option>
                                        <option value="REFERRAL">Referral</option>
                                        <option value="SOCIAL_MEDIA">Social Media</option>
                                        <option value="EMAIL">Email</option>
                                        <option value="COLD_CALL">Cold Call</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Next Step</label>
                                    <input name="nextStep" value={form.nextStep} onChange={handleChange} placeholder="Call to schedule demo"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Campaign</label>
                                    <input name="campaignSource" value={form.campaignSource} onChange={handleChange} placeholder="Summer Sale"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                                    <div className="relative">
                                        <select name="priority" value={form.priority} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white font-medium appearance-none">
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Key details about this deal..."
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium resize-none" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-[2] btn-primary px-6 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {saving ? (isEditing ? 'Updating...' : 'Creating Deal...') : (isEditing ? 'Update Deal' : 'Create Deal')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* View Deal Modal */}
            {
                viewDeal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setViewDeal(null)}></div>
                        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Deal Details</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Viewing opportunity information</p>
                                </div>
                                <button onClick={() => setViewDeal(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{viewDeal.title}</h3>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${COLUMNS[viewDeal.stage] ? `${COLUMNS[viewDeal.stage].light} ${COLUMNS[viewDeal.stage].text} border-${COLUMNS[viewDeal.stage].color.replace('bg-', '')}/20` : 'bg-gray-100'}`}>
                                                {COLUMNS[viewDeal.stage]?.title || viewDeal.stage}
                                            </span>
                                            <span className="text-gray-400 text-sm">•</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Calendar size={14} /> {viewDeal.expectedCloseDate}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Value</p>
                                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(viewDeal.value)}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Deal Info</div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Type</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{viewDeal.type?.replace('_', ' ') || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Source</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{viewDeal.leadSource?.replace('_', ' ') || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Campaign</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{viewDeal.campaignSource || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pipeline Data</div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Probability</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{viewDeal.probability ? `${viewDeal.probability}%` : '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Next Step</span>
                                                <span className="font-medium text-gray-900 dark:text-white text-right truncate max-w-[120px]" title={viewDeal.nextStep}>{viewDeal.nextStep || '-'}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Priority</span>
                                                <span className={`font-bold text-xs px-2 py-0.5 rounded ${viewDeal.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{viewDeal.priority}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Customer Connection</label>
                                    {(() => {
                                        const customer = customers.find(c => c.id === viewDeal.customerId) || viewDeal.customer;
                                        return customer ? (
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
                                                    {customer.firstName ? customer.firstName.charAt(0).toUpperCase() : <User size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-base">{customer.firstName} {customer.lastName}</h4>
                                                    <p className="text-xs text-gray-500 font-medium mb-3">{customer.company}</p>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                                            <Mail size={14} className="text-indigo-500" />
                                                            <span className="truncate">{customer.email}</span>
                                                        </div>
                                                        {customer.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                                                <Phone size={14} className="text-indigo-500" />
                                                                <span>{customer.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 font-bold">
                                                    <Building size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Unknown Customer</p>
                                                    <p className="text-xs text-gray-500">ID: {viewDeal.customerId}</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Description</label>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                        {viewDeal.description || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="flex justify-end pt-4 gap-3">
                                    <button onClick={() => { setViewDeal(null); openEditModal(viewDeal); }} className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors">
                                        Edit Deal
                                    </button>
                                    <button onClick={() => setViewDeal(null)} className="btn-primary px-6 py-2">
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
