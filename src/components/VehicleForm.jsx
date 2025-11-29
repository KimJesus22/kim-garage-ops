import { useState } from 'react';
import { X, Save, Car, Bike } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const VehicleForm = ({ onClose }) => {
    const { addVehicle } = useVehicles();
    const [formData, setFormData] = useState({
        type: 'auto',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: '',
        plate: '',
        photo: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addVehicle({
            ...formData,
            year: parseInt(formData.year),
            mileage: parseInt(formData.mileage)
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cod-panel border border-cod-border w-full max-w-md rounded-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cod-border bg-cod-darker/50">
                    <h2 className="text-xl font-display font-bold text-cod-text">NUEVO VEHÍCULO</h2>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-cod-text transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Tipo de Vehículo */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'auto' })}
                            className={`flex flex-col items-center gap-2 p-4 rounded-sm border transition-all ${formData.type === 'auto'
                                ? 'bg-neon-green/10 border-neon-green text-neon-green'
                                : 'bg-cod-dark border-cod-border text-cod-text-dim hover:border-cod-gray'
                                }`}
                        >
                            <Car size={32} />
                            <span className="font-display font-bold">AUTOMÓVIL</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'moto' })}
                            className={`flex flex-col items-center gap-2 p-4 rounded-sm border transition-all ${formData.type === 'moto'
                                ? 'bg-cod-orange/10 border-cod-orange text-cod-orange'
                                : 'bg-cod-dark border-cod-border text-cod-text-dim hover:border-cod-gray'
                                }`}
                        >
                            <Bike size={32} />
                            <span className="font-display font-bold">MOTOCICLETA</span>
                        </button>
                    </div>

                    {/* Marca y Modelo */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Marca
                            </label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="input-cod w-full"
                                placeholder="Ej. Toyota"
                                required
                                list="brands"
                            />
                            <datalist id="brands">
                                <option value="Nissan" />
                                <option value="Chevrolet" />
                                <option value="Volkswagen" />
                                <option value="Kia" />
                                <option value="Toyota" />
                                <option value="Italika" />
                                <option value="Vento" />
                                <option value="Honda" />
                                <option value="Yamaha" />
                                <option value="Bajaj" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Modelo
                            </label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="input-cod w-full"
                                placeholder="Ej. Corolla"
                                required
                                list="models"
                            />
                            <datalist id="models">
                                {/* Autos */}
                                <option value="Versa" />
                                <option value="Aveo" />
                                <option value="Jetta" />
                                <option value="March" />
                                <option value="Rio" />
                                <option value="Tsuru" />
                                {/* Motos */}
                                <option value="FT150" />
                                <option value="DM200" />
                                <option value="Lithium" />
                                <option value="Ryder" />
                                <option value="Cargo 150" />
                                <option value="Pulsar" />
                            </datalist>
                        </div>
                    </div>

                    {/* Año, Kilometraje y Placa */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Año
                            </label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                className="input-cod w-full"
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Kilometraje
                            </label>
                            <input
                                type="number"
                                value={formData.mileage}
                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                className="input-cod w-full"
                                placeholder="0"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                                Placa
                            </label>
                            <input
                                type="text"
                                value={formData.plate}
                                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                className="input-cod w-full uppercase"
                                placeholder="ABC-123"
                                required
                            />
                        </div>
                    </div>

                    {/* URL Foto */}
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                            URL de la Foto
                        </label>
                        <input
                            type="url"
                            value={formData.photo}
                            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                            className="input-cod w-full"
                            placeholder="https://..."
                        />
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
                            Guardar Vehículo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;
