import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import VehicleCard from '../components/VehicleCard';
import VehicleForm from '../components/VehicleForm';
import PageTransition from '../components/PageTransition';

const Garage = () => {
    const { vehicles } = useVehicles();
    const [showForm, setShowForm] = useState(false);

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-cod-text mb-2">GARAGE TÁCTICO</h1>
                        <p className="text-cod-text-dim">Gestión y despliegue de unidades.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-sm font-semibold transition-all duration-200
                            ${showForm
                                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20'
                                : 'bg-neon-green text-cod-darker hover:bg-neon-green-dark hover:shadow-neon-green'
                            }
                        `}
                    >
                        {showForm ? <><X size={20} /> CANCELAR</> : <><Plus size={20} /> NUEVA UNIDAD</>}
                    </button>
                </div>

                {/* Formulario Desplegable */}
                {showForm && (
                    <div className="animate-in slide-in-from-top-4 fade-in duration-300">
                        <VehicleForm onClose={() => setShowForm(false)} />
                    </div>
                )}

                {/* Grid de Vehículos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.length > 0 ? (
                        vehicles.map(vehicle => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-cod-border rounded-lg">
                            <p className="text-cod-text-dim text-lg">No hay unidades desplegadas.</p>
                            <p className="text-cod-text-dim/50 text-sm mt-2">Utiliza el botón "NUEVA UNIDAD" para registrar un vehículo.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Garage;
