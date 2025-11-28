import { Shield, Award, Star, Crown } from 'lucide-react';

const VehicleRankBadge = ({ mileage }) => {
    const km = parseInt(mileage) || 0;

    let rank = {
        name: 'Recluta',
        icon: Shield,
        color: 'text-cod-gray-light',
        bgColor: 'bg-cod-gray-light',
        min: 0,
        max: 5000
    };

    if (km >= 50000) {
        rank = {
            name: 'Leyenda',
            icon: Crown,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-400',
            min: 50000,
            max: 100000 // Arbitrary cap for progress bar
        };
    } else if (km >= 20000) {
        rank = {
            name: 'Élite',
            icon: Star,
            color: 'text-slate-300', // Silver
            bgColor: 'bg-slate-300',
            min: 20000,
            max: 50000
        };
    } else if (km >= 5000) {
        rank = {
            name: 'Veterano',
            icon: Award,
            color: 'text-amber-600', // Bronze
            bgColor: 'bg-amber-600',
            min: 5000,
            max: 20000
        };
    }

    // Calculate Progress
    const range = rank.max - rank.min;
    const progress = Math.min(100, Math.max(0, ((km - rank.min) / range) * 100));
    const nextRankKm = rank.max - km;

    const RankIcon = rank.icon;

    return (
        <div className="flex flex-col gap-1 mt-1">
            <div className={`flex items-center gap-1.5 ${rank.color}`}>
                <RankIcon size={14} className={km >= 50000 ? 'animate-pulse' : ''} />
                <span className="text-xs font-bold uppercase tracking-wider font-display">
                    {rank.name}
                </span>
            </div>

            {/* XP Bar */}
            <div className="w-full h-1.5 bg-cod-darker rounded-full overflow-hidden border border-cod-border/30 relative group cursor-help">
                <div
                    className={`h-full ${rank.bgColor} transition-all duration-500 ease-out`}
                    style={{ width: `${progress}%` }}
                ></div>

                {/* Tooltip on hover */}
                <div className="absolute top-full left-0 mt-1 hidden group-hover:block z-20 bg-cod-panel border border-cod-border text-[10px] text-cod-text px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    {km >= 50000
                        ? 'Nivel Máximo Alcanzado'
                        : `XP: ${km.toLocaleString()} / ${rank.max.toLocaleString()} (+${nextRankKm.toLocaleString()} para ascenso)`}
                </div>
            </div>
        </div>
    );
};

export default VehicleRankBadge;
