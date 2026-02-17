import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function LeadFunnelChart({ data }) {
    // Expected data: [{ name: 'Prospecting', value: 10 }, ...]

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-lg rounded-xl text-sm">
                    <p className="font-bold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-primary font-medium">
                        {payload[0].value} Deals
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8 - (index * 0.15)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
