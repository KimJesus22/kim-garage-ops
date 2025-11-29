import { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { Calendar, DollarSign, Wrench, Car, Bike, Paperclip, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import PageTransition from '../components/PageTransition';

const Historial = () => {
    const { vehicles } = useVehicles();
    const [selectedEvidence, setSelectedEvidence] = useState(null);

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
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-cod-border pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-cod-panel rounded-sm border border-cod-border">
                            <HistoryIcon className="text-neon-green" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-cod-text">
                                Registro de Operaciones
                            </h1>
                            <p className="text-cod-text-dim text-sm uppercase tracking-wide">
                                Historial de Mantenimiento Global
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-cod-panel border border-cod-border rounded-sm overflow-hidden shadow-cod-card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-cod-darker text-cod-text-dim text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-bold border-b border-cod-border">Fecha</th>
                                    <th className="p-4 font-bold border-b border-cod-border">Vehículo</th>
                                    <th className="p-4 font-bold border-b border-cod-border">Servicio</th>
                                    <th className="p-4 font-bold border-b border-cod-border">Kilometraje</th>
                                    <th className="p-4 font-bold border-b border-cod-border">Costo</th>
                                    <th className="p-4 font-bold border-b border-cod-border text-center">Evidencia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cod-border/50">
                                {allServices.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-cod-text-dim italic">
                                            No hay registros de operaciones.
                                        </td>
                                    </tr>
                                ) : (
                                    allServices.map((service, index) => (
                                        <tr key={index} className="hover:bg-cod-darker/30 transition-colors group">
                                            <td className="p-4 text-sm font-mono text-cod-text">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-cod-text-dim" />
                                                    {new Date(service.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {service.vehicleType === 'auto' ? <Car size={14} className="text-neon-green" /> : <Bike size={14} className="text-cod-orange" />}
                                                    <span className="font-bold text-sm uppercase">{service.vehicleName}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Wrench size={14} className="text-cod-text-dim" />
                                                    <span className="text-sm">{service.type}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-sm text-cod-text-dim">
                                                {service.mileageAtService.toLocaleString()} km
                                            </td>
                                            <td className="p-4 font-mono text-sm font-bold text-neon-green">
                                                {formatCurrency(service.cost)}
                                            </td>
                                            <td className="p-4 text-center">
                                                {service.evidence ? (
                                                    <button
                                                        onClick={() => setSelectedEvidence(service.evidence)}
                                                        className="text-cod-text-dim hover:text-neon-green transition-colors p-1 rounded-full hover:bg-cod-darker"
                                                        title="Ver Evidencia"
                                                    >
                                                        <Paperclip size={16} />
                                                    </button>
                                                ) : (
                                                    <span className="text-cod-border text-xs">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Evidence Modal */}
                {selectedEvidence && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvidence(null)}>
                        <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setSelectedEvidence(null)}
                                className="absolute -top-10 right-0 text-cod-text-dim hover:text-cod-orange transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <img
                                src={selectedEvidence}
                                alt="Evidencia del Servicio"
                                className="w-full h-full object-contain rounded-sm border border-cod-border shadow-2xl"
                            />
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

// Helper icon component since History is imported as HistoryIcon to avoid conflict
const HistoryIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74-2.74L3 12" />
        <path d="M3 3v9h9" />
        <path d="M12 7v5l4 2" />
    </svg>
);

export default Historial;
