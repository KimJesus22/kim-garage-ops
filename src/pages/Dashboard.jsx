import { useVehicles } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';
import DashboardStats from '../components/DashboardStats';
import { Plus } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
    const { vehicles } = useVehicles();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-bold text-cod-text mb-2">
                        Centro de Mando
                    </h1>
                    <p className="text-cod-text-dim uppercase tracking-wide text-sm">
                        Visión general de la flota
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

            {/* Advanced Stats Panel */}
            <DashboardStats />

            {/* Active Vehicles Grid */}
            <div>
                <h2 className="text-xl font-display font-bold text-cod-text mb-4 uppercase tracking-wide border-b border-cod-border pb-2">
                    Vehículos Activos
                </h2>
                {vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-cod-dark-blue rounded-lg shadow-lg text-center">
                        <p className="text-lg text-cod-text-dim mb-4">
                            No tienes vehículos registrados
                        </p >
                        <button
                            onClick={() => onNavigate('garage')}
                            className="btn-primary"
                        >
                            Agregar tu primer vehículo
                        </button>
                    </div >
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div >
        </div >
    );
};

export default Dashboard;
