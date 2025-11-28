import { useState } from 'react';
import { Car, Bike, X } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const VehicleForm = ({ onClose }) => {
    const { addVehicle } = useVehicles();
    const [formData, setFormData] = useState({
        type: 'auto',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: '',
        photo: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, type }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.brand.trim()) {
            newErrors.brand = 'La marca es requerida';
        }
        if (!formData.model.trim()) {
            newErrors.model = 'El modelo es requerido';
        }
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Año inválido';
        }
        if (!formData.mileage || formData.mileage < 0) {
            newErrors.mileage = 'El kilometraje es requerido';
        }
        if (!formData.photo.trim()) {
            newErrors.photo = 'La URL de la foto es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            addVehicle({
                ...formData,
                year: parseInt(formData.year),
                mileage: parseInt(formData.mileage)
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cod-dark border border-cod-border-light rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-cod">
                {/* Header */}
                <div className="sticky top-0 bg-cod-dark border-b border-cod-border p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold text-neon-green text-glow-green uppercase tracking-wider">
                        Agregar Vehículo
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-cod-text-dim hover:text-cod-text transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Selector de Tipo */}
                    <div>
                        <label className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-3">
                            Tipo de Vehículo
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleTypeSelect('auto')}
                                className={`
                  p-6 rounded-sm border-2 transition-all duration-200
                  flex flex-col items-center gap-3
                  ${formData.type === 'auto'
                                        ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-neon-green'
                                        : 'border-cod-border bg-cod-panel text-cod-text-dim hover:border-cod-border-light'
                                    }
                `}
                            >
                                <Car size={40} />
                                <span className="font-semibold uppercase tracking-wider">Auto</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTypeSelect('moto')}
                                className={`
                  p-6 rounded-sm border-2 transition-all duration-200
                  flex flex-col items-center gap-3
                  ${formData.type === 'moto'
                                        ? 'border-cod-orange bg-cod-orange/10 text-cod-orange shadow-neon-orange'
                                        : 'border-cod-border bg-cod-panel text-cod-text-dim hover:border-cod-border-light'
                                    }
                `}
                            >
                                <Bike size={40} />
                                <span className="font-semibold uppercase tracking-wider">Moto</span>
                            </button>
                        </div>
                    </div>

                    {/* Marca */}
                    <div>
                        <label htmlFor="brand" className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                            Marca *
                        </label>
                        <input
                            type="text"
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="input-cod w-full"
                            placeholder="Ej: Toyota, Honda, Yamaha"
                        />
                        {errors.brand && (
                            <p className="text-cod-orange text-xs mt-1">{errors.brand}</p>
                        )}
                    </div>

                    {/* Modelo */}
                    <div>
                        <label htmlFor="model" className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                            Modelo *
                        </label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className="input-cod w-full"
                            placeholder="Ej: Corolla, Civic, MT-07"
                        />
                        {errors.model && (
                            <p className="text-cod-orange text-xs mt-1">{errors.model}</p>
                        )}
                    </div>

                    {/* Año y Kilometraje */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="year" className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                                Año *
                            </label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="input-cod w-full"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                            />
                            {errors.year && (
                                <p className="text-cod-orange text-xs mt-1">{errors.year}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="mileage" className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                                Kilometraje *
                            </label>
                            <input
                                type="number"
                                id="mileage"
                                name="mileage"
                                value={formData.mileage}
                                onChange={handleChange}
                                className="input-cod w-full"
                                min="0"
                                placeholder="0"
                            />
                            {errors.mileage && (
                                <p className="text-cod-orange text-xs mt-1">{errors.mileage}</p>
                            )}
                        </div>
                    </div>

                    {/* Foto URL */}
                    <div>
                        <label htmlFor="photo" className="block text-sm font-semibold text-cod-text uppercase tracking-wider mb-2">
                            URL de la Foto *
                        </label>
                        <input
                            type="url"
                            id="photo"
                            name="photo"
                            value={formData.photo}
                            onChange={handleChange}
                            className="input-cod w-full"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                        {errors.photo && (
                            <p className="text-cod-orange text-xs mt-1">{errors.photo}</p>
                        )}
                        <p className="text-cod-text-dim text-xs mt-1">
                            Puedes usar URLs de Unsplash, Pexels u otras fuentes
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-4 pt-4 border-t border-cod-border">
                        <button
                            type="submit"
                            className="btn-primary flex-1"
                        >
                            Guardar Vehículo
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;
