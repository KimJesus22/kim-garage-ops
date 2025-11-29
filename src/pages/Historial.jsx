import { useVehicles } from '../context/VehicleContext';
import { formatCurrency } from '../utils/formatters';
import { exportToCSV } from '../utils/exporter';
import { Calendar, Wrench, DollarSign, FileText, Download } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Historial = () => {
    const { vehicles } = useVehicles();

    // Flatten all services from all vehicles into a single array
    const allServices = vehicles.flatMap(vehicle =>
        (vehicle.services || []).map(service => ({
            ...service,
            vehicleName: `${vehicle.brand} ${vehicle.model}`,
            vehicleType: vehicle.type
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

    const handleExport = () => {
        exportToCSV(vehicles);
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-cod-text mb-2">BITÁCORA DE SERVICIO</h1>
                        <p className="text-cod-text-dim">Registro histórico de mantenimiento.</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-cod-panel border border-cod-border rounded-sm text-cod-text hover:bg-cod-dark hover:text-neon-green transition-colors text-sm font-medium"
                    >
                        <Download size={16} />
                        Exportar Datos
                    </button>
                </div>

                <div className="card-cod overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-cod-border bg-cod-dark/50">
                                    <th className="p-4 text-cod-text-dim font-medium uppercase text-xs tracking-wider">Fecha</th>
                                    <th className="p-4 text-cod-text-dim font-medium uppercase text-xs tracking-wider">Vehículo</th>
                                    <th className="p-4 text-cod-text-dim font-medium uppercase text-xs tracking-wider">Servicio</th>
                                    <th className="p-4 text-cod-text-dim font-medium uppercase text-xs tracking-wider">Costo</th>
                                    <th className="p-4 text-cod-text-dim font-medium uppercase text-xs tracking-wider">Notas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cod-border">
                                {allServices.length > 0 ? (
                                    allServices.map((service) => (
                                        <tr key={service.id} className="hover:bg-cod-panel/50 transition-colors group">
                                            <td className="p-4 text-cod-text font-mono text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-neon-green" />
                                                    {new Date(service.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4 text-cod-text font-medium">
                                                {service.vehicleName}
                                            </td>
                                            <td className="p-4 text-cod-text">
                                                <div className="flex items-center gap-2">
                                                    <Wrench size={14} className="text-cod-text-dim" />
                                                    {service.type}
                                                </div>
                                            </td>
                                            <td className="p-4 text-neon-green font-mono font-bold">
                                                {formatCurrency(service.cost)}
                                            </td>
                                            <td className="p-4 text-cod-text-dim text-sm max-w-xs truncate">
                                                {service.notes || '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colspan="5" className="p-8 text-center text-cod-text-dim">
                                            No hay registros de servicio en la base de datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Historial;
