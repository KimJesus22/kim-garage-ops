import { useState } from 'react';
import { X, Save, Car, Bike, ScanLine, Loader2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { useVehicles } from '../context/VehicleContext';
import { useStorage } from '../hooks/useStorage';

const VehicleForm = ({ onClose }) => {
    const { addVehicle } = useVehicles();
    const { uploadImage, uploading } = useStorage();
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [ocrStatus, setOcrStatus] = useState('');

    const [formData, setFormData] = useState({
        type: 'auto',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        mileage: '',
        plate: '',
        photo: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        let photoUrl = formData.photo;

        if (file) {
            const url = await uploadImage(file);
            if (url) photoUrl = url;
        }

        await addVehicle({
            ...formData,
            photo: photoUrl,
            year: parseInt(formData.year),
            mileage: parseInt(formData.mileage)
        });
        onClose();
    };

    const handleOCR = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Prefer rear camera on mobile

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setScanning(true);
            setOcrStatus('Procesando Inteligencia...');

            try {
                const worker = await createWorker('eng'); // English is usually fine for alphanumeric

                setOcrStatus('Procesando Inteligencia...');
                const ret = await worker.recognize(file);

                setOcrStatus('Analizando texto...');
                const text = ret.data.text;

                // Simple regex to find potential plates (alphanumeric sequences of 6-9 chars) or VINs (17 chars)
                // This is a basic heuristic
                const words = text.split(/\s+/);
                const potentialPlate = words.find(w => /^[A-Z0-9-]{6,17}$/.test(w));

                if (potentialPlate) {
                    // Clean up common OCR errors if needed, but for now just take it
                    const cleanPlate = potentialPlate.replace(/[^A-Z0-9-]/g, '');
                    setFormData(prev => ({ ...prev, plate: cleanPlate }));
                    setOcrStatus('¡Identificación Exitosa!');
                } else {
                    setOcrStatus('No se detectó Placa/VIN.');
                }

                await worker.terminate();
            } catch (err) {
                console.error("OCR Error:", err);
                setOcrStatus('Error en escaneo.');
            } finally {
                setTimeout(() => {
                    setScanning(false);
                    setOcrStatus('');
                }, 1500);
            }
        };

        input.click();
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

                    {/* Marca, Modelo y Placa */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1 flex justify-between items-center">
                                <span>Placa / VIN</span>
                                {scanning && <span className="text-neon-green text-[10px] animate-pulse">{ocrStatus}</span>}
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                    className="input-cod w-full uppercase"
                                    placeholder="ABC-123"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleOCR}
                                    disabled={scanning}
                                    className="p-2 bg-cod-dark border border-cod-border rounded-sm hover:border-neon-green hover:text-neon-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Escanear Placa/VIN"
                                >
                                    {scanning ? <Loader2 size={20} className="animate-spin" /> : <ScanLine size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Año y Kilometraje */}
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Foto Upload */}
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">
                            Foto del Vehículo
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="input-cod w-full file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-neon-green/10 file:text-neon-green hover:file:bg-neon-green/20"
                            />
                            {uploading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin h-5 w-5 border-2 border-neon-green border-t-transparent rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-cod-text-dim mt-1">
                            {file ? `Archivo seleccionado: ${file.name}` : 'Sube una foto real de tu unidad.'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn-secondary"
                            disabled={uploading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 btn-primary flex items-center justify-center gap-2"
                            disabled={uploading}
                        >
                            {uploading ? (
                                <span>Subiendo...</span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Vehículo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;
