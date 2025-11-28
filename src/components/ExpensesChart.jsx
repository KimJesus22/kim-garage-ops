import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jun', amount: 1200 },
    { name: 'Jul', amount: 800 },
    { name: 'Ago', amount: 2400 },
    { name: 'Sep', amount: 1500 },
    { name: 'Oct', amount: 450 },
    { name: 'Nov', amount: 3200 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-cod-panel border border-cod-border p-3 rounded-sm shadow-lg">
                <p className="text-cod-text font-bold mb-1">{label}</p>
                <p className="text-neon-green font-mono">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const ExpensesChart = () => {
    return (
        <div className="w-full h-[300px] bg-transparent">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={{ stroke: '#2d3748' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                    <Bar
                        dataKey="amount"
                        fill="#4ade80"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        className="filter drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExpensesChart;
