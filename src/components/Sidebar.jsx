import { Car, History, BarChart3, Settings } from 'lucide-react';

const Sidebar = ({ currentPage, onNavigate }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Car },
        { id: 'garage', label: 'Garage', icon: Car },
        { id: 'historial', label: 'Historial', icon: History },
        { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
        { id: 'configuracion', label: 'Configuración', icon: Settings },
    ];

    return (
        <div className="w-64 bg-cod-dark border-r border-cod-border h-screen fixed left-0 top-0 flex flex-col">
            {/* Logo/Header */}
            <div className="p-6 border-b border-cod-border">
                <h1 className="text-2xl font-display font-bold text-neon-green text-glow-green uppercase tracking-wider">
                    Garage
                </h1>
                <p className="text-cod-text-dim text-xs mt-1 uppercase tracking-wide">
                    Gestor de Vehículos
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-sm
                transition-all duration-200 uppercase tracking-wider text-sm font-semibold
                ${isActive
                                    ? 'bg-neon-green/10 text-neon-green border-l-2 border-neon-green shadow-neon-green'
                                    : 'text-cod-text-dim hover:text-cod-text hover:bg-cod-panel border-l-2 border-transparent'
                                }
              `}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-cod-border">
                <div className="text-xs text-cod-text-dim text-center">
                    <p className="uppercase tracking-wide">Estilo COD MW</p>
                    <p className="text-neon-green mt-1">v1.0.0</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
