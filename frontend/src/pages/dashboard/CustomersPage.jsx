import { useState, useEffect } from 'react';
import { getAllCustomers } from '../../services/api';
import { Search, Filter, MoreHorizontal, Building, MapPin, Plus, Users, Mail } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchCustomers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Customers</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your customer base.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
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
                    <button className="btn-primary flex items-center gap-2 px-6 py-3">
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
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                    <MoreHorizontal size={20} />
                                </button>
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
        </div>
    );
}
