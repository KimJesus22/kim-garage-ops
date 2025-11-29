import { useState, useMemo, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, CheckCircle, Shield, DollarSign, Car, Bike } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { calculateCostPerKm } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CDMX_COORDS = [19.4326, -99.1332];

const TripSimulator = () => {
    const { vehicles } = useVehicles();
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [distance, setDistance] = useState('');
    const [destination, setDestination] = useState('');
    const [markerPos, setMarkerPos] = useState(null);

    const selectedVehicle = useMemo(() =>
        vehicles.find(v => v.id === selectedVehicleId),
        [vehicles, selectedVehicleId]);

    // Haversine Formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                setMarkerPos(e.latlng);
                const dist = calculateDistance(CDMX_COORDS[0], CDMX_COORDS[1], e.latlng.lat, e.latlng.lng);
                setDistance(Math.round(dist)); // Round to nearest km
            },
        });

        return markerPos === null ? null : (
            <Marker position={markerPos}>
                <Popup>Destino Seleccionado</Popup>
            </Marker>
        );
    };

    const simulation = useMemo(() => {
        if (!selectedVehicle || !distance) return null;

        const dist = parseFloat(distance);
        const currentMileage = parseInt(selectedVehicle.mileage);
        const projectedMileage = currentMileage + dist;

        // Cost Calculation
        let costPerKm = calculateCostPerKm(selectedVehicle);
        if (costPerKm === 0) {
            costPerKm = selectedVehicle.type === 'moto' ? 0.8 : 1.5;
        }
        const estimatedCost = dist * costPerKm;

        // Service Risk Analysis
        const lastOilChange = selectedVehicle.services?.find(s => s.type === 'Cambio de Aceite');
        const lastServiceKm = lastOilChange ? lastOilChange.mileageAtService : 0;
        const interval = selectedVehicle.type === 'moto' ? 5000 : 10000;
        const nextServiceKm = lastServiceKm + interval;

        const serviceDueInTrip = projectedMileage >= nextServiceKm;
        const kmRemainingBefore = nextServiceKm - currentMileage;
        const kmRemainingAfter = nextServiceKm - projectedMileage;

        // Oil Life Percentage
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
            <h2 className="text-xl font-display font-bold text-cod-text mb-6 flex items-center gap-2">
                <MapPin className="text-neon-green" />
                SIMULADOR DE RUTA TÁCTICA
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Controls & Results */}
                <div className="space-y-6 flex flex-col h-full">
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
                    <div className="bg-cod-darker border border-cod-border rounded-sm p-4 relative flex-1">
                        <div className="absolute top-0 left-0 bg-cod-text-dim text-cod-darker text-[10px] font-bold px-2 py-0.5 uppercase">
                            Mission Briefing
                        </div>

                        {!simulation ? (
                            <div className="h-full flex flex-col items-center justify-center text-cod-text-dim opacity-50 min-h-[150px]">
                                <Navigation size={48} className="mb-2" />
                                <p className="text-sm text-center">Seleccione un punto en el mapa<br />o ingrese la distancia manualmente</p>
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
                                    <span className="text-cod-text-dim text-xs uppercase">Costo Estimado</span>
                                    <span className="font-mono font-bold text-lg text-cod-text">
                                        {formatCurrency(simulation.estimatedCost)}
                                    </span>
                                </div>

                                {/* Oil Life Progress */}
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-cod-text-dim uppercase">Vida Útil Aceite</span>
                                        <span className={`font-mono font-bold ${simulation.oilLifeProjected < 20 ? 'text-cod-orange' : 'text-neon-green'}`}>
                                            {simulation.oilLifeProjected.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-cod-dark rounded-full overflow-hidden relative">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-cod-text-dim/30"
                                            style={{ width: `${simulation.oilLifeCurrent}%` }}
                                        ></div>
                                        <div
                                            className={`absolute top-0 left-0 h-full transition-all duration-500 ${simulation.oilLifeProjected < 20 ? 'bg-cod-orange' : 'bg-neon-green'
                                                }`}
                                            style={{ width: `${simulation.oilLifeProjected}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Map */}
                <div className="h-[400px] lg:h-auto min-h-[400px] rounded-lg overflow-hidden border border-cod-border relative shadow-2xl">
                    <MapContainer
                        center={CDMX_COORDS}
                        zoom={10}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            className="map-tiles-dark"
                        />
                        {/* Center Marker (Base) */}
                        <Marker position={CDMX_COORDS}>
                            <Popup>Base de Operaciones (CDMX)</Popup>
                        </Marker>
                        <LocationMarker />
                    </MapContainer>

                    {/* Map Overlay Styles */}
                    <div className="absolute inset-0 pointer-events-none border-[1px] border-neon-green/20 rounded-lg z-[1000] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>

                    {/* CSS Filter for Dark Mode Map */}
                    <style>{`
                        .map-tiles-dark {
                            filter: grayscale(100%) invert(100%) contrast(85%);
                        }
                        .leaflet-container {
                            background: #000 !important;
                        }
                    `}</style>
                </div>
            </div>
        </div>
    );
};

export default TripSimulator;
