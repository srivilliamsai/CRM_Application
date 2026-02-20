import { useState, useEffect } from 'react';
import { User, Bell, Shield, Moon, Monitor, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { getUser, updateUserProfile, refreshUserProfile } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(getUser());
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

    // Form states
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });

    const role = user?.roles?.[0]?.replace('ROLE_', '') || 'User';

    useEffect(() => {
        // Refresh local user data on mount just in case
        const fetchLatest = async () => {
            const updatedUser = await refreshUserProfile();
            if (updatedUser) {
                setUser(updatedUser);
                setFormData({
                    fullName: updatedUser.fullName || '',
                    phone: updatedUser.phone || '',
                });
            }
        };
        fetchLatest();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear message when user types
        if (message) setMessage(null);
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await updateUserProfile(user.id, formData);
            // Refresh local storage and user state
            const updatedUser = await refreshUserProfile();
            if (updatedUser) setUser(updatedUser);

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Update failed", error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and system settings.</p>
            </div>

            {/* Profile Section */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={20} className="text-primary" /> Profile Information
                    </h3>
                    {message && (
                        <div className={`flex items-center gap-2 text-sm px-3 py-1 rounded-full ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {message.text}
                        </div>
                    )}
                </div>
                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Profile Picture Placeholder (Visual Only for now) */}
                        <div className="col-span-1 md:col-span-2 flex items-center gap-6 mb-2">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{user?.username}</h4>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                    {role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="input-field w-full transition-all focus:ring-2 focus:ring-primary/20"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input-field w-full bg-gray-50 dark:bg-gray-800/50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500">Email cannot be changed contact admin.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input-field w-full transition-all focus:ring-2 focus:ring-primary/20"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={user?.companyName || ''}
                                    disabled
                                    className="input-field w-full text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`btn-primary flex items-center gap-2 ${loading ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Notifications */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Bell size={20} className="text-yellow-500" /> Notifications
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                                <p className="text-sm text-gray-500">Daily summaries and alerts.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between group">
                            <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">Desktop Alerts</h4>
                                <p className="text-sm text-gray-500">Get notified while online.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Monitor size={20} className="text-purple-500" /> Appearance
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-500 mb-6">Customize your workspace experience.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => toggleTheme('light')}
                                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${theme === 'light'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <span className="w-full h-12 bg-white border border-gray-200 rounded-lg shadow-sm block"></span>
                                <span className={`font-medium text-sm ${theme === 'light' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>Light Mode</span>
                            </button>
                            <button
                                onClick={() => toggleTheme('dark')}
                                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${theme === 'dark'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                            >
                                <span className="w-full h-12 bg-gray-900 border border-gray-800 rounded-lg shadow-sm block"></span>
                                <span className={`font-medium text-sm ${theme === 'dark' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>Dark Mode</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
