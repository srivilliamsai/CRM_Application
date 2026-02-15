import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const formatCurrency = (value) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value}`;
};

export function PipelineChart({ deals }) {
    const stagesData = [
        { name: 'Prospecting', id: 'PROSPECTING', value: 0 },
        { name: 'Qualification', id: 'QUALIFICATION', value: 0 },
        { name: 'Proposal', id: 'PROPOSAL', value: 0 },
        { name: 'Negotiation', id: 'NEGOTIATION', value: 0 },
        { name: 'Closed Won', id: 'CLOSED_WON', value: 0 },
        { name: 'Closed Lost', id: 'CLOSED_LOST', value: 0 },
    ];

    deals.forEach(deal => {
        const stage = stagesData.find(s => s.id === deal.stage);
        if (stage) {
            stage.value += (parseFloat(deal.value) || 0);
        }
    });

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Pipeline Value by Stage</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stagesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} interval={0} angle={-15} textAnchor="end" height={60} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatCurrency} />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
                        />
                        <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function RevenueChart({ deals }) {
    const revenueByMonth = {};
    deals.forEach(deal => {
        if (deal.stage === 'CLOSED_WON' || deal.stage === 'CLOSED_LOST') {
            const date = new Date(deal.expectedCloseDate || new Date());
            const month = date.toLocaleString('default', { month: 'short' });
            if (!revenueByMonth[month]) {
                revenueByMonth[month] = { name: month, won: 0, lost: 0 };
            }
            if (deal.stage === 'CLOSED_WON') revenueByMonth[month].won += parseFloat(deal.value) || 0;
            if (deal.stage === 'CLOSED_LOST') revenueByMonth[month].lost += parseFloat(deal.value) || 0;
        }
    });

    let revenueData = Object.values(revenueByMonth);

    if (revenueData.length === 0) {
        revenueData = [
            { name: 'Jan', won: 0, lost: 0 },
            { name: 'Feb', won: 0, lost: 0 },
            { name: 'Mar', won: 0, lost: 0 },
            { name: 'Apr', won: 0, lost: 0 },
        ];
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue Performance</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatCurrency} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="won" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" name="Won" />
                        <Area type="monotone" dataKey="lost" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLost)" name="Lost" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
