import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { getUser } from '../services/api';

import LeadsPage from './dashboard/LeadsPage';
import CustomersPage from './dashboard/CustomersPage';
import DealsPage from './dashboard/DealsPage';
import ReportsPage from './dashboard/ReportsPage';
import SettingsPage from './dashboard/SettingsPage';
import TeamPage from './dashboard/TeamPage';
import HelpPage from './dashboard/HelpPage';
import SalesDashboard from './dashboard/SalesDashboard';
import MarketingDashboard from './dashboard/MarketingDashboard';
import CampaignsPage from './dashboard/CampaignsPage';
import SupportDashboard from './dashboard/SupportDashboard';
import TicketsPage from './dashboard/TicketsPage';
import AdminDashboard from './dashboard/AdminDashboard';

export default function Dashboard() {
    const user = getUser();
    const role = user?.roles?.[0] || 'ROLE_USER';
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null; // Prevent rendering if not logged in

    const getDashboardByRole = () => {
        // console.log("Current Role:", role); // for debugging if needed
        switch (role) {
            case 'ROLE_SALES':
                return <SalesDashboard />;
            case 'ROLE_MARKETING':
                return <MarketingDashboard />;
            case 'ROLE_SUPPORT':
                return <SupportDashboard />;
            case 'ROLE_ADMIN':
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex">
            <Sidebar />

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
                <TopBar />

                <main className="flex-1 pt-24 pb-12 px-6 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={getDashboardByRole()} />
                        <Route path="/leads" element={<LeadsPage />} />
                        <Route path="/customers" element={<CustomersPage />} />
                        <Route path="/deals" element={<DealsPage />} />
                        <Route path="/marketing" element={<CampaignsPage />} />
                        <Route path="/tickets" element={<TicketsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/help" element={<HelpPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
