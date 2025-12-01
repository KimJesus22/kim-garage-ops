import { Wifi, WifiOff } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const NetworkStatus = () => {
    const { isOnline } = useVehicles();

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cod-darker border border-cod-border/50" title={isOnline ? "Conectado a Red Táctica" : "Sin Conexión"}>
            <div className="relative flex h-2 w-2">
                {isOnline && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-neon-green' : 'bg-red-500'}`}></span>
            </div>
            <span className={`text-[10px] font-bold tracking-wider ${isOnline ? 'text-neon-green' : 'text-cod-text-dim'}`}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
        </div>
    );
};

export default NetworkStatus;
