import { Link, useLocation } from 'react-router-dom';
import { Home, Car, History, Package, ClipboardList, Shield, BarChart3, Settings, Crosshair } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/garage', label: 'Garage', icon: Car },
        { path: '/loadouts', label: 'Loadouts', icon: Crosshair },
        { path: '/kanban', label: 'Tablero', icon: ClipboardList },
        { path: '/inventory', label: 'Inventario', icon: Package },
        { path: '/historial', label: 'Historial', icon: History },
        { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
        { path: '/configuracion', label: 'Configuración', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-cod-dark border-r border-cod-border flex flex-col z-50">
            {/* Header */}
            <div className="p-6 border-b border-cod-border flex items-center gap-3">
                <div className="bg-neon-green/10 p-2 rounded-sm border border-neon-green/20">
                    <Shield className="text-neon-green" size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-display font-bold text-cod-text tracking-wider">GARAGE OPS</h1>
                    <p className="text-[10px] text-cod-text-dim uppercase tracking-[0.2em]">Vehicle Manager</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group relative overflow-hidden
                                ${isActive
                                    ? 'bg-neon-green/10 text-neon-green border-l-2 border-neon-green'
                                    : 'text-cod-text-dim hover:bg-cod-panel hover:text-cod-text border-l-2 border-transparent'
                                }
                            `}
                        >
                            <item.icon size={20} className={isActive ? 'animate-pulse' : ''} />
                            <span className="font-medium tracking-wide text-sm">{item.label}</span>

                            {/* Hover Effect Background */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isActive ? 'hidden' : ''}`} />
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-cod-border">
                <div className="flex items-center gap-2 text-cod-text-dim/50">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                    <span className="text-xs uppercase tracking-widest">System Online</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
