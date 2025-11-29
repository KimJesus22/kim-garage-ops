import { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { Plus, Trash2, Save, Package, Wrench, Shield, Crosshair, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const Loadouts = () => {
    const { inventory, serviceTemplates, addTemplate, deleteTemplate } = useInventory();

    // Form State
    const [name, setName] = useState('');
    const [laborCost, setLaborCost] = useState('');
    const [selectedParts, setSelectedParts] = useState([]);

    // Temporary selection state
    const [currentPartId, setCurrentPartId] = useState('');
    const [partQuantity, setPartQuantity] = useState(1);

    const handleAddPart = () => {
        if (!currentPartId) return;
        const part = inventory.find(p => p.id === parseInt(currentPartId));
        if (!part) return;

        const existingIndex = selectedParts.findIndex(p => p.id === part.id);
        if (existingIndex >= 0) {
            const updated = [...selectedParts];
            updated[existingIndex].quantity += partQuantity;
            setSelectedParts(updated);
        } else {
            setSelectedParts([...selectedParts, {
                id: part.id,
                name: part.name,
                quantity: partQuantity,
                unit: part.unit
            }]);
        }
        setCurrentPartId('');
        setPartQuantity(1);
    };

    const removePart = (index) => {
        const updated = [...selectedParts];
        updated.splice(index, 1);
        setSelectedParts(updated);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!name) return;

        addTemplate({
            name,
            laborCost: parseFloat(laborCost) || 0,
            items: selectedParts
        });

        // Reset form
        setName('');
        setLaborCost('');
        setSelectedParts([]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cod-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-neon-green/10 p-2 rounded-sm border border-neon-green/20">
                        <Crosshair className="text-neon-green" size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-cod-text tracking-wider">LOADOUTS</h1>
                        <p className="text-xs text-cod-text-dim uppercase tracking-[0.2em]">Plantillas de Servicio Táctico</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Creator (The Gunsmith) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-cod-panel border border-cod-border rounded-sm p-1 shadow-lg">
                        <div className="bg-cod-dark/50 p-4 border-b border-cod-border flex items-center gap-2">
                            <Wrench size={16} className="text-neon-green" />
                            <h2 className="font-bold text-cod-text tracking-wider text-sm uppercase">Armero (Crear Plantilla)</h2>
                        </div>

                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Nombre del Loadout</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej. Afinación Vento 150"
                                    className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors placeholder:text-cod-text-dim/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Costo Base Mano de Obra</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim">$</span>
                                    <input
                                        type="number"
                                        value={laborCost}
                                        onChange={(e) => setLaborCost(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-cod-dark border border-cod-border rounded-sm py-2 pl-6 pr-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors font-mono"
                                    />
                                </div>
                            </div>

                            {/* Parts Selector */}
                            <div className="bg-cod-dark/30 border border-cod-border/50 rounded-sm p-3 space-y-3">
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider">Agregar Equipo (Refacciones)</label>
                                <div className="flex gap-2">
                                    <select
                                        value={currentPartId}
                                        onChange={(e) => setCurrentPartId(e.target.value)}
                                        className="flex-1 bg-cod-dark border border-cod-border rounded-sm p-2 text-xs text-cod-text focus:border-neon-green focus:outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {inventory.map(item => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={partQuantity}
                                        onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
                                        className="w-14 bg-cod-dark border border-cod-border rounded-sm p-2 text-xs text-cod-text focus:border-neon-green focus:outline-none text-center"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddPart}
                                        disabled={!currentPartId}
                                        className="bg-cod-panel border border-cod-border hover:border-neon-green text-neon-green p-2 rounded-sm transition-colors disabled:opacity-50"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {/* Selected List Preview */}
                                {selectedParts.length > 0 && (
                                    <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-cod pr-1">
                                        {selectedParts.map((part, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-cod-dark p-2 rounded-sm border border-cod-border/30 text-xs group">
                                                <span className="text-cod-text">{part.quantity}{part.unit} {part.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removePart(idx)}
                                                    className="text-cod-text-dim hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-neon-green text-cod-darker font-bold rounded-sm hover:bg-neon-green-dark transition-all duration-200 uppercase tracking-wider text-sm flex items-center justify-center gap-2 mt-4"
                            >
                                <Save size={16} />
                                Guardar Plantilla
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Inventory Grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceTemplates.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-cod-text-dim opacity-50 border-2 border-dashed border-cod-border rounded-sm">
                                <Package size={48} className="mb-4" />
                                <p className="uppercase tracking-widest font-bold">No hay Loadouts configurados</p>
                            </div>
                        ) : (
                            serviceTemplates.map(template => (
                                <div key={template.id} className="bg-cod-panel border border-cod-border rounded-sm p-1 group hover:border-neon-green/50 transition-all duration-300">
                                    <div className="bg-cod-dark/50 p-4 h-full flex flex-col relative overflow-hidden">
                                        {/* Decorative background element */}
                                        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Shield size={64} />
                                        </div>

                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <div>
                                                <h3 className="font-bold text-cod-text text-lg tracking-wide group-hover:text-neon-green transition-colors">{template.name}</h3>
                                                <div className="flex items-center gap-2 text-cod-text-dim text-xs mt-1">
                                                    <Zap size={12} className="text-yellow-500" />
                                                    <span>Mano de Obra: {formatCurrency(template.laborCost)}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteTemplate(template.id)}
                                                className="text-cod-text-dim hover:text-red-500 transition-colors p-1"
                                                title="Eliminar Plantilla"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex-1 relative z-10">
                                            <p className="text-[10px] uppercase tracking-wider text-cod-text-dim mb-2 border-b border-cod-border/50 pb-1">Equipamiento Incluido</p>
                                            {template.items && template.items.length > 0 ? (
                                                <ul className="space-y-1">
                                                    {template.items.map((item, idx) => (
                                                        <li key={idx} className="text-xs text-cod-text flex items-center gap-2">
                                                            <div className="w-1 h-1 bg-neon-green rounded-full" />
                                                            <span className="opacity-80">{item.quantity}{item.unit}</span>
                                                            <span>{item.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-xs text-cod-text-dim italic">Solo mano de obra</p>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-cod-border/30 flex justify-between items-center text-[10px] text-cod-text-dim uppercase tracking-widest">
                                            <span>ID: {template.id.toString().slice(-6)}</span>
                                            <span className="group-hover:text-neon-green transition-colors">Listo para despliegue</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loadouts;
