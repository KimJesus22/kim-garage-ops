import { useState, useMemo } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Shield, DollarSign, Car, Bike } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { calculateCostPerKm } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const TripSimulator = () => {
    const { vehicles } = useVehicles();
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [distance, setDistance] = useState('');
    const [destination, setDestination] = useState('');

    const selectedVehicle = useMemo(() =>
        vehicles.find(v => v.id === selectedVehicleId),
        [vehicles, selectedVehicleId]);

    const simulation = useMemo(() => {
        if (!selectedVehicle || !distance) return null;

        const dist = parseFloat(distance);
        const currentMileage = parseInt(selectedVehicle.mileage);
        const projectedMileage = currentMileage + dist;

        // Cost Calculation
        let costPerKm = calculateCostPerKm(selectedVehicle);
        // Fallback defaults if no history
        if (costPerKm === 0) {
            costPerKm = selectedVehicle.type === 'moto' ? 0.8 : 1.5;
        }
        const estimatedCost = dist * costPerKm;

        // Service Risk Analysis
        // Logic: Find last oil change, add interval (5k moto / 10k auto)
        const lastOilChange = selectedVehicle.services?.find(s => s.type === 'Cambio de Aceite');
        const lastServiceKm = lastOilChange ? lastOilChange.mileageAtService : 0; // If never serviced, assume 0
        const interval = selectedVehicle.type === 'moto' ? 5000 : 10000;
        const nextServiceKm = lastServiceKm + interval;

        const serviceDueInTrip = projectedMileage >= nextServiceKm;
        const kmRemainingBefore = nextServiceKm - currentMileage;
        const kmRemainingAfter = nextServiceKm - projectedMileage;

        // Oil Life Percentage (for progress bar)
        // 100% = 0 km since service, 0% = interval reached
        const kmSinceService = currentMileage - lastServiceKm;
        const oilLifeCurrent = Math.max(0, Math.min(100, 100 - (kmSinceService / interval * 100)));
        const oilLifeProjected = Math.max(0, Math.min(100, 100 - ((kmSinceService + dist) / interval * 100)));

        return {
            estimatedCost,
            serviceDueInTrip,
            nextServiceKm,
            kmRemainingBefore,
            kmRemainingAfter,
            oilLifeCurrent,
            oilLifeProjected
        };
    }, [selectedVehicle, distance]);

    return (
        <div className="card-cod border-l-4 border-l-neon-green relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Navigation size={120} />
            </div>

            <h2 className="text-xl font-display font-bold text-cod-text mb-6 flex items-center gap-2">
                <MapPin className="text-neon-green" />
                SIMULADOR DE RUTA TÁCTICA
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                            Vehículo de la Misión
                        </label>
                        <select
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                            className="input-cod w-full"
                        >
                            <option value="">Seleccionar Vehículo...</option>
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.brand} {v.model} ({v.type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Distancia (KM)
                            </label>
                            <input
                                type="number"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="input-cod w-full"
                                placeholder="0"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Destino (Opcional)
                            </label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="input-cod w-full"
                                placeholder="Ej. Cuernavaca"
                            />
                        </div>
                    </div>
                </div>

                {/* Results / Mission Briefing */}
                <div className="bg-cod-darker border border-cod-border rounded-sm p-4 relative">
                    <div className="absolute top-0 left-0 bg-cod-text-dim text-cod-darker text-[10px] font-bold px-2 py-0.5 uppercase">
                        Mission Briefing
                    </div>

                    {!simulation ? (
                        <div className="h-full flex flex-col items-center justify-center text-cod-text-dim opacity-50 min-h-[150px]">
                            <Navigation size={48} className="mb-2" />
                            <p className="text-sm">Configure los parámetros de la misión</p>
                        </div>
                    ) : (
                        <div className="mt-4 space-y-4">
                            {/* Status Alert */}
                            <div className={`p-3 rounded-sm border flex items-start gap-3 ${simulation.serviceDueInTrip
                                    ? 'bg-cod-orange/10 border-cod-orange text-cod-orange'
                                    : 'bg-neon-green/10 border-neon-green text-neon-green'
                                }`}>
                                {simulation.serviceDueInTrip ? (
                                    <AlertTriangle className="shrink-0" />
                                ) : (
                                    <CheckCircle className="shrink-0" />
                                )}
                                <div>
                                    <h4 className="font-bold text-sm uppercase">
                                        {simulation.serviceDueInTrip ? 'RIESGO DETECTADO' : 'VEHÍCULO APTO'}
                                    </h4>
                                    <p className="text-xs opacity-90">
                                        {simulation.serviceDueInTrip
                                            ? 'El servicio de mantenimiento vencerá durante el trayecto.'
                                            : 'El vehículo cuenta con vida útil suficiente para esta ruta.'}
                                    </p>
                                </div>
                            </div>

                            {/* Cost Estimation */}
                            <div className="flex items-center justify-between border-b border-cod-border/50 pb-2">
                                <span className="text-cod-text-dim text-xs uppercase">Costo Estimado (Desgaste)</span>
                                <span className="font-mono font-bold text-lg text-cod-text">
                                    {formatCurrency(simulation.estimatedCost)}
                                </span>
                            </div>

                            {/* Oil Life Progress */}
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-cod-text-dim uppercase">Vida Útil Aceite (Post-Viaje)</span>
                                    <span className={`font-mono font-bold ${simulation.oilLifeProjected < 20 ? 'text-cod-orange' : 'text-neon-green'}`}>
                                        {simulation.oilLifeProjected.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-cod-dark rounded-full overflow-hidden relative">
                                    {/* Current Life (Background) */}
                                    <div
                                        className="absolute top-0 left-0 h-full bg-cod-text-dim/30"
                                        style={{ width: `${simulation.oilLifeCurrent}%` }}
                                    ></div>
                                    {/* Projected Life (Foreground) */}
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${simulation.oilLifeProjected < 20 ? 'bg-cod-orange' : 'bg-neon-green'
                                            }`}
                                        style={{ width: `${simulation.oilLifeProjected}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-cod-text-dim mt-1 text-right">
                                    {simulation.kmRemainingAfter > 0
                                        ? `${simulation.kmRemainingAfter.toLocaleString()} km restantes`
                                        : `Excedido por ${Math.abs(simulation.kmRemainingAfter).toLocaleString()} km`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripSimulator;
