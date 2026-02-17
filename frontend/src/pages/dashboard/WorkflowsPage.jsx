import { useState, useEffect } from 'react';
import { getAllRules, createRule, toggleRule, deleteRule, getWorkflowLogs } from '../../services/api';
import { Plus, Play, Pause, Trash2, Clock, Zap, Activity, Info, ChevronRight, RefreshCw, X } from 'lucide-react';

export default function WorkflowsPage() {
    const [rules, setRules] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('rules'); // rules, logs

    // Form state
    const [newRule, setNewRule] = useState({ name: '', triggerType: 'EVENT', condition: '', actionType: 'EMAIL', actionConfig: '' });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [rulesData, logsData] = await Promise.all([
                getAllRules(),
                getWorkflowLogs()
            ]);
            setRules(rulesData || []);
            setLogs(logsData || []);
        } catch (error) {
            console.error("Failed to fetch workflows:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleRule = async (id) => {
        try {
            const updatedRule = await toggleRule(id);
            setRules(rules.map(r => r.id === id ? updatedRule : r));
        } catch (error) {
            console.error("Failed to toggle rule:", error);
        }
    };

    const handleDeleteRule = async (id) => {
        if (window.confirm("Delete this workflow rule?")) {
            try {
                await deleteRule(id);
                setRules(rules.filter(r => r.id !== id));
            } catch (error) {
                console.error("Failed to delete rule:", error);
            }
        }
    };

    const handleCreateRule = async (e) => {
        e.preventDefault();
        try {
            await createRule(newRule);
            setShowCreateModal(false);
            setNewRule({ name: '', triggerType: 'EVENT', condition: '', actionType: 'EMAIL', actionConfig: '' });
            fetchData();
        } catch (error) {
            console.error("Failed to create rule:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Workflows</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Automate tasks and business logic.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <RefreshCw size={20} className={loading ? "animate-spin text-primary" : "text-gray-500"} />
                    </button>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        New Workflow
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl mb-6 self-start w-fit">
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'rules'
                        ? 'bg-white dark:bg-card text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <Zap size={16} /> Automation Rules
                </button>
                <button
                    onClick={() => setActiveTab('logs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'logs'
                        ? 'bg-white dark:bg-card text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    <Activity size={16} /> Execution Logs
                </button>
            </div>

            {activeTab === 'rules' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rules.map((rule) => (
                        <div key={rule.id} className={`bg-white dark:bg-card rounded-xl border transition-colors p-6 flex flex-col h-full ${rule.active ? 'border-primary/20 shadow-sm' : 'border-gray-200 dark:border-gray-800 opacity-75'}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${rule.active ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                    <Zap size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleToggleRule(rule.id)} className={`p-1.5 rounded-lg transition-colors ${rule.active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={rule.active ? "Deactivate" : "Activate"}>
                                        {rule.active ? <Pause size={18} /> : <Play size={18} />}
                                    </button>
                                    <button onClick={() => handleDeleteRule(rule.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{rule.name}</h3>
                            <div className="space-y-2 mb-6 flex-1 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-500 uppercase text-xs tracking-wider">Trigger:</span>
                                    {rule.triggerType}
                                </div>
                                {rule.condition && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-500 uppercase text-xs tracking-wider">Condition:</span>
                                        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">{rule.condition}</code>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-500 uppercase text-xs tracking-wider">Action:</span>
                                    {rule.actionType}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-400">
                                <span>ID: {rule.id}</span>
                                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${rule.active
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${rule.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                    {rule.active ? 'Active' : 'Paused'}
                                </div>
                            </div>
                        </div>
                    ))}
                    {rules.length === 0 && !loading && (
                        <div className="col-span-full py-12 text-center text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50/50 dark:bg-gray-900/50">
                            No workflows found. Create one to automate your tasks.
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Time</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Workflow</th>
                                    <th className="px-6 py-4 font-medium">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(log.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                                            ID: {log.workflowActionId || log.ruleId || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {log.details || log.message}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No execution logs available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Rule Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Workflow Rule</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateRule} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    value={newRule.name}
                                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white"
                                    placeholder="e.g. Welcome Email for New Leads"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trigger Type</label>
                                    <select
                                        value={newRule.triggerType}
                                        onChange={(e) => setNewRule({ ...newRule, triggerType: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
                                    >
                                        <option value="EVENT">Event Based</option>
                                        <option value="SCHEDULE">Scheduled</option>
                                        <option value="MANUAL">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Type</label>
                                    <select
                                        value={newRule.actionType}
                                        onChange={(e) => setNewRule({ ...newRule, actionType: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none dark:text-white"
                                    >
                                        <option value="EMAIL">Send Email</option>
                                        <option value="WEBHOOK">Send Webhook</option>
                                        <option value="NOTIFICATION">In-App Notification</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Condition (Optional)</label>
                                <input
                                    type="text"
                                    value={newRule.condition}
                                    onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white"
                                    placeholder="e.g. payload.status == 'NEW'"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Config (JSON)</label>
                                <textarea
                                    value={newRule.actionConfig}
                                    onChange={(e) => setNewRule({ ...newRule, actionConfig: e.target.value })}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none dark:text-white font-mono text-xs"
                                    placeholder='{"template": "welcome", "to": "{{email}}"}'
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Create Rule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
