import { useState, useEffect } from 'react';
import { getIntegrationStatus } from '../../services/api';
import { Mail, Webhook, Calendar, CheckCircle, XCircle, RefreshCw, Power, Settings, Link as LinkIcon, Lock } from 'lucide-react';

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchIntegrations = async () => {
        setLoading(true);
        try {
            // Mock data combined with API status
            // In a real app, API would return list of all integrations and their status
            const status = await getIntegrationStatus(); // Currently returns {service: "integration-service", ...}

            // Simulating a list of available integrations
            const mockIntegrations = [
                {
                    id: 'email',
                    name: 'Email Service',
                    icon: Mail,
                    description: 'Connect via SMTP to send automated emails.',
                    connected: true,
                    status: 'Active',
                    lastSync: 'Just now'
                },
                {
                    id: 'webhook',
                    name: 'Webhooks',
                    icon: Webhook,
                    description: 'Send data to external URLs on specific events.',
                    connected: true,
                    status: 'Active',
                    lastSync: '5 mins ago'
                },
                {
                    id: 'calendar',
                    name: 'Google Calendar',
                    icon: Calendar,
                    description: 'Sync meetings and reminders automatically.',
                    connected: false,
                    status: 'Disconnected',
                    lastSync: 'Never'
                },
                {
                    id: 'slack',
                    name: 'Slack',
                    icon: Lock, // Placeholder
                    description: 'Receive notifications in your Slack channels.',
                    connected: false,
                    status: 'Coming Soon',
                    lastSync: '-'
                }
            ];

            setIntegrations(mockIntegrations);
        } catch (error) {
            console.error("Failed to fetch integrations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetchIntegrations();
    };

    const toggleIntegration = (id) => {
        setIntegrations(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, connected: !item.connected, status: !item.connected ? 'Active' : 'Disconnected' };
            }
            return item;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Integrations</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Connect your favorite tools and services.</p>
                </div>
                <button onClick={fetchData} className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <RefreshCw size={20} className={loading ? "animate-spin text-primary" : "text-gray-500"} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {integrations.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.id} className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${item.connected ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                                    <Icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${item.connected
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {item.connected ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                    {item.status}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
                                {item.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                                <span className="text-xs text-gray-400">
                                    {item.connected ? `Synced: ${item.lastSync}` : 'Not connected'}
                                </span>
                                <div className="flex gap-2">
                                    {item.connected && (
                                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                            <Settings size={18} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleIntegration(item.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${item.connected
                                            ? 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            : 'bg-primary text-white border-primary hover:bg-primary/90'
                                            }`}
                                    >
                                        {item.connected ? 'Disconnect' : 'Connect'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
