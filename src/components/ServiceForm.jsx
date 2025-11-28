import { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, Wrench, AlertTriangle } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const ServiceForm = ({ vehicleId, onClose }) => {
    const { vehicles, addService } = useVehicles();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    const [formData, setFormData] = useState({
        type: 'Mantenimiento Preventivo',
        date: new Date().toISOString().split('T')[0],
        cost: '',
        mileageAtService: vehicle ? vehicle.mileage : '',
        notes: ''
    });

    // Set default cost based on vehicle type
    useEffect(() => {
        if (vehicle) {
            if (vehicle.type === 'moto') {
                setFormData(prev => ({ ...prev, cost: '600' }));
            } else {
                setFormData(prev => ({ ...prev, cost: '1500' }));
            }
        }
    }, [vehicle]);

    const serviceTypes = [
        'Mantenimiento Preventivo',
        'Cambio de Aceite',
        'Frenos',
        'Llantas',
        'Batería',
        'Reparación General',
        'Otro'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        addService(vehicleId, {
            ...formData,
            cost: parseFloat(formData.cost),
            mileageAtService: parseInt(formData.mileageAtService)
        });
        onClose();
    };

    if (!vehicle) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cod-panel border border-cod-border w-full max-w-md rounded-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cod-border bg-cod-darker/50">
                    <h2 className="text-xl font-display font-bold text-cod-text flex items-center gap-2">
                        <Wrench className="text-neon-green" size={20} />
                        Registrar Servicio
                    </h2>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-cod-text transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Tipo de Servicio */}
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                            Tipo de Servicio
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="input-cod w-full"
                        >
                            {serviceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fecha y Costo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Fecha
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim" size={16} />
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-cod w-full pl-10"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Costo (MXN)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim" size={16} />
                                <input
                                    type="number"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                                    className="input-cod w-full pl-10"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Kilometraje */}
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                            Kilometraje al momento del servicio
                        </label>
                        <input
                            type="number"
                            value={formData.mileageAtService}
                            onChange={(e) => setFormData({ ...formData, mileageAtService: e.target.value })}
                            className="input-cod w-full"
                            required
                        />
                        {parseInt(formData.mileageAtService) < vehicle.mileage && (
                            <p className="text-cod-orange text-xs mt-1 flex items-center gap-1">
                                <AlertTriangle size={12} />
                                Menor al kilometraje actual ({vehicle.mileage} km)
                            </p>
                        )}
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                            Notas Adicionales
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="input-cod w-full h-24 resize-none"
                            placeholder="Detalles del trabajo realizado..."
                        ></textarea>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                            <Save size={18} />
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
