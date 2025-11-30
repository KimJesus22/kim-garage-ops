import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVehicles } from '../context/VehicleContext';
import { Car, Bike, Calendar, Gauge, Wrench, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Showroom = () => {
    const { token } = useParams();
    const { fetchPublicVehicle } = useVehicles();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadVehicle = async () => {
            if (!token) return;
            const data = await fetchPublicVehicle(token);
            if (data) {
                setVehicle(data);
            } else {
                setError('Vehículo no encontrado o enlace expirado.');
            }
            setLoading(false);
        };
        loadVehicle();
    }, [token, fetchPublicVehicle]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cod-darker flex items-center justify-center">
                <div className="animate-spin h-12 w-12 border-4 border-neon-green border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="min-h-screen bg-cod-darker flex flex-col items-center justify-center text-cod-text p-4">
                <AlertTriangle size={64} className="text-cod-orange mb-4" />
                <h1 className="text-2xl font-display font-bold mb-2">Enlace No Disponible</h1>
                <p className="text-cod-text-dim">{error || 'El vehículo que buscas no existe o es privado.'}</p>
            </div>
        );
    }

    const VehicleIcon = vehicle.type === 'auto' ? Car : Bike;
    const sortedServices = (vehicle.services || []).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="min-h-screen bg-cod-darker text-cod-text font-sans">
            {/* Hero Section */}
            <div className="relative h-[50vh] w-full overflow-hidden">
                <img
                    src={vehicle.photo || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80'}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cod-darker via-cod-darker/50 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-neon-green text-cod-darker font-bold text-xs uppercase rounded-sm">
                                {vehicle.type}
                            </span>
                            <span className="px-3 py-1 bg-cod-panel/80 backdrop-blur text-cod-text font-mono text-xs rounded-sm border border-cod-border">
                                {vehicle.plate}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2">
                            {vehicle.brand} {vehicle.model}
                        </h1>
                        <p className="text-xl text-cod-text-dim font-light">
                            Edición {vehicle.year} • Mantenimiento Certificado
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-5xl mx-auto p-6 md:p-12 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Specs Card */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-cod-panel border border-cod-border rounded-sm p-6 shadow-2xl">
                            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                                <Gauge className="text-neon-green" />
                                ESPECIFICACIONES
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs text-cod-text-dim uppercase mb-1">Kilometraje</p>
                                    <p className="text-2xl font-mono font-bold text-white">
                                        {vehicle.mileage.toLocaleString()} km
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-cod-text-dim uppercase mb-1">Año</p>
                                    <p className="text-2xl font-mono font-bold text-white">
                                        {vehicle.year}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-cod-text-dim uppercase mb-1">Servicios</p>
                                    <p className="text-2xl font-mono font-bold text-white">
                                        {vehicle.services?.length || 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-cod-text-dim uppercase mb-1">Estado</p>
                                    <p className="text-2xl font-mono font-bold text-neon-green">
                                        ACTIVO
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Service History */}
                        <div className="bg-cod-panel border border-cod-border rounded-sm p-6 shadow-2xl">
                            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-neon-green" />
                                HISTORIAL DE MANTENIMIENTO
                            </h2>

                            {sortedServices.length > 0 ? (
                                <div className="space-y-4">
                                    {sortedServices.slice(0, 5).map((service) => (
                                        <div key={service.id} className="flex items-start gap-4 p-4 bg-cod-dark rounded-sm border border-cod-border/50 hover:border-neon-green/30 transition-colors">
                                            <div className="p-2 bg-cod-darker rounded-full text-neon-green">
                                                <Wrench size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-white">{service.type}</h3>
                                                    <span className="text-xs font-mono text-cod-text-dim">
                                                        {new Date(service.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-cod-text-dim mb-2">{service.description}</p>
                                                <div className="flex gap-3 text-xs">
                                                    <span className="px-2 py-0.5 bg-cod-darker rounded text-cod-text-dim border border-cod-border">
                                                        {service.mileage_at_service?.toLocaleString()} km
                                                    </span>
                                                    {service.parts_used && service.parts_used.length > 0 && (
                                                        <span className="px-2 py-0.5 bg-cod-darker rounded text-cod-text-dim border border-cod-border">
                                                            {service.parts_used.length} refacciones
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {sortedServices.length > 5 && (
                                        <p className="text-center text-sm text-cod-text-dim italic pt-2">
                                            y {sortedServices.length - 5} servicios más...
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12 border-2 border-dashed border-cod-border rounded-sm">
                                    <p className="text-cod-text-dim">No hay servicios registrados públicamente.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-cod-panel border border-cod-border rounded-sm p-6 shadow-2xl sticky top-6">
                            <h3 className="font-bold text-white mb-4">Resumen de Salud</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-cod-text-dim">Motor</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-neon-green"></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-cod-text-dim">Frenos</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`w-2 h-2 rounded-full ${i > 4 ? 'bg-cod-border' : 'bg-neon-green'}`}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-cod-text-dim">Suspensión</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`w-2 h-2 rounded-full ${i > 3 ? 'bg-cod-border' : 'bg-neon-green'}`}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6 mt-6 border-t border-cod-border">
                                    <p className="text-xs text-cod-text-dim text-center">
                                        Este vehículo es mantenido y monitoreado digitalmente mediante
                                        <span className="block text-neon-green font-bold mt-1">GARAGE OPS TÁCTICO</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Showroom;
