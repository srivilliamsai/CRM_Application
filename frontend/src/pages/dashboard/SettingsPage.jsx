import { User, Bell, Shield, Moon, Monitor } from 'lucide-react';
import { getUser } from '../../services/api';

export default function SettingsPage() {
    const user = getUser();
    const role = user?.roles?.[0]?.replace('ROLE_', '') || 'User';

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and system settings.</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={20} className="text-primary" /> Profile Information
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" className="input-field" defaultValue={user?.fullName || user?.username} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input type="email" className="input-field" defaultValue={user?.email} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                            <input type="tel" className="input-field" defaultValue={user?.phone || ''} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                            <input type="text" className="input-field capitalize" defaultValue={role.toLowerCase()} disabled />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="btn-primary">Save Changes</button>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bell size={20} className="text-yellow-500" /> Notifications
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive daily summaries and alerts via email.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Monitor size={20} className="text-purple-500" /> Appearance
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">Customize how UniQ CRM looks for you.</p>
                    <div className="flex gap-4">
                        <button className="flex-1 p-4 border-2 border-primary bg-primary/5 rounded-xl flex flex-col items-center gap-2">
                            <div className="w-full h-20 bg-white border border-gray-200 rounded-lg shadow-sm"></div>
                            <span className="font-medium text-primary">Light</span>
                        </button>
                        <button className="flex-1 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center gap-2 hover:border-primary transition-colors">
                            <div className="w-full h-20 bg-gray-900 border border-gray-800 rounded-lg shadow-sm"></div>
                            <span className="font-medium text-gray-600 dark:text-gray-300">Dark</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
