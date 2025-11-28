import { Car, DollarSign, Wrench, Plus } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';
import StatCard from '../components/StatCard';

const Dashboard = ({ onNavigate }) => {
    const { vehicles } = useVehicles();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-bold text-cod-text mb-2">
                        Dashboard
                    </h1>
                    <p className="text-cod-text-dim uppercase tracking-wide text-sm">
                        Resumen de tu garage
                    </p>
                </div>
                <button
                    onClick={() => onNavigate('garage')}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Agregar Vehículo
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Vehículos Activos"
                    value={vehicles.length}
                    icon={Car}
                    variant="success"
                />
                <StatCard
                    title="Gasto Total"
                    value="$0"
                    icon={DollarSign}
                    variant="default"
                />
                <StatCard
                    title="Próximo Mantenimiento"
                    value="N/A"
                    icon={Wrench}
                    variant="warning"
                />
            </div>

            {/* Vehicles Grid */}
            <div>
                <h2 className="text-2xl font-display font-bold text-cod-text mb-4 uppercase tracking-wide">
                    Mis Vehículos
                </h2>

                {vehicles.length === 0 ? (
                    <div className="card-cod text-center py-12">
                        <Car size={48} className="mx-auto text-cod-text-dim mb-4" />
                        <p className="text-cod-text-dim text-lg mb-4">
                            No tienes vehículos registrados
                        </p>
                        <button
                            onClick={() => onNavigate('garage')}
                            className="btn-primary"
                        >
                            Agregar tu primer vehículo
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
