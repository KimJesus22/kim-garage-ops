import { useState } from 'react';
import { Plus, Car } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';
import VehicleForm from '../components/VehicleForm';

const Garage = () => {
    const { vehicles } = useVehicles();
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-display font-bold text-cod-text mb-2">
                        Garage
                    </h1>
                    <p className="text-cod-text-dim uppercase tracking-wide text-sm">
                        Gestiona tus vehículos
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Agregar Vehículo
                </button>
            </div>

            {/* Vehicles Grid */}
            {vehicles.length === 0 ? (
                <div className="card-cod text-center py-16">
                    <Car size={64} className="mx-auto text-cod-text-dim mb-4" />
                    <h2 className="text-2xl font-display font-bold text-cod-text mb-2">
                        Tu garage está vacío
                    </h2>
                    <p className="text-cod-text-dim mb-6">
                        Comienza agregando tu primer vehículo
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn-primary"
                    >
                        <Plus size={20} className="inline mr-2" />
                        Agregar Vehículo
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && <VehicleForm onClose={() => setShowForm(false)} />}
        </div>
    );
};

export default Garage;
