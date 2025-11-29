import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';

const ThemeSelector = () => {
    const [currentTheme, setCurrentTheme] = useState('tactical');
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'tactical', name: 'Tactical', color: 'bg-[#4ade80]' }, // Green
        { id: 'blink', name: 'Blink', color: 'bg-[#ec4899]' },       // Pink
        { id: 'army', name: 'Army', color: 'bg-[#a855f7]' },         // Purple
    ];

    useEffect(() => {
        const savedTheme = localStorage.getItem('garage-theme') || 'tactical';
        setCurrentTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (themeId) => {
        const root = document.documentElement;
        // Remove all theme classes
        themes.forEach(t => {
            if (t.id !== 'tactical') root.classList.remove(`theme-${t.id}`);
        });

        // Add selected theme class (if not default)
        if (themeId !== 'tactical') {
            root.classList.add(`theme-${themeId}`);
        }
    };

    const handleThemeChange = (themeId) => {
        setCurrentTheme(themeId);
        localStorage.setItem('garage-theme', themeId);
        applyTheme(themeId);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className={`
                absolute bottom-full right-0 mb-4 bg-cod-panel border border-cod-border rounded-sm p-2 shadow-2xl flex flex-col gap-2 transition-all duration-300 origin-bottom-right
                ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
            `}>
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`
                            flex items-center gap-3 px-3 py-2 rounded-sm transition-colors w-32
                            ${currentTheme === theme.id ? 'bg-cod-darker border border-cod-border-light' : 'hover:bg-cod-darker/50'}
                        `}
                    >
                        <div className={`w-3 h-3 rounded-full ${theme.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${currentTheme === theme.id ? 'text-cod-text' : 'text-cod-text-dim'}`}>
                            {theme.name}
                        </span>
                    </button>
                ))}
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    p-3 rounded-full shadow-lg transition-all duration-300 border border-cod-border
                    ${isOpen ? 'bg-cod-text text-cod-darker rotate-90' : 'bg-cod-panel text-cod-text-dim hover:text-cod-text hover:border-cod-text-dim'}
                `}
                title="Personalizar Camuflaje"
            >
                <Palette size={20} />
            </button>
        </div>
    );
};

export default ThemeSelector;
