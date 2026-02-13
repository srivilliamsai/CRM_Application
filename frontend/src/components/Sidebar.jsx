import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, UserPlus, FileText,
    BarChart2, Settings, HelpCircle, LogOut
} from 'lucide-react';
import { logout, getUser } from '../services/api';

export default function Sidebar() {
    const navigate = useNavigate();
    const user = getUser();
    const role = user?.roles?.[0];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavItem = ({ to, icon, label }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
            }
        >
            <div className="group-hover:scale-110 transition-transform">{icon}</div>
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-white/80 dark:bg-card/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 hidden lg:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <span className="text-primary">UniQ</span> CRM
                </span>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Main
                </div>
                <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
                <NavItem to="/dashboard/leads" icon={<UserPlus size={20} />} label="Leads" />
                <NavItem to="/dashboard/customers" icon={<Users size={20} />} label="Customers" />
                <NavItem to="/dashboard/deals" icon={<FileText size={20} />} label="Deals" />

                <div className="px-3 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Analytics
                </div>
                <NavItem to="/dashboard/reports" icon={<BarChart2 size={20} />} label="Reports" />
                <NavItem to="/dashboard/team" icon={<Users size={20} />} label="Team" />

                <div className="px-3 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    System
                </div>
                <NavItem to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                <NavItem to="/dashboard/help" icon={<HelpCircle size={20} />} label="Help & Support" />
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
