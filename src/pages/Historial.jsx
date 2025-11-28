import { History, Calendar, Car } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const Historial = () => {
    const { vehicles } = useVehicles();

    // Combinar y ordenar todos los servicios de todos los vehículos
    const allServices = vehicles.flatMap(vehicle =>
        (vehicle.services || []).map(service => ({
            ...service,
            vehicleName: `${vehicle.brand} ${vehicle.model}`,
            vehicleType: vehicle.type
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-display font-bold text-cod-text mb-2">
                    Historial
                </h1>
                <p className="text-cod-text-dim uppercase tracking-wide text-sm">
                    Registro de mantenimientos y servicios
                </p>
            </div>

            {/* Historial List */}
            {allServices.length === 0 ? (
                <div className="card-cod text-center py-16">
                    <History size={64} className="mx-auto text-cod-text-dim mb-4" />
                    <h2 className="text-2xl font-display font-bold text-cod-text mb-2">
                        Sin historial
                    </h2>
                    <p className="text-cod-text-dim">
                        Aún no hay registros de mantenimiento
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allServices.map((item) => (
                        <div key={item.id} className="card-cod hover:border-neon-green/30">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Calendar size={16} className="text-neon-green" />
                                        <span className="text-sm text-cod-text-dim">
                                            {new Date(item.date).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span className="text-cod-text-dim">•</span>
                                        <span className="text-sm text-cod-text-dim">
                                            {item.mileageAtService.toLocaleString()} km
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-cod-text mb-1">
                                        {item.description}
                                    </h3>
                                    <p className="text-cod-text-dim text-sm mb-2 flex items-center gap-2">
                                        <Car size={14} />
                                        {item.vehicleName}
                                    </p>
                                    <span className={`
                    inline-block px-3 py-1 rounded-sm text-xs font-semibold uppercase tracking-wider
                    ${item.type === 'Cambio de Aceite'
                                            ? 'bg-neon-green/20 text-neon-green border border-neon-green/50'
                                            : 'bg-cod-orange/20 text-cod-orange border border-cod-orange/50'
                                        }
                  `}>
                                        {item.type}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-display font-bold text-neon-green">
                                        ${item.cost.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Historial;
