import { useState, useEffect } from 'react';
import { getAllDeals } from '../../services/api';
import { Plus, Briefcase } from 'lucide-react';

const COLUMNS = {
    PROSPECTING: { id: 'PROSPECTING', title: 'Prospecting', color: 'bg-blue-500' },
    QUALIFICATION: { id: 'QUALIFICATION', title: 'Qualification', color: 'bg-yellow-500' },
    PROPOSAL: { id: 'PROPOSAL', title: 'Proposal', color: 'bg-indigo-500' },
    NEGOTIATION: { id: 'NEGOTIATION', title: 'Negotiation', color: 'bg-purple-500' },
    CLOSED_WON: { id: 'CLOSED_WON', title: 'Closed Won', color: 'bg-green-500' },
    CLOSED_LOST: { id: 'CLOSED_LOST', title: 'Closed Lost', color: 'bg-red-500' },
};

export default function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const data = await getAllDeals();
                setDeals(data);
            } catch (error) {
                console.error("Failed to fetch deals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const getDealsByStage = (stage) => deals.filter(d => d.stage === stage);

    const formatCurrency = (value) => {
        if (!value) return '$0';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Deals Pipeline</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your deals across stages.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    New Deal
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : deals.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-6">
                        <Briefcase size={48} className="text-indigo-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Deals Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8">
                        Your pipeline is empty. Create your first deal to start tracking sales opportunities.
                    </p>
                    <button className="btn-primary flex items-center gap-2 px-6 py-3">
                        <Plus size={20} />
                        Create First Deal
                    </button>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {Object.values(COLUMNS).map((column) => {
                        const columnDeals = getDealsByStage(column.id);
                        const totalValue = columnDeals.reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
                        return (
                            <div key={column.id} className="flex-shrink-0 w-72">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{column.title}</h3>
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                                            {columnDeals.length}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">{formatCurrency(totalValue)}</span>
                                </div>
                                <div className="space-y-3">
                                    {columnDeals.map((deal) => (
                                        <div key={deal.id} className="glass-card p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:translate-y-[-1px]">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate">{deal.title}</h4>
                                            {deal.description && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{deal.description}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-primary">{formatCurrency(deal.value)}</span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${deal.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                        deal.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                                    }`}>
                                                    {deal.priority || 'MEDIUM'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {columnDeals.length === 0 && (
                                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center text-gray-400 text-xs">
                                            No deals
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
