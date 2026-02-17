import { useState, useEffect } from 'react';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer, getDealsByCustomer, createDeal, getTicketsByCustomer, getNotesByCustomer, createNote, deleteNote, getActivitiesByCustomer, getUser, getAllUsers } from '../../services/api';
import { Search, Filter, MoreHorizontal, Building, MapPin, Plus, Users, Mail, X, Phone, Edit, Trash2, Eye, DollarSign, Calendar, Briefcase, ArrowRight, Headphones, AlertCircle, CheckCircle, Clock, StickyNote, Send, Activity, Trash } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', address: '', city: '', state: '', country: '', status: 'ACTIVE', source: '', assignedTo: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [salesReps, setSalesReps] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (user && (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MARKETING') || user.roles.includes('ROLE_SALES'))) {
                try {
                    const allUsers = await getAllUsers(user.companyId);
                    const reps = allUsers.filter(u => u.roles && u.roles.includes('ROLE_SALES'));
                    setSalesReps(reps);
                } catch (err) {
                    console.error("Failed to fetch users", err);
                }
            }
        };
        fetchUsers();
    }, []);

    // Permission Check
    const user = getUser();
    console.log("Current User:", user);
    console.log("Permissions:", user?.permissions);

    // Check if user has explicit permission OR is Admin
    const canEdit = user?.permissions?.includes('WRITE_CUSTOMERS') || user?.roles?.includes('ROLE_ADMIN');
    const canDelete = user?.permissions?.includes('DELETE_CUSTOMERS') || user?.roles?.includes('ROLE_ADMIN');


    const [viewCustomer, setViewCustomer] = useState(null);
    const [customerDeals, setCustomerDeals] = useState([]);
    const [loadingDeals, setLoadingDeals] = useState(false);
    const [isAddingDeal, setIsAddingDeal] = useState(false);
    const [newDeal, setNewDeal] = useState({ title: '', value: '', expectedCloseDate: '' });

    const [customerTickets, setCustomerTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);

    const [notes, setNotes] = useState([]);
    const [activities, setActivities] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [activeTab, setActiveTab] = useState('details'); // details, notes, activity

    const toggleDropdown = (customerId) => {
        if (activeDropdown === customerId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(customerId);
        }
    };

    const openViewModal = async (customer) => {
        setViewCustomer(customer);
        setActiveDropdown(null);
        setLoadingDeals(true);
        setLoadingTickets(true);
        setIsAddingDeal(false);
        setActiveTab('details'); // Reset tab
        try {
            const [deals, tickets, fetchedNotes, fetchedActivities] = await Promise.all([
                getDealsByCustomer(customer.id),
                getTicketsByCustomer(customer.id),
                getNotesByCustomer(customer.id),
                getActivitiesByCustomer(customer.id)
            ]);
            console.log("Fetched Notes:", fetchedNotes);
            console.log("Fetched Activities:", fetchedActivities);
            setCustomerDeals(deals);
            setCustomerTickets(tickets);
            setNotes(fetchedNotes);
            setActivities(fetchedActivities);
        } catch (err) {
            console.error("Failed to fetch customer data", err);
            setCustomerDeals([]);
            setCustomerTickets([]);
            setNotes([]);
            setActivities([]);
        } finally {
            setLoadingDeals(false);
            setLoadingTickets(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        try {
            const note = await createNote({ content: newNote, customerId: viewCustomer.id });
            setNotes([note, ...notes]);
            setNewNote('');
        } catch (error) {
            console.error("Failed to add note", error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Delete this note?')) {
            try {
                await deleteNote(noteId);
                setNotes(notes.filter(n => n.id !== noteId));
            } catch (error) {
                console.error("Failed to delete note", error);
            }
        }
    };

    const handleDealSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await createDeal({
                ...newDeal,
                customerId: viewCustomer.id,
                stage: 'PROSPECTING',
                priority: 'MEDIUM',
                description: `Created from Customer View for ${viewCustomer.firstName} ${viewCustomer.lastName}`
            });
            // Refresh deals
            const deals = await getDealsByCustomer(viewCustomer.id);
            setCustomerDeals(deals);
            setIsAddingDeal(false);
            setNewDeal({ title: '', value: '', expectedCloseDate: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to add deal');
        } finally {
            setSaving(false);
        }
    };

    const openEditModal = (customer) => {
        setForm({
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            company: customer.company || '',
            jobTitle: customer.jobTitle || '',
            address: customer.address || '',
            city: customer.city || '',
            state: customer.state || '',
            country: customer.country || '',
            status: customer.status || 'ACTIVE',
            status: customer.status || 'ACTIVE',
            source: customer.source || '',
            assignedTo: customer.assignedTo || ''
        });
        setIsEditing(true);
        setSelectedCustomerId(customer.id);
        setError('');
        setShowModal(true);
        setActiveDropdown(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                fetchCustomers();
            } catch (err) {
                console.error("Failed to delete customer", err);
            }
        }
        setActiveDropdown(null);
    };

    const fetchCustomers = async () => {
        try {
            const data = await getAllCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Deep Linking Handler
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const viewId = params.get('viewId');
        if (viewId && customers.length > 0) {
            const customerToView = customers.find(c => c.id === parseInt(viewId));
            if (customerToView) {
                openViewModal(customerToView);
                // Clean up URL without reload
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [customers, location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setForm({ firstName: '', lastName: '', email: '', phone: '', company: '', jobTitle: '', address: '', city: '', state: '', country: '', status: 'ACTIVE', source: '', assignedTo: '' });
        setIsEditing(false);
        setSelectedCustomerId(null);
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (isEditing) {
                await updateCustomer(selectedCustomerId, { ...form, assignedTo: form.assignedTo || user.id });
            } else {
                await createCustomer({ ...form, assignedTo: form.assignedTo || user.id });
            }
            setShowModal(false);
            fetchCustomers();
        } catch (err) {
            console.error(err);
            setError('Failed to save customer.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customers</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your customer base.</p>
                </div>
                <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Customer
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : customers.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-full mb-6">
                        <Users size={48} className="text-purple-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Customers Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                        You don't have any customers yet. Convert leads to customers or add them manually.
                    </p>
                    <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 px-6 py-3">
                        <Plus size={20} />
                        Add Customer
                    </button>
                </div>
            ) : (
                /* Customer Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map((customer) => (
                        <div key={customer.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {(customer.firstName || '?').charAt(0).toUpperCase()}
                                </div>
                                <div className="relative">
                                    <button onClick={() => toggleDropdown(customer.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>

                                    {activeDropdown === customer.id && (
                                        <div className="absolute right-0 top-8 z-10 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 animate-in fade-in zoom-in-95 duration-200">
                                            <button onClick={() => openViewModal(customer)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                                                <Eye size={16} /> View Details
                                            </button>
                                            {canEdit && (
                                                <button onClick={() => openEditModal(customer)} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center gap-2">
                                                    <Edit size={16} /> Edit Customer
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => handleDelete(customer.id)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2">
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {customer.firstName} {customer.lastName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-2 gap-2">
                                <Building size={14} />
                                {customer.company || 'No company'}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
                                <Mail size={14} />
                                {customer.email || 'No email'}
                            </div>

                            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${customer.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                        customer.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {customer.status}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Location</span>
                                    <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                        <MapPin size={12} /> {[customer.city, customer.country].filter(Boolean).join(', ') || '—'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Source</span>
                                    <span className="text-gray-700 dark:text-gray-300">{customer.source || '—'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Customer Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                                    <input name="firstName" value={form.firstName} onChange={handleChange} required
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                    <input name="lastName" value={form.lastName} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input name="phone" value={form.phone} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                                    <input name="company" value={form.company} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                                    <input name="jobTitle" value={form.jobTitle} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                <input name="address" value={form.address} onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                    <input name="city" value={form.city} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                    <input name="state" value={form.state} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                    <input name="country" value={form.country} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select name="status" value={form.status} onChange={handleChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white">
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                    </select>
                                </div>
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
                                        <option value="LEAD_CONVERSION">Lead Conversion</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Assignment Section (Copied from Leads) */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Assignment</label>

                                {(user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_MARKETING')) ? (
                                    // Admin/Marketing View: Simple Dropdown
                                    <div>
                                        <select
                                            name="assignedTo"
                                            value={form.assignedTo || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white"
                                        >
                                            <option value={user.id}>Assign to Me ({user.fullName})</option>
                                            {salesReps.filter(rep => rep.id !== user.id).map(rep => (
                                                <option key={rep.id} value={rep.id}>{rep.fullName} (Sales)</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    // Sales View: "Assign to Me" vs "Another"
                                    <div className="space-y-3">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="assignmentType"
                                                        checked={!form.assignedTo || form.assignedTo === user.id}
                                                        onChange={() => setForm(prev => ({ ...prev, assignedTo: user.id }))}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Assign to Me</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="assignmentType"
                                                        checked={form.assignedTo && form.assignedTo !== user.id}
                                                        onChange={() => setForm(prev => ({ ...prev, assignedTo: salesReps.length > 0 ? salesReps[0].id : '' }))}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">Assign to Another</span>
                                                </label>
                                            </div>
                                            {/* Feedback for 'Assign to Me' */}
                                            {(!form.assignedTo || form.assignedTo === user.id) && isEditing && customers.find(c => c.id === selectedCustomerId)?.assignedTo === user.id && (
                                                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                                    ✓ Already assigned to you
                                                </div>
                                            )}
                                        </div>

                                        {form.assignedTo && form.assignedTo !== user.id && (
                                            <div>
                                                <select
                                                    name="assignedTo"
                                                    value={form.assignedTo || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white"
                                                >
                                                    <option value="">Select Sales Rep</option>
                                                    {salesReps.filter(rep => rep.id !== user.id).map(rep => (
                                                        <option key={rep.id} value={rep.id}>{rep.fullName}</option>
                                                    ))}
                                                </select>
                                                {/* Feedback for 'Assign to Another' */}
                                                {isEditing && form.assignedTo === customers.find(c => c.id === selectedCustomerId)?.assignedTo && (
                                                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                                                        ✓ Already assigned to this user
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
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
                                        <>{isEditing ? 'Update Customer' : 'Add Customer'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Customer Modal */}
            {viewCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewCustomer(null)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Details</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Viewing information for {viewCustomer.firstName} {viewCustomer.lastName}</p>
                            </div>
                            <button onClick={() => setViewCustomer(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
                            <button
                                onClick={() => setActiveTab('details')}
                                className={`mr-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`mr-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Notes
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Activity
                            </button>
                        </div>

                        <div className="p-6">
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                            {(viewCustomer.firstName || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{viewCustomer.firstName} {viewCustomer.lastName}</h3>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                                                <Building size={14} />
                                                <span>{viewCustomer.company || 'No company'}</span>
                                            </div>
                                        </div>
                                        <div className="ml-auto">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${viewCustomer.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                viewCustomer.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {viewCustomer.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</label>
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Mail size={16} className="text-gray-400" />
                                                <span>{viewCustomer.email || '—'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Phone size={16} className="text-gray-400" />
                                                <span>{viewCustomer.phone || '—'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</label>
                                            <div className="text-gray-700 dark:text-gray-300">
                                                <span className="block font-medium">{viewCustomer.jobTitle || 'No Job Title'}</span>
                                                <span className="text-sm text-gray-500">{viewCustomer.company}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
                                        <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                            <MapPin size={18} className="text-gray-400 mt-0.5" />
                                            <div>
                                                <p>{viewCustomer.address || 'No street address'}</p>
                                                <p className="text-gray-500">
                                                    {[viewCustomer.city, viewCustomer.state, viewCustomer.country].filter(Boolean).join(', ') || 'No location details'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Accquisition Source</label>
                                            <p className="font-medium text-gray-900 dark:text-white mt-1">{viewCustomer.source || '—'}</p>
                                        </div>
                                        <p className="font-mono text-sm text-gray-500 mt-1">#{viewCustomer.id}</p>
                                    </div>

                                    {/* Deals Section */}
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Briefcase size={18} className="text-indigo-500" />
                                                Linked Deals
                                            </h3>
                                            {!isAddingDeal && (
                                                <button onClick={() => setIsAddingDeal(true)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                                    <Plus size={14} /> Add Deal
                                                </button>
                                            )}
                                        </div>

                                        {isAddingDeal ? (
                                            <form onSubmit={handleDealSubmit} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-4 border border-indigo-100 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-2">
                                                <div>
                                                    <input
                                                        placeholder="Deal Title (e.g. New Project)"
                                                        value={newDeal.title}
                                                        onChange={e => setNewDeal({ ...newDeal, title: e.target.value })}
                                                        required
                                                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="relative">
                                                        <DollarSign size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                                        <input
                                                            type="number"
                                                            placeholder="Value"
                                                            value={newDeal.value}
                                                            onChange={e => setNewDeal({ ...newDeal, value: e.target.value })}
                                                            required
                                                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <input
                                                            type="date"
                                                            value={newDeal.expectedCloseDate}
                                                            onChange={e => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setIsAddingDeal(false)} className="text-xs font-medium text-gray-500 px-3 py-1.5 hover:bg-gray-100 rounded-lg">Cancel</button>
                                                    <button type="submit" disabled={saving} className="text-xs font-bold text-white bg-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-1">
                                                        {saving ? 'Saving...' : 'Create Deal'}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-3">
                                                {loadingDeals ? (
                                                    <div className="text-center py-4 text-gray-400 text-sm">Loading deals...</div>
                                                ) : customerDeals.length === 0 ? (
                                                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm text-gray-500">No active deals</p>
                                                    </div>
                                                ) : (

                                                    customerDeals.map(deal => (
                                                        <div key={deal.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                                                            <div>
                                                                <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 transition-colors">{deal.title}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">{deal.stage}</span>
                                                                    <span className="text-xs text-gray-400">•</span>
                                                                    <span className="text-xs text-gray-500">{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                                                                ${parseFloat(deal.value).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Support History Section */}
                                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                            <Headphones size={18} className="text-blue-500" />
                                            Support History
                                        </h3>
                                        <div className="space-y-3">
                                            {loadingTickets ? (
                                                <div className="text-center py-4 text-gray-400 text-sm">Loading tickets...</div>
                                            ) : customerTickets.length === 0 ? (
                                                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm text-gray-500">No support tickets found</p>
                                                </div>
                                            ) : (
                                                customerTickets.map(ticket => (
                                                    <div key={ticket.id} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                                        <div className={`mt-0.5 p-1.5 rounded-lg ${ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {ticket.status === 'OPEN' ? <AlertCircle size={16} /> :
                                                                ticket.status === 'RESOLVED' ? <CheckCircle size={16} /> :
                                                                    <Clock size={16} />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-bold text-gray-900 dark:text-white text-sm truncate pr-2">{ticket.subject}</p>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${ticket.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                                                                    ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
                                                                    }`}>{ticket.priority}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                                <span>#{ticket.id}</span>
                                                                <span>•</span>
                                                                <span>{ticket.category}</span>
                                                                <span>•</span>
                                                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="space-y-4">
                                    <form onSubmit={handleAddNote} className="relative">
                                        <textarea
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            placeholder="Add a new note..."
                                            className="w-full p-4 pr-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none h-24"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newNote.trim()}
                                            className="absolute bottom-3 right-3 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </form>

                                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                        {notes.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <StickyNote size={32} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No notes yet</p>
                                            </div>
                                        ) : (
                                            notes.map(note => (
                                                <div key={note.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-100 dark:border-yellow-900/30 group relative">
                                                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{note.content}</p>
                                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                                                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                                                        <button
                                                            onClick={() => handleDeleteNote(note.id)}
                                                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'activity' && (
                                <div className="space-y-6">
                                    <div className="relative pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-8">
                                        {activities.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No activity recorded</p>
                                            </div>
                                        ) : (
                                            activities.map((activity, index) => (
                                                <div key={index} className="relative">
                                                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900"></div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {activity.type}
                                                            {activity.description && <span className="text-gray-500 font-normal"> - {activity.description}</span>}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-0.5">
                                                            {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Just now'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}