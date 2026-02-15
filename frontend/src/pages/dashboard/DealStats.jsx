import React from 'react';
import { DollarSign, Briefcase, TrendingUp, Activity } from 'lucide-react';

export default function DealStats({ deals }) {
    const totalValue = deals.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);
    const activeDeals = deals.filter(d => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST').length;

    const wonDeals = deals.filter(d => d.stage === 'CLOSED_WON');
    const lostDeals = deals.filter(d => d.stage === 'CLOSED_LOST');
    const closedCount = wonDeals.length + lostDeals.length;
    const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 0;

    const avgDealSize = deals.length > 0 ? totalValue / deals.length : 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    const stats = [
        {
            title: 'Total Pipeline Value',
            value: formatCurrency(totalValue),
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-100 dark:border-emerald-800'
        },
        {
            title: 'Active Deals',
            value: activeDeals,
            icon: Briefcase,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800'
        },
        {
            title: 'Win Rate',
            value: `${winRate}%`,
            icon: TrendingUp,
            color: 'text-violet-500',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            border: 'border-violet-100 dark:border-violet-800'
        },
        {
            title: 'Avg Deal Size',
            value: formatCurrency(avgDealSize),
            icon: Activity,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <div key={index} className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border ${stat.border} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
