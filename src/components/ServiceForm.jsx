import { useState } from 'react';
import { Wrench, Calendar, DollarSign, X, AlertTriangle } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const ServiceForm = ({ vehicleId, onClose }) => {
    const { addService, vehicles } = useVehicles();
    const vehicle = vehicles.find(v => v.id === vehicleId);

    const [formData, setFormData] = useState({
        type: 'Cambio de Aceite',
        description: '',
        date: new Date().toISOString().split('T')[0],
        cost: '',
        mileageAtService: vehicle ? vehicle.mileage : ''
    });

    const [errors, setErrors] = useState({});

    const serviceTypes = [
        'Cambio de Aceite',
        'Frenos',
        'Neumáticos',
        'Batería',
        'Suspensión',
        'General',
        'Otro'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.description.trim()) newErrors.description = 'Descripción requerida';
        if (!formData.cost || formData.cost < 0) newErrors.cost = 'Costo inválido';
        if (!formData.date) newErrors.date = 'Fecha requerida';
        if (!formData.mileageAtService || formData.mileageAtService < 0) newErrors.mileageAtService = 'Kilometraje inválido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            addService(vehicleId, {
                ...formData,
                cost: parseFloat(formData.cost),
                mileageAtService: parseInt(formData.mileageAtService)
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cod-dark border border-cod-border-light rounded-sm max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-cod-border">
                    <h2 className="text-xl font-display font-bold text-neon-green uppercase tracking-wider flex items-center gap-2">
                        <Wrench size={20} />
                        Registrar Servicio
                    </h2>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-cod-text">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Tipo de Servicio */}
                    <div>
                        <label className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                            Tipo de Servicio
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="input-cod w-full"
                        >
                            {serviceTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                            Descripción
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-cod w-full"
                            placeholder="Detalles del servicio..."
                        />
                        {errors.description && <p className="text-cod-orange text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Costo y Fecha */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                                Costo
                            </label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim" />
                                <input
                                    type="number"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    className="input-cod w-full pl-9"
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.cost && <p className="text-cod-orange text-xs mt-1">{errors.cost}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                                Fecha
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="input-cod w-full"
                            />
                            {errors.date && <p className="text-cod-orange text-xs mt-1">{errors.date}</p>}
                        </div>
                    </div>

                    {/* Kilometraje al momento del servicio */}
                    <div>
                        <label className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                            Kilometraje Actual
                        </label>
                        <input
                            type="number"
                            name="mileageAtService"
                            value={formData.mileageAtService}
                            onChange={handleChange}
                            className="input-cod w-full"
                        />
                        {errors.mileageAtService && <p className="text-cod-orange text-xs mt-1">{errors.mileageAtService}</p>}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-4 border-t border-cod-border mt-6">
                        <button type="submit" className="btn-primary flex-1">
                            Guardar
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceForm;
