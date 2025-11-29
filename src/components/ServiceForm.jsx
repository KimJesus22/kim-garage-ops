import { useState, useEffect } from 'react';
import { X, Save, Wrench, Plus, Trash2, Package, AlertTriangle, Zap } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';
import { useInventory } from '../context/InventoryContext';
import { formatCurrency } from '../utils/formatters';

const ServiceForm = ({ onClose, vehicleId }) => {
    const { addService } = useVehicles();
    const { inventory, updateStock, serviceTemplates } = useInventory();

    const [formData, setFormData] = useState({
        type: 'Mantenimiento General',
        status: 'completed',
        date: new Date().toISOString().split('T')[0],
        laborCost: '',
        notes: ''
    });

    const [selectedParts, setSelectedParts] = useState([]);
    const [currentPartId, setCurrentPartId] = useState('');
    const [partQuantity, setPartQuantity] = useState(1);

    // Calculate total cost (Labor + Parts)
    const partsCost = selectedParts.reduce((total, part) => total + (part.price * part.quantity), 0);
    const totalCost = (parseFloat(formData.laborCost) || 0) + partsCost;

    const handleAddPart = () => {
        if (!currentPartId) return;

        const partInInventory = inventory.find(p => p.id === parseInt(currentPartId));
        if (!partInInventory) return;

        if (partInInventory.stock < partQuantity) {
            alert(`Stock insuficiente. Solo hay ${partInInventory.stock} unidades disponibles.`);
            return;
        }

        const existingPartIndex = selectedParts.findIndex(p => p.id === partInInventory.id);

        if (existingPartIndex >= 0) {
            // Update quantity if already added
            const updatedParts = [...selectedParts];
            updatedParts[existingPartIndex].quantity += partQuantity;
            setSelectedParts(updatedParts);
        } else {
            // Add new part
            setSelectedParts([...selectedParts, {
                id: partInInventory.id,
                name: partInInventory.name,
                price: partInInventory.price || 0,
                quantity: partQuantity,
                unit: partInInventory.unit
            }]);
        }

        // Reset selection
        setCurrentPartId('');
        setPartQuantity(1);
    };

    const removePart = (index) => {
        const updatedParts = [...selectedParts];
        updatedParts.splice(index, 1);
        setSelectedParts(updatedParts);
    };

    const applyTemplate = (template) => {
        if (confirm(`¿Aplicar Loadout "${template.name}"? Esto sobrescribirá las refacciones actuales.`)) {
            setFormData(prev => ({
                ...prev,
                laborCost: template.laborCost
            }));

            // Map template items to match selectedParts structure
            // Note: We don't check stock here strictly, but we could add a warning if needed
            const templateParts = template.items.map(item => ({
                id: item.id,
                name: item.name,
                price: 0, // We might need to fetch current price from inventory if not stored in template, or assume 0/template price
                quantity: item.quantity,
                unit: item.unit
            }));

            // Re-fetch prices from current inventory to ensure accuracy
            const hydratedParts = templateParts.map(tPart => {
                const invPart = inventory.find(p => p.id === tPart.id);
                return {
                    ...tPart,
                    price: invPart ? invPart.price : 0
                };
            });

            setSelectedParts(hydratedParts);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Deduct stock from inventory
        selectedParts.forEach(part => {
            updateStock(part.id, -part.quantity);
        });

        // 2. Generate automatic description
        let autoNotes = formData.notes;
        if (selectedParts.length > 0) {
            const partsList = selectedParts.map(p => `${p.quantity}${p.unit} ${p.name}`).join(', ');
            autoNotes += ` (Refacciones: ${partsList})`;
        }

        // 3. Save service
        addService(vehicleId, {
            type: formData.type,
            status: formData.status,
            date: formData.date,
            cost: totalCost,
            laborCost: parseFloat(formData.laborCost) || 0,
            partsCost: partsCost,
            notes: autoNotes.trim(),
            partsUsed: selectedParts
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cod-panel border border-cod-border w-full max-w-2xl rounded-sm shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-cod-border bg-cod-dark/50">
                    <div className="flex items-center gap-2 text-neon-green">
                        <Wrench size={20} />
                        <h2 className="font-display font-bold tracking-wider">REGISTRAR SERVICIO</h2>
                    </div>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 scrollbar-cod">

                    {/* Quick Deploy (Loadouts) */}
                    {serviceTemplates.length > 0 && (
                        <div className="bg-cod-dark/30 border border-cod-border/50 rounded-sm p-3 mb-4">
                            <h3 className="text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Zap size={12} className="text-neon-green" />
                                Despliegue Rápido (Loadouts)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {serviceTemplates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => applyTemplate(template)}
                                        className="bg-cod-panel hover:bg-cod-panel/80 border border-cod-border hover:border-neon-green text-cod-text text-xs py-1 px-3 rounded-sm transition-all flex items-center gap-2 group"
                                    >
                                        <span>{template.name}</span>
                                        <span className="text-cod-text-dim group-hover:text-neon-green transition-colors text-[10px]">
                                            ({template.items?.length || 0} items)
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Tipo de Servicio</label>
                                <select
                                    className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Mantenimiento General</option>
                                    <option>Cambio de Aceite</option>
                                    <option>Frenos</option>
                                    <option>Neumáticos</option>
                                    <option>Batería</option>
                                    <option>Suspensión</option>
                                    <option>Eléctrico</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Fecha</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Status Selector */}
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Estado de la Misión</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'pending' })}
                                    className={`p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all ${formData.status === 'pending'
                                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                                        : 'bg-cod-dark border-cod-border text-cod-text-dim hover:border-cod-gray'
                                        }`}
                                >
                                    Pendiente
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'in_progress' })}
                                    className={`p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all ${formData.status === 'in_progress'
                                        ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                                        : 'bg-cod-dark border-cod-border text-cod-text-dim hover:border-cod-gray'
                                        }`}
                                >
                                    En Taller
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'completed' })}
                                    className={`p-2 rounded-sm border text-xs font-bold uppercase tracking-wider transition-all ${formData.status === 'completed'
                                        ? 'bg-neon-green/20 border-neon-green text-neon-green'
                                        : 'bg-cod-dark border-cod-border text-cod-text-dim hover:border-cod-gray'
                                        }`}
                                >
                                    Completado
                                </button>
                            </div>
                        </div>

                        {/* Parts Selection Section */}
                        <div className="bg-cod-dark/30 border border-cod-border rounded-sm p-4">
                            <h3 className="text-sm font-bold text-cod-text mb-3 flex items-center gap-2">
                                <Package size={16} className="text-neon-green" />
                                REFACCIONES UTILIZADAS
                            </h3>

                            <div className="flex gap-2 mb-4">
                                <select
                                    className="flex-1 bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text text-sm focus:border-neon-green focus:outline-none"
                                    value={currentPartId}
                                    onChange={(e) => setCurrentPartId(e.target.value)}
                                >
                                    <option value="">Seleccionar pieza del inventario...</option>
                                    {inventory.map(item => (
                                        <option key={item.id} value={item.id} disabled={item.stock <= 0}>
                                            {item.name} (Stock: {item.stock} {item.unit}) - {formatCurrency(item.price)}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-20 bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text text-sm focus:border-neon-green focus:outline-none"
                                    value={partQuantity}
                                    onChange={(e) => setPartQuantity(parseInt(e.target.value) || 1)}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddPart}
                                    className="bg-cod-panel border border-cod-border hover:border-neon-green text-neon-green p-2 rounded-sm transition-colors"
                                    disabled={!currentPartId}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Selected Parts List */}
                            {selectedParts.length > 0 ? (
                                <div className="space-y-2">
                                    {selectedParts.map((part, index) => (
                                        <div key={index} className="flex justify-between items-center bg-cod-dark p-2 rounded-sm border border-cod-border/50 text-sm">
                                            <div>
                                                <span className="text-cod-text font-medium">{part.name}</span>
                                                <span className="text-cod-text-dim ml-2">x{part.quantity} {part.unit}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-cod-text font-mono">{formatCurrency(part.price * part.quantity)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removePart(index)}
                                                    className="text-cod-text-dim hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex justify-end pt-2 border-t border-cod-border/30">
                                        <span className="text-cod-text-dim text-xs mr-2">Subtotal Refacciones:</span>
                                        <span className="text-cod-text font-mono font-bold text-sm">{formatCurrency(partsCost)}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-cod-text-dim/50 text-xs italic text-center py-2">No se han agregado refacciones.</p>
                            )}
                        </div>

                        {/* Costs & Notes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Costo Mano de Obra</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim">$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full bg-cod-dark border border-cod-border rounded-sm py-2 pl-6 pr-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors font-mono"
                                        placeholder="0.00"
                                        value={formData.laborCost}
                                        onChange={(e) => setFormData({ ...formData, laborCost: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Costo Total Estimado</label>
                                <div className="w-full bg-cod-dark/50 border border-cod-border rounded-sm py-2 px-3 text-neon-green font-mono font-bold text-lg text-right">
                                    {formatCurrency(totalCost)}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Notas Adicionales</label>
                            <textarea
                                className="w-full bg-cod-dark border border-cod-border rounded-sm p-2 text-cod-text focus:border-neon-green focus:outline-none transition-colors h-24 resize-none"
                                placeholder="Detalles del trabajo realizado..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-cod-border bg-cod-dark/50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-cod-text-dim hover:text-cod-text font-semibold transition-colors uppercase tracking-wider text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="service-form"
                        className="px-6 py-2 bg-neon-green text-cod-darker font-bold rounded-sm hover:bg-neon-green-dark transition-all duration-200 uppercase tracking-wider text-sm flex items-center gap-2"
                    >
                        <Save size={16} />
                        Confirmar Servicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceForm;
