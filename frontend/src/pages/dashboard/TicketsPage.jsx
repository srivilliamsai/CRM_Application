import { useState, useEffect } from 'react';
import { getUser, getAllTickets, createTicket, updateTicketStatus, getTicketResponses, addTicketResponse, getAllCustomers } from '../../services/api';
import { AlertCircle, AlertTriangle, CheckCircle, Search, Filter, Plus, X, Send, MessageSquare, Clock, Headphones } from 'lucide-react';

export default function TicketsPage() {
    const user = getUser();
    const [tickets, setTickets] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null); // For View/Edit
    const [ticketResponses, setTicketResponses] = useState([]);
    const [newResponse, setNewResponse] = useState('');

    // Filter
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // New Ticket Form
    const [newTicketData, setNewTicketData] = useState({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        category: 'General',
        customerId: '',
        assignedTo: user?.id || ''
    });

    useEffect(() => {
        fetchData();
    }, [user?.companyId]);

    const fetchData = async () => {
        try {
            const [ticketsData, customersData] = await Promise.allSettled([
                getAllTickets(),
                getAllCustomers()
            ]);

            if (ticketsData.status === 'fulfilled') {
                setTickets(ticketsData.value);
            }
            if (customersData.status === 'fulfilled') {
                setCustomers(customersData.value);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            await createTicket({ ...newTicketData, companyId: user?.companyId });
            setIsNewTicketModalOpen(false);
            setNewTicketData({ subject: '', description: '', priority: 'MEDIUM', category: 'General', customerId: '', assignedTo: user?.id || '' });
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Failed to create ticket", error);
            alert("Failed to create ticket");
        }
    };

    const openTicketDetails = async (ticket) => {
        setSelectedTicket(ticket);
        try {
            const responses = await getTicketResponses(ticket.id);
            setTicketResponses(responses);
        } catch (error) {
            console.error("Failed to fetch responses", error);
        }
    };

    const handleSendResponse = async () => {
        if (!newResponse.trim()) return;
        try {
            await addTicketResponse(selectedTicket.id, {
                message: newResponse,
                respondedBy: user.id,
                responderType: 'AGENT'
            });
            setNewResponse('');
            // Refresh responses
            const updatedResponses = await getTicketResponses(selectedTicket.id);
            setTicketResponses(updatedResponses);
        } catch (error) {
            console.error("Failed to send response", error);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            await updateTicketStatus(ticketId, newStatus);
            if (selectedTicket && selectedTicket.id === ticketId) {
                setSelectedTicket({ ...selectedTicket, status: newStatus });
            }
            fetchData();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.toString().includes(searchQuery);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Support Tickets</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and resolve customer inquiries.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setIsNewTicketModalOpen(true)} className="btn-primary flex items-center gap-2 px-5 py-2.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-shadow">
                        <Plus size={18} strokeWidth={2.5} />
                        <span className="font-semibold">New Ticket</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                    {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${filterStatus === status
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div className="relative w-full sm:w-72 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Tickets Table */}
            <div className="glass-card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="py-4 pl-6">Ticket</th>
                                    <th className="py-4">Customer</th>
                                    <th className="py-4">Priority</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4">SLA Deadline</th>
                                    <th className="py-4">Created</th>
                                    <th className="py-4 pr-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredTickets.length > 0 ? (
                                    filteredTickets.map(ticket => (
                                        <tr key={ticket.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg flex-shrink-0 ${ticket.category === 'Technical' ? 'bg-purple-100 text-purple-600' :
                                                        ticket.category === 'Billing' ? 'bg-green-100 text-green-600' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        <Headphones size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">{ticket.subject}</div>
                                                        <div className="text-xs text-gray-500">#{ticket.id} · {ticket.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {customers.find(c => c.id === ticket.customerId) ?
                                                    `${customers.find(c => c.id === ticket.customerId).firstName} ${customers.find(c => c.id === ticket.customerId).lastName}`
                                                    : 'Unknown'}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${ticket.priority === 'URGENT' ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    ticket.priority === 'HIGH' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                                        'bg-blue-50 text-blue-600 border border-blue-100'
                                                    }`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                                                    ticket.status === 'RESOLVED' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                {ticket.slaDeadline ? (
                                                    <span className={`text-xs font-medium ${new Date(ticket.slaDeadline) < new Date() && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                                        {new Date(ticket.slaDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                ) : <span className="text-gray-400 text-xs">-</span>}
                                            </td>
                                            <td className="py-4 text-gray-500 font-medium">
                                                {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="py-4 pr-6 text-right">
                                                <button
                                                    onClick={() => openTicketDetails(ticket)}
                                                    className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-gray-100 rounded-full p-4 mb-3">
                                                    <Search size={24} className="text-gray-400" />
                                                </div>
                                                <p className="font-medium">No tickets found.</p>
                                                <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* New Ticket Modal */}
            {isNewTicketModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsNewTicketModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800 transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Ticket</h2>
                                <p className="text-sm text-gray-500">Raise a new support request</p>
                            </div>
                            <button onClick={() => setIsNewTicketModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Brief summary of the issue"
                                    className="input-field"
                                    value={newTicketData.subject}
                                    onChange={e => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Customer</label>
                                    <div className="relative">
                                        <select
                                            className="input-field appearance-none"
                                            value={newTicketData.customerId}
                                            onChange={e => setNewTicketData({ ...newTicketData, customerId: e.target.value })}
                                        >
                                            <option value="">Select Customer</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                                    <div className="relative">
                                        <select
                                            className="input-field appearance-none"
                                            value={newTicketData.priority}
                                            onChange={e => setNewTicketData({ ...newTicketData, priority: e.target.value })}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-50">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        className="input-field appearance-none"
                                        value={newTicketData.category}
                                        onChange={e => setNewTicketData({ ...newTicketData, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Feature Request">Feature Request</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    placeholder="Detailed description..."
                                    className="input-field resize-none"
                                    value={newTicketData.description}
                                    onChange={e => setNewTicketData({ ...newTicketData, description: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="btn-primary px-6 py-2.5 font-bold shadow-lg shadow-blue-500/20">Create Ticket</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Ticket Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTicket(null)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 dark:border-gray-800 max-h-[85vh] flex flex-col transform transition-all scale-100">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    #{selectedTicket.id} - {selectedTicket.subject}
                                    <span className={`px-2 py-0.5 rounded-full text-xs border ${selectedTicket.priority === 'URGENT' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>{selectedTicket.priority}</span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Requested by <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        {customers.find(c => c.id === selectedTicket.customerId) ?
                                            `${customers.find(c => c.id === selectedTicket.customerId).firstName} ${customers.find(c => c.id === selectedTicket.customerId).lastName}`
                                            : 'Unknown'}
                                    </span> · {new Date(selectedTicket.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-0 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800">

                            {/* Left: Chat/Thread */}
                            <div className="col-span-2 p-6 flex flex-col bg-white dark:bg-gray-900">
                                <div className="mb-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                    <h3 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">Issue Description</h3>
                                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                                </div>

                                <div className="flex-1 space-y-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare size={16} className="text-gray-400" />
                                        <span className="text-xs font-bold text-gray-500 uppercase">Conversation History</span>
                                    </div>

                                    {ticketResponses.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400 text-sm italic bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                            No responses yet. Start the conversation.
                                        </div>
                                    ) : (
                                        ticketResponses.map((resp, i) => (
                                            <div key={i} className={`flex flex-col ${resp.responderType === 'AGENT' ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${resp.responderType === 'AGENT'
                                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                                                    }`}>
                                                    {resp.message}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-1 px-1">
                                                    {resp.responderType === 'AGENT' ? 'You' : 'Customer'} • {new Date(resp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Reply Input */}
                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Type your reply..."
                                            className="flex-1 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            value={newResponse}
                                            onChange={e => setNewResponse(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && handleSendResponse()}
                                        />
                                        <button onClick={handleSendResponse} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 active:translate-y-0.5">
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Sidebar Info */}
                            <div className="col-span-1 bg-gray-50/50 dark:bg-gray-800/30 p-6 space-y-6">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Status</span>
                                    <select
                                        value={selectedTicket.status}
                                        onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                                    >
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
                                        <option value="RESOLVED">Resolved</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Details</span>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Priority</span>
                                            <span className={`font-semibold ${selectedTicket.priority === 'URGENT' ? 'text-red-600' : 'text-gray-700'
                                                }`}>{selectedTicket.priority}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Category</span>
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedTicket.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Assigned To</span>
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">You</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Timeline</span>
                                    <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                                        <div className="relative">
                                            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-900"></div>
                                            <p className="text-xs text-gray-500 mb-0.5">Created</p>
                                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                                        </div>
                                        {selectedTicket.updatedAt && (
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900"></div>
                                                <p className="text-xs text-gray-500 mb-0.5">Last Updated</p>
                                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
