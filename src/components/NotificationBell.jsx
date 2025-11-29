import { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const { notifications } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (link) => {
        navigate(link);
        setIsOpen(false);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'danger': return <AlertCircle size={16} className="text-cod-orange" />;
            case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
            case 'info': return <Info size={16} className="text-neon-green" />;
            default: return <Bell size={16} />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'danger': return 'bg-cod-orange/10 border-cod-orange/30 hover:bg-cod-orange/20';
            case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20';
            case 'info': return 'bg-neon-green/10 border-neon-green/30 hover:bg-neon-green/20';
            default: return 'bg-cod-panel';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-cod-text-dim hover:text-neon-green transition-colors rounded-full hover:bg-cod-panel"
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-cod-orange text-cod-darker text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-80 bg-cod-darker border border-cod-border rounded-lg shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <div className="p-3 border-b border-cod-border bg-cod-panel flex justify-between items-center">
                        <h3 className="font-display font-bold text-sm text-cod-text">NOTIFICACIONES</h3>
                        <span className="text-xs text-cod-text-dim">{notifications.length} Activas</span>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="p-2 space-y-2">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif.link)}
                                        className={`p-3 rounded-sm border cursor-pointer transition-colors flex gap-3 items-start ${getBgColor(notif.type)}`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {getIcon(notif.type)}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-cod-text uppercase mb-0.5">{notif.title}</h4>
                                            <p className="text-xs text-cod-text-dim leading-snug">{notif.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-cod-text-dim">
                                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                <p className="text-xs">Sin novedades en el frente.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
