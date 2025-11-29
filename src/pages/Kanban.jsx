import { motion } from 'framer-motion';
import { useVehicles } from '../context/VehicleContext';
import { Clock, Wrench, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Kanban = () => {
    const { vehicles, updateServiceStatus } = useVehicles();

    // Flatten all services from all vehicles into a single list with vehicle info
    const allServices = vehicles.flatMap(vehicle =>
        (vehicle.services || []).map(service => ({
            ...service,
            vehicleId: vehicle.id,
            vehicleName: `${vehicle.brand} ${vehicle.model}`,
            vehiclePlate: vehicle.plate
        }))
    );

    const columns = [
        {
            id: 'pending',
            title: 'POR HACER',
            icon: Clock,
            color: 'text-yellow-500',
            borderColor: 'border-yellow-500',
            bg: 'bg-yellow-500/5'
        },
        {
            id: 'in_progress',
            title: 'EN OPERACIÓN',
            icon: Wrench,
            color: 'text-blue-500',
            borderColor: 'border-blue-500',
            bg: 'bg-blue-500/5'
        },
        {
            id: 'completed',
            title: 'MISIÓN CUMPLIDA',
            icon: CheckCircle,
            color: 'text-neon-green',
            borderColor: 'border-neon-green',
            bg: 'bg-neon-green/5'
        }
    ];

    const getNextStatus = (currentStatus) => {
        if (currentStatus === 'pending') return 'in_progress';
        if (currentStatus === 'in_progress') return 'completed';
        return null;
    };

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-cod-text tracking-wider">TABLERO TÁCTICO</h1>
                        <p className="text-cod-text-dim font-mono text-sm">MONITOREO DE OPERACIONES EN TIEMPO REAL</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {columns.map(col => {
                        const servicesInCol = allServices.filter(s => (s.status || 'completed') === col.id);

                        return (
                            <div key={col.id} className={`flex flex-col h-full bg-cod-dark/50 border-t-4 ${col.borderColor} rounded-sm overflow-hidden`}>
                                {/* Column Header */}
                                <div className={`p-4 ${col.bg} border-b border-cod-border flex items-center justify-between`}>
                                    <div className="flex items-center gap-2">
                                        <col.icon className={col.color} size={20} />
                                        <h3 className={`font-display font-bold tracking-wider ${col.color}`}>{col.title}</h3>
                                    </div>
                                    <span className="bg-cod-darker px-2 py-1 rounded text-xs font-mono text-cod-text-dim">
                                        {servicesInCol.length}
                                    </span>
                                </div>

                                {/* Cards Container */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-cod">
                                    {servicesInCol.length > 0 ? (
                                        servicesInCol.map(service => (
                                            <motion.div
                                                key={service.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-cod-panel border border-cod-border p-3 rounded-sm shadow-lg hover:border-cod-text-dim transition-colors group"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-bold text-cod-text-dim uppercase tracking-wider">{service.type}</span>
                                                    <span className="text-[10px] font-mono text-cod-text-dim/70">{service.date}</span>
                                                </div>

                                                <div className="mb-3">
                                                    <h4 className="text-cod-text font-bold text-sm">{service.vehicleName}</h4>
                                                    {service.vehiclePlate && (
                                                        <span className="text-xs font-mono text-cod-text-dim bg-cod-darker px-1 rounded">
                                                            [{service.vehiclePlate}]
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex justify-end pt-2 border-t border-cod-border/30">
                                                    {getNextStatus(service.status || 'completed') && (
                                                        <button
                                                            onClick={() => updateServiceStatus(service.vehicleId, service.id, getNextStatus(service.status || 'completed'))}
                                                            className="text-xs flex items-center gap-1 text-cod-text-dim hover:text-neon-green transition-colors uppercase font-bold tracking-wider"
                                                        >
                                                            Avanzar <ArrowRight size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-cod-text-dim/30 space-y-2">
                                            <AlertCircle size={32} />
                                            <span className="text-xs uppercase tracking-widest">Sin Misiones</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageTransition>
    );
};

export default Kanban;
