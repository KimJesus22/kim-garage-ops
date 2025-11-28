import { useState } from 'react';
import { Car, Bike, Edit2, Check, X, Wrench, AlertTriangle, FileText, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import ServiceForm from './ServiceForm';
import { generateVehicleReport } from '../utils/pdfGenerator';
import { calculateCostPerKm } from '../utils/calculations';
import VehicleRankBadge from './VehicleRankBadge';

const VehicleCard = ({ vehicle }) => {
    // ... existing hooks ...
    const { updateVehicle } = useVehicles();
    const [isEditingMileage, setIsEditingMileage] = useState(false);
    const [newMileage, setNewMileage] = useState(vehicle.mileage);
    const [showServiceForm, setShowServiceForm] = useState(false);

    // ... existing handlers ...
    const handleSaveMileage = () => {
        if (newMileage && newMileage > 0) {
            updateVehicle(vehicle.id, { mileage: parseInt(newMileage) });
            setIsEditingMileage(false);
        }
    };

    const handleCancelEdit = () => {
        setNewMileage(vehicle.mileage);
        setIsEditingMileage(false);
    };

    const VehicleIcon = vehicle.type === 'auto' ? Car : Bike;

    // ... existing alert logic ...
    const getLastOilChange = () => {
        if (!vehicle.services || vehicle.services.length === 0) return null;
        return vehicle.services
            .filter(s => s.type === 'Cambio de Aceite')
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    };

    const lastOilChange = getLastOilChange();
    const serviceInterval = vehicle.type === 'moto' ? 5000 : 10000;
    const nextServiceKm = lastOilChange ? lastOilChange.mileageAtService + serviceInterval : null;

    const isUrgent = lastOilChange && (vehicle.mileage >= lastOilChange.mileageAtService + 10000);
    const isDueSoon = nextServiceKm && vehicle.mileage >= nextServiceKm;

    // Cost Per Km Logic
    const costPerKm = calculateCostPerKm(vehicle);
    let costStatus = 'normal';
    let CostIcon = Minus;
    let costColor = 'text-cod-text-dim';

    if (costPerKm < 1.00) {
        costStatus = 'efficient';
        CostIcon = TrendingDown;
        costColor = 'text-neon-green';
    } else if (costPerKm > 3.00) {
        costStatus = 'high';
        CostIcon = TrendingUp;
        costColor = 'text-cod-orange';
    }

    return (
        <>
            <div className={`card-cod group hover:border-neon-green/30 overflow-hidden relative ${isUrgent ? 'border-cod-orange shadow-neon-orange' : ''}`}>
                {/* ... existing content ... */}
                {isUrgent && (
                    <div className="absolute top-0 right-0 z-10">
                        <div className="bg-cod-orange text-cod-darker text-xs font-bold px-3 py-1 flex items-center gap-1 animate-pulse">
                            <AlertTriangle size={12} />
                            URGENTE
                        </div>
                    </div>
                )}

                {/* Imagen */}
                <div className="relative h-48 -m-6 mb-4 overflow-hidden">
                    <img
                        src={vehicle.photo}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cod-panel via-transparent to-transparent"></div>

                    {/* Badge de tipo */}
                    <div className={`
              absolute top-4 left-4 px-3 py-1.5 rounded-sm flex items-center gap-2
              ${vehicle.type === 'auto'
                            ? 'bg-neon-green/20 border border-neon-green/50 text-neon-green'
                            : 'bg-cod-orange/20 border border-cod-orange/50 text-cod-orange'
                        }
            `}>
                        <VehicleIcon size={16} />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            {vehicle.type}
                        </span>
                    </div>
                </div>

                {/* Información */}
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-display font-bold text-cod-text leading-tight">
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                                <p className="text-cod-text-dim text-sm uppercase tracking-wide">
                                    Año {vehicle.year}
                                </p>
                            </div>
                            <VehicleRankBadge mileage={vehicle.mileage} />
                        </div>
                    </div>

                    {/* Costo Operativo (Nuevo) */}
                    <div className="flex items-center justify-between py-2 border-b border-cod-border/50">
                        <span className="text-xs text-cod-text-dim uppercase tracking-wider">Costo Operativo</span>
                        <div className={`flex items-center gap-1.5 ${costColor}`}>
                            <CostIcon size={16} />
                            <span className="font-mono font-bold text-sm">
                                ${costPerKm.toFixed(2)} / km
                            </span>
                        </div>
                    </div>

                    {/* Estado de Mantenimiento */}
                    <div className="py-2">
                        {lastOilChange ? (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-cod-text-dim">Próximo cambio:</span>
                                <span className={`${isDueSoon ? 'text-cod-orange font-bold' : 'text-neon-green'}`}>
                                    {nextServiceKm.toLocaleString()} km
                                </span>
                            </div>
                        ) : (
                            <p className="text-xs text-cod-text-dim italic">Sin servicios registrados</p>
                        )}
                    </div>

                    {/* Kilometraje Editable */}
                    <div className="pt-3 border-t border-cod-border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-cod-text-dim uppercase tracking-wider">
                                Kilometraje
                            </span>

                            {!isEditingMileage && (
                                <button
                                    onClick={() => setIsEditingMileage(true)}
                                    className="text-neon-green hover:text-neon-green-dark transition-colors"
                                    title="Editar kilometraje"
                                >
                                    <Edit2 size={14} />
                                </button>
                            )}
                        </div>

                        {isEditingMileage ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={newMileage}
                                    onChange={(e) => setNewMileage(e.target.value)}
                                    className="input-cod flex-1 text-sm py-1.5"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveMileage();
                                        if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                />
                                <button
                                    onClick={handleSaveMileage}
                                    className="p-1.5 bg-neon-green text-cod-darker rounded-sm hover:bg-neon-green-dark transition-colors"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="p-1.5 bg-cod-gray text-cod-text rounded-sm hover:bg-cod-gray-light transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <p className="text-2xl font-display font-bold text-neon-green">
                                {vehicle.mileage.toLocaleString()} km
                            </p>
                        )}
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => setShowServiceForm(true)}
                            className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm py-2"
                        >
                            <Wrench size={16} />
                            Servicio
                        </button>
                        <button
                            onClick={() => generateVehicleReport(vehicle)}
                            className="px-3 btn-secondary flex items-center justify-center text-cod-text-dim hover:text-neon-green"
                            title="Generar Reporte PDF"
                        >
                            <FileText size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {showServiceForm && (
                <ServiceForm
                    vehicleId={vehicle.id}
                    onClose={() => setShowServiceForm(false)}
                />
            )}
        </>
    );
};

export default VehicleCard;
