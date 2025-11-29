import { useState } from 'react';
import { Fuel, X, Save, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { calculateFuelEfficiency } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';

const FuelTracker = ({ vehicle, onClose }) => {
    const { addFuelLog, updateVehicle } = useVehicles();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        mileage: vehicle.mileage,
        liters: '',
        cost: ''
    });

    const efficiency = calculateFuelEfficiency(vehicle.fuelLogs || []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Add Log
        addFuelLog(vehicle.id, {
            date: formData.date,
            mileage: parseInt(formData.mileage),
            liters: parseFloat(formData.liters),
            cost: parseFloat(formData.cost)
        });

        // Update Vehicle Mileage if greater
        if (parseInt(formData.mileage) > vehicle.mileage) {
            updateVehicle(vehicle.id, { mileage: parseInt(formData.mileage) });
        }

        onClose();
    };

    const getEfficiencyColor = (eff) => {
        if (eff === 0) return 'text-cod-text-dim';

        // Thresholds
        const isMoto = vehicle.type === 'moto';
        const good = isMoto ? 30 : 12;
        const bad = isMoto ? 20 : 8;

        if (eff >= good) return 'text-neon-green';
        if (eff <= bad) return 'text-cod-orange';
        return 'text-yellow-400';
    };

    const getEfficiencyStatus = (eff) => {
        if (eff === 0) return { label: 'SIN DATOS', icon: AlertCircle };

        const isMoto = vehicle.type === 'moto';
        const good = isMoto ? 30 : 12;
        const bad = isMoto ? 20 : 8;

        if (eff >= good) return { label: 'EFICIENTE', icon: CheckCircle };
        if (eff <= bad) return { label: 'ALTO CONSUMO', icon: AlertCircle };
        return { label: 'REGULAR', icon: TrendingUp };
    };

    const status = getEfficiencyStatus(efficiency.current);
    const colorClass = getEfficiencyColor(efficiency.current);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-cod-panel border border-cod-border w-full max-w-md rounded-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cod-border">
                    <h2 className="text-xl font-display font-bold text-cod-text flex items-center gap-2">
                        <Fuel className="text-neon-green" />
                        REGISTRO DE COMBUSTIBLE
                    </h2>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Efficiency Display */}
                <div className="p-6 bg-cod-darker/50 border-b border-cod-border text-center">
                    <p className="text-cod-text-dim text-xs uppercase tracking-wider mb-2">Rendimiento Actual</p>
                    <div className={`text-4xl font-mono font-bold flex items-center justify-center gap-2 ${colorClass}`}>
                        <status.icon size={32} />
                        {efficiency.current > 0 ? efficiency.current.toFixed(1) : '--'}
                        <span className="text-lg">km/L</span>
                    </div>
                    <div className="mt-2 inline-flex items-center px-2 py-1 rounded border border-cod-border bg-cod-panel text-xs font-bold uppercase tracking-wider text-cod-text">
                        {status.label}
                    </div>
                    {efficiency.average > 0 && (
                        <p className="text-xs text-cod-text-dim mt-4">
                            Promedio Histórico: <span className="text-cod-text">{efficiency.average.toFixed(1)} km/L</span>
                        </p>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Fecha
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="input-cod w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Kilometraje
                            </label>
                            <input
                                type="number"
                                required
                                min={vehicle.mileage}
                                value={formData.mileage}
                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                className="input-cod w-full"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Litros
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.liters}
                                onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                                className="input-cod w-full"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Costo Total
                            </label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                className="input-cod w-full"
                                placeholder="$0.00"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                        >
                            <Save size={20} />
                            GUARDAR REGISTRO
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FuelTracker;
