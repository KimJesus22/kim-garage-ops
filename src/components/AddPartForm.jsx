import { useState } from 'react';
import { X, Save, Package } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

const AddPartForm = ({ onClose }) => {
    const { addPart } = useInventory();
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: 'Motor',
        stock: 0,
        minStock: 5,
        price: '',
        unit: 'pz'
    });

    const categories = ['Motor', 'Frenos', 'Suspensión', 'Eléctrico', 'Llantas', 'Fluidos', 'Carrocería', 'Otros'];

    const handleSubmit = (e) => {
        e.preventDefault();
        addPart(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cod-panel border border-cod-border w-full max-w-md rounded-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-cod-border bg-cod-dark/50">
                    <div className="flex items-center gap-2 text-neon-green">
                        <Package size={20} />
                        <h2 className="font-display font-bold tracking-wider">REGISTRAR SUMINISTRO</h2>
                    </div>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Nombre de la Pieza</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                            placeholder="Ej. Aceite Sintético 10W-40"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">SKU / Código</label>
                            <input
                                type="text"
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors font-mono"
                                placeholder="MOT-001"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Categoría</label>
                            <select
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Stock Inicial</label>
                            <input
                                type="number"
                                min="0"
                                required
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Stock Mínimo</label>
                            <input
                                type="number"
                                min="1"
                                required
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Precio Unitario</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Unidad</label>
                            <select
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            >
                                <option value="pz">Pieza (pz)</option>
                                <option value="lt">Litro (lt)</option>
                                <option value="kg">Kilogramo (kg)</option>
                                <option value="set">Juego (set)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-cod-text-dim hover:text-cod-text font-semibold transition-colors uppercase tracking-wider text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-neon-green text-cod-darker font-bold rounded-sm hover:bg-neon-green-dark transition-all duration-200 uppercase tracking-wider text-sm flex items-center gap-2"
                        >
                            <Save size={16} />
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPartForm;
