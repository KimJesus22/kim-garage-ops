import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Activity, Wrench } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const DashboardStats = () => {
    const { vehicles } = useVehicles();

    // --- Data Aggregation ---
    const stats = useMemo(() => {
        let totalCost = 0;
        let totalKm = 0;
        let totalServices = 0;
        const monthlyExpenses = {};

        // Initialize last 6 months
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('es-MX', { month: 'short' });
            // Capitalize first letter
            const formattedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
            months.push(formattedMonth);
            monthlyExpenses[formattedMonth] = 0;
        }

        vehicles.forEach(vehicle => {
            totalKm += parseInt(vehicle.mileage) || 0;

            if (vehicle.services) {
                totalServices += vehicle.services.length;
                vehicle.services.forEach(service => {
                    const cost = parseFloat(service.cost) || 0;
                    totalCost += cost;

                    // Aggregate by month for chart
                    const serviceDate = new Date(service.date);
                    const monthKey = serviceDate.toLocaleString('es-MX', { month: 'short' });
                    const formattedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

                    if (monthlyExpenses[formattedMonth] !== undefined) {
                        monthlyExpenses[formattedMonth] += cost;
                    }
                });
            }
        });

        const chartData = months.map(month => ({
            name: month,
            amount: monthlyExpenses[month]
        }));

        return { totalCost, totalKm, totalServices, chartData };
    }, [vehicles]);

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column: KPIs */}
            <div className="lg:col-span-1 space-y-4">
                {/* KPI 1: Costo Total */}
                <div className="bg-cod-panel/50 border border-cod-border p-4 rounded-sm flex items-center justify-between group hover:border-neon-green/30 transition-colors">
                    <div>
                        <p className="text-cod-text-dim text-xs uppercase tracking-wider mb-1">Costo Total Flota</p>
                        <p className="text-3xl font-display font-bold text-neon-green">
                            ${stats.totalCost.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-3 bg-neon-green/10 rounded-full text-neon-green">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* KPI 2: Kilómetros Totales */}
                <div className="bg-cod-panel/50 border border-cod-border p-4 rounded-sm flex items-center justify-between group hover:border-cod-orange/30 transition-colors">
                    <div>
                        <p className="text-cod-text-dim text-xs uppercase tracking-wider mb-1">Kms Recorridos</p>
                        <p className="text-3xl font-display font-bold text-cod-text">
                            {stats.totalKm.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-3 bg-cod-orange/10 rounded-full text-cod-orange">
                        <Activity size={24} />
                    </div>
                </div>

                {/* KPI 3: Servicios Totales */}
                <div className="bg-cod-panel/50 border border-cod-border p-4 rounded-sm flex items-center justify-between group hover:border-cod-border transition-colors">
                    <div>
                        <p className="text-cod-text-dim text-xs uppercase tracking-wider mb-1">Servicios Realizados</p>
                        <p className="text-3xl font-display font-bold text-cod-text">
                            {stats.totalServices}
                        </p>
                    </div>
                    <div className="p-3 bg-cod-gray/20 rounded-full text-cod-text-dim">
                        <Wrench size={24} />
                    </div>
                </div>
            </div>

            {/* Right Column: Chart */}
            <div className="lg:col-span-2 bg-cod-panel/30 border border-cod-border rounded-sm p-4 relative">
                <h3 className="text-cod-text font-display font-bold uppercase tracking-wide mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                    Gasto Total por Mes
                </h3>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats.chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
            </div>
        </div>
    );
};

export default DashboardStats;
