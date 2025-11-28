import { useVehicles } from '../context/VehicleContext';
import { Calendar, DollarSign, Wrench, Car, Bike } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Historial = () => {
    const { vehicles } = useVehicles();

    // Flatten all services into a single array
    const allServices = vehicles.flatMap(vehicle => {
        if (!vehicle.services) return [];
        return vehicle.services.map(service => ({
            ...service,
            vehicleName: `${vehicle.brand} ${vehicle.model}`,
            vehicleType: vehicle.type,
            vehicleId: vehicle.id
        }));
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-display font-bold text-cod-text mb-2">
                Historial de Operaciones
            </h1>
            <p className="text-cod-text-dim uppercase tracking-wide text-sm mb-8">
                Registro completo de mantenimiento
            </p>

            {allServices.length === 0 ? (
                <div className="card-cod text-center py-12">
                    <Wrench size={48} className="mx-auto text-cod-text-dim mb-4" />
                    <p className="text-cod-text-dim text-lg">
                        No hay registros de mantenimiento en el sistema
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allServices.map((service, index) => (
                        <div
                            key={index}
                            className="bg-cod-panel border border-cod-border p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cod-border-light transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-sm ${service.vehicleType === 'auto' ? 'bg-neon-green/10 text-neon-green' : 'bg-cod-orange/10 text-cod-orange'}`}>
                                    {service.vehicleType === 'auto' ? <Car size={20} /> : <Bike size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-cod-text">
                                        {service.type}
                                    </h3>
                                    <p className="text-cod-text-dim text-sm">
                                        {service.vehicleName}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-cod-text-dim uppercase tracking-wider">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(service.date).toLocaleDateString('es-MX')}
                                        </span>
                                        <span>
                                            {service.mileageAtService.toLocaleString()} km
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-neon-green font-mono font-bold text-lg">
                                {formatCurrency(service.cost)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Historial;
