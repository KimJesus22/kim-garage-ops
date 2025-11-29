import { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';
import VehicleForm from '../components/VehicleForm';
import PageTransition from '../components/PageTransition';
import { Plus, Car } from 'lucide-react';

const Garage = () => {
    const { vehicles } = useVehicles();
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-cod-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cod-panel rounded-sm border border-cod-border">
                            <Car className="text-neon-green" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-cod-text">
                                Garage Táctico
                            </h1>
                            <p className="text-cod-text-dim text-sm uppercase tracking-wide">
                                Gestión de Flota y Mantenimiento
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Nuevo Vehículo
                    </button>
                </div>

                {/* Content */}
                {vehicles.length === 0 ? (
                    <div className="text-center py-20 bg-cod-panel border border-cod-border border-dashed rounded-sm">
                        <Car className="mx-auto text-cod-text-dim mb-4 opacity-50" size={64} />
                        <h3 className="text-xl font-bold text-cod-text mb-2">Garage Vacío</h3>
                        <p className="text-cod-text-dim mb-6">No hay unidades desplegadas en este momento.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="btn-secondary"
                        >
                            Desplegar Primera Unidad
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showAddForm && (
                    <VehicleForm onClose={() => setShowAddForm(false)} />
                )}
            </div>
        </PageTransition>
    );
};

export default Garage;
