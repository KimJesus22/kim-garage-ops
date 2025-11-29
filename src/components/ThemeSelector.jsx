import { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

const themes = [
    { id: 'tactical', name: 'Tactical', color: '#4ade80', class: 'theme-tactical' },
    { id: 'blink', name: 'Blink', color: '#ec4899', class: 'theme-blink' },
    { id: 'army', name: 'Army', color: '#a855f7', class: 'theme-army' },
];

const ThemeSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || 'tactical';
    });

    useEffect(() => {
        // Apply theme to document root
        const root = document.documentElement;

        // Remove all theme classes
        themes.forEach(t => root.classList.remove(t.class));

        // Add current theme class
        const themeObj = themes.find(t => t.id === currentTheme);
        if (themeObj) {
            root.classList.add(themeObj.class);
        }

        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Theme Options */}
            {isOpen && (
                <div className="bg-cod-panel border border-cod-border rounded-sm p-2 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => {
                                setCurrentTheme(theme.id);
                                setIsOpen(false);
                            }}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-sm transition-colors w-32
                                ${currentTheme === theme.id ? 'bg-cod-darker border border-cod-border' : 'hover:bg-cod-darker'}
                            `}
                        >
                            <div
                                className="w-4 h-4 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                                style={{ backgroundColor: theme.color, boxShadow: `0 0 5px ${theme.color}` }}
                            />
                            <span className={`text-xs uppercase tracking-wider ${currentTheme === theme.id ? 'text-cod-text' : 'text-cod-text-dim'}`}>
                                {theme.name}
                            </span>
                            {currentTheme === theme.id && <Check size={12} className="ml-auto text-cod-text" />}
                        </button>
                    ))}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-cod-panel border border-cod-border rounded-full flex items-center justify-center text-cod-text hover:text-neon-green hover:border-neon-green transition-all duration-300 shadow-lg hover:shadow-neon-green/20 group"
            >
                <Palette size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
        </div>
    );
};

export default ThemeSelector;
