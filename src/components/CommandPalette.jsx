import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    Package,
    ClipboardList,
    History,
    BarChart3,
    Settings,
    Search,
    Moon,
    Sun,
    Zap,
    Shield
} from 'lucide-react';

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    const changeTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update CSS variables based on theme
        const root = document.documentElement;
        if (theme === 'blink') {
            root.style.setProperty('--neon-green', '#ff00ff');
            root.style.setProperty('--cod-text', '#fff0f5');
        } else if (theme === 'army') {
            root.style.setProperty('--neon-green', '#a855f7');
            root.style.setProperty('--cod-text', '#f3e8ff');
        } else {
            // Tactical (Default)
            root.style.setProperty('--neon-green', '#00ff88');
            root.style.setProperty('--cod-text', '#e2e8f0');
        }
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) setOpen(false);
            }}
        >
            <div className="w-full max-w-2xl bg-cod-darker border border-cod-border rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-cod-border px-4 py-3">
                    <Search className="w-5 h-5 text-cod-text-dim mr-3" />
                    <Command.Input
                        placeholder="Escriba un comando o busque..."
                        className="flex-1 bg-transparent border-none outline-none text-cod-text placeholder:text-cod-text-dim/50 font-mono text-sm"
                    />
                    <div className="flex gap-2">
                        <span className="text-[10px] bg-cod-panel border border-cod-border px-2 py-1 rounded text-cod-text-dim font-mono">ESC</span>
                    </div>
                </div>

                <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-cod">
                    <Command.Empty className="py-6 text-center text-cod-text-dim text-sm">
                        No se encontraron resultados.
                    </Command.Empty>

                    <Command.Group heading="Navegación Táctica" className="text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-2 px-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/dashboard'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <LayoutDashboard size={18} />
                            <span className="font-medium">Dashboard</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/garage'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <Car size={18} />
                            <span className="font-medium">Garage</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/kanban'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <ClipboardList size={18} />
                            <span className="font-medium">Tablero de Mando</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/inventory'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <Package size={18} />
                            <span className="font-medium">Armería (Inventario)</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/historial'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <History size={18} />
                            <span className="font-medium">Historial de Operaciones</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/estadisticas'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <BarChart3 size={18} />
                            <span className="font-medium">Estadísticas</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/configuracion'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <Settings size={18} />
                            <span className="font-medium">Configuración</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator className="h-px bg-cod-border my-2" />

                    <Command.Group heading="Camuflaje (Temas)" className="text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-2 px-2">
                        <Command.Item
                            onSelect={() => runCommand(() => changeTheme('tactical'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <Shield size={18} />
                            <span className="font-medium">Tactical (Default)</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => changeTheme('blink'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <Zap size={18} />
                            <span className="font-medium">Blink (Cyberpunk)</span>
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => changeTheme('army'))}
                            className="flex items-center gap-3 px-3 py-3 rounded-sm text-cod-text hover:bg-cod-panel hover:text-neon-green cursor-pointer transition-colors aria-selected:bg-cod-panel aria-selected:text-neon-green"
                        >
                            <Moon size={18} />
                            <span className="font-medium">Army (Spec Ops)</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </Command.Dialog>
    );
};

export default CommandPalette;
