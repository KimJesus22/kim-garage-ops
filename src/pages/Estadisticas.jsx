import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import ExpensesChart from '../components/ExpensesChart';

const Estadisticas = () => {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-display font-bold text-cod-text mb-2">
                    Estadísticas
                </h1>
                <p className="text-cod-text-dim uppercase tracking-wide text-sm">
                    Métricas y análisis de uso
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Gasto Mensual"
                    value="$3,800"
                    icon={DollarSign}
                    variant="success"
                    trend={{ positive: false, text: '-12% vs mes anterior' }}
                />
                <StatCard
                    title="Kilometraje Total"
                    value="57,000 km"
                    icon={Activity}
                    variant="default"
                    trend={{ positive: true, text: '+2,500 km este mes' }}
                />
                <StatCard
                    title="Promedio por Vehículo"
                    value="28,500 km"
                    icon={TrendingUp}
                    variant="default"
                />
                <StatCard
                    title="Servicios Realizados"
                    value="12"
                    icon={BarChart3}
                    variant="success"
                />
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                // ... inside the component ...

                <div className="card-cod">
                    <h3 className="text-xl font-display font-bold text-cod-text mb-4 uppercase tracking-wide">
                        Gastos por Mes
                    </h3>
                    <div className="h-72 w-full border border-cod-border rounded-sm p-2">
                        <ExpensesChart />
                    </div>
                </div>

                <div className="card-cod">
                    <h3 className="text-xl font-display font-bold text-cod-text mb-4 uppercase tracking-wide">
                        Kilometraje Acumulado
                    </h3>
                    <div className="h-64 flex items-center justify-center border border-cod-border rounded-sm">
                        <p className="text-cod-text-dim">
                            Gráfico de kilometraje (próximamente)
                        </p>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="card-cod">
                <h3 className="text-xl font-display font-bold text-cod-text mb-6 uppercase tracking-wide">
                    Desglose por Vehículo
                </h3>
                <div className="space-y-4">
                    {[
                        { name: 'Toyota Corolla', mileage: 45000, services: 8, cost: 12500 },
                        { name: 'Yamaha MT-07', mileage: 12000, services: 4, cost: 6800 },
                    ].map((vehicle, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-cod-darker rounded-sm border border-cod-border"
                        >
                            <div className="flex-1">
                                <h4 className="font-semibold text-cod-text mb-1">{vehicle.name}</h4>
                                <p className="text-sm text-cod-text-dim">
                                    {vehicle.mileage.toLocaleString()} km • {vehicle.services} servicios
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-display font-bold text-neon-green">
                                    ${vehicle.cost.toLocaleString()}
                                </p>
                                <p className="text-xs text-cod-text-dim">Gasto total</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;
