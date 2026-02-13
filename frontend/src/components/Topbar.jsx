import { Bell, Search, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { getUser } from '../services/api';

export default function Topbar() {
    const user = getUser();
    const fullName = user?.fullName || user?.username || 'Guest User';
    const role = user?.roles?.[0]?.replace('ROLE_', '') || 'User';
    const initials = fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <header className="h-16 fixed top-0 right-0 left-0 lg:left-64 z-40 glass border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 transition-all duration-300">

            {/* Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search leads, customers, deals..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
                <ThemeToggle />

                <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white dark:border-dark"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{fullName}</div>
                        <div className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
}
