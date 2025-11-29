import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Activity, Wrench, TrendingUp } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { formatCurrency } from '../utils/formatters';

const Estadisticas = () => {
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
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 mb-8">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-cod flex items-center gap-4 border-l-4 border-l-neon-green">
                    <div className="p-4 bg-neon-green/10 rounded-full text-neon-green">
                        <DollarSign size={32} />
                    </div>
                    <div>
                        <p className="text-cod-text-dim text-xs uppercase tracking-wider">Inversión Total</p>
                        <p className="text-2xl font-display font-bold text-cod-text">
                            {formatCurrency(stats.totalCost)}
                        </p>
                    </div>
                </div>

                <div className="card-cod flex items-center gap-4 border-l-4 border-l-cod-orange">
                    <div className="p-4 bg-cod-orange/10 rounded-full text-cod-orange">
                        <Wrench size={32} />
                    </div>
                    <div>
                        <p className="text-cod-text-dim text-xs uppercase tracking-wider">Servicios Totales</p>
                        <p className="text-2xl font-display font-bold text-cod-text">
                            {stats.totalServices}
                        </p>
                    </div>
                </div>

                <div className="card-cod flex items-center gap-4 border-l-4 border-l-cod-text-dim">
                    <div className="p-4 bg-cod-gray/20 rounded-full text-cod-text-dim">
                        <Activity size={32} />
                    </div>
                    <div>
                        <p className="text-cod-text-dim text-xs uppercase tracking-wider">Kms Recorridos</p>
                        <p className="text-2xl font-display font-bold text-cod-text">
                            {stats.totalKm.toLocaleString()} km
                        </p>
                    </div>
                </div>
            </div>

            {/* Gráfico de Gastos */}
            <div className="card-cod">
                <h2 className="text-xl font-display font-bold text-cod-text mb-6 flex items-center gap-2">
                    <TrendingUp className="text-neon-green" />
                    TENDENCIA DE GASTOS (ÚLTIMOS 6 MESES)
                </h2>
                <div className="h-[300px] w-full">
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
                                barSize={50}
                                className="filter drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;
