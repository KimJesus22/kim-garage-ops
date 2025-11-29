import { useState } from 'react';
import { Package, Plus, AlertTriangle, Minus, Search } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import AddPartForm from '../components/AddPartForm';
import PageTransition from '../components/PageTransition';
import { formatCurrency } from '../utils/formatters';

const Inventory = () => {
    const { inventory, updateStock, deletePart } = useInventory();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-cod-text mb-2 flex items-center gap-3">
                            <Package className="text-neon-green" size={32} />
                            ARMERÍA DE REFACCIONES
                        </h1>
                        <p className="text-cod-text-dim">Control de stock y suministros tácticos.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-neon-green text-cod-darker font-bold px-6 py-2.5 rounded-sm hover:bg-neon-green-dark transition-all duration-200 hover:shadow-neon-green uppercase tracking-wider text-sm flex items-center gap-2"
                    >
                        <Plus size={18} />
                        Registrar Suministro
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, SKU o categoría..."
                        className="w-full bg-cod-panel border border-cod-border rounded-sm py-3 pl-10 pr-4 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Inventory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInventory.length > 0 ? (
                        filteredInventory.map(item => {
                            const isLowStock = item.stock <= item.minStock;
                            return (
                                <div key={item.id} className={`bg-cod-panel border ${isLowStock ? 'border-red-500/50' : 'border-cod-border'} rounded-sm p-4 relative group overflow-hidden transition-all hover:border-neon-green/30`}>
                                    {/* Low Stock Alert */}
                                    {isLowStock && (
                                        <div className="absolute top-0 right-0 bg-red-500/20 text-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                            <AlertTriangle size={10} />
                                            Reabastecer
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-cod-text font-bold text-lg">{item.name}</h3>
                                            <p className="text-cod-text-dim text-xs font-mono tracking-wider">{item.sku} • {item.category}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-cod-text-dim text-xs uppercase tracking-wider mb-1">Existencias</p>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-3xl font-display font-bold ${isLowStock ? 'text-red-500' : 'text-neon-green'}`}>
                                                    {item.stock}
                                                </span>
                                                <span className="text-cod-text-dim text-sm">{item.unit}</span>
                                            </div>
                                            <p className="text-cod-text-dim/50 text-[10px] mt-1">Mínimo: {item.minStock}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <div className="flex items-center gap-1 bg-cod-dark rounded-sm border border-cod-border p-1">
                                                <button
                                                    onClick={() => updateStock(item.id, -1)}
                                                    className="p-1 text-cod-text-dim hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                    disabled={item.stock <= 0}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <div className="w-px h-4 bg-cod-border mx-1" />
                                                <button
                                                    onClick={() => updateStock(item.id, 1)}
                                                    className="p-1 text-cod-text-dim hover:text-neon-green hover:bg-neon-green/10 rounded transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            {item.price && (
                                                <span className="text-cod-text font-mono text-sm">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Background Decoration */}
                                    <div className="absolute -bottom-4 -right-4 text-cod-text-dim/5 rotate-12 pointer-events-none">
                                        <Package size={100} />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-cod-border rounded-lg">
                            <Package size={48} className="mx-auto text-cod-text-dim mb-4 opacity-50" />
                            <p className="text-cod-text-dim text-lg">Inventario vacío.</p>
                            <p className="text-cod-text-dim/50 text-sm mt-2">Registra suministros para mantener la operatividad.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showForm && <AddPartForm onClose={() => setShowForm(false)} />}
            </div>
        </PageTransition>
    );
};

export default Inventory;
