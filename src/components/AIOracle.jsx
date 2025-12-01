import { useState, useEffect } from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { calculateNextServiceDate } from '../utils/predictor';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AIOracle = ({ vehicle }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate "Thinking" time for effect
        setLoading(true);
        const timer = setTimeout(() => {
            const result = calculateNextServiceDate(vehicle, vehicle.services);
            setPrediction(result);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [vehicle]);

    if (loading) {
        return (
            <div className="mt-3 p-3 bg-cod-darker border border-purple-500/30 rounded-sm flex items-center gap-3 animate-pulse">
                <Brain className="text-purple-400 animate-bounce" size={20} />
                <span className="text-xs font-mono text-purple-300">Procesando Inteligencia...</span>
            </div>
        );
    }

    if (!prediction) {
        return (
            <div className="mt-3 p-3 bg-cod-darker border border-cod-border rounded-sm flex items-center gap-3 opacity-70">
                <Brain className="text-cod-text-dim" size={20} />
                <span className="text-xs text-cod-text-dim">
                    Registra al menos 2 servicios para activar la predicción por IA.
                </span>
            </div>
        );
    }

    return (
        <div className="mt-3 p-3 bg-purple-900/10 border border-purple-500/30 rounded-sm relative overflow-hidden group">
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <Brain className="text-purple-400" size={18} />
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                        El Oráculo
                        <Sparkles size={10} className="text-purple-200 animate-pulse" />
                    </h4>
                </div>

                <p className="text-xs text-cod-text mb-2 leading-relaxed">
                    Según tu uso de <span className="font-bold text-purple-300">{prediction.avgKmPerDay.toFixed(1)} km/día</span>,
                    tu próximo servicio será el:
                </p>

                <div className="flex items-end justify-between">
                    <span className="text-lg font-display font-bold text-purple-100">
                        {format(prediction.date, "d 'de' MMMM yyyy", { locale: es })}
                    </span>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-purple-400/70 uppercase">Confianza</span>
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((bar) => (
                                <div
                                    key={bar}
                                    className={`w-1 h-2 rounded-sm ${(prediction.confidence / 20) >= bar
                                            ? 'bg-purple-400'
                                            : 'bg-purple-900/50'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIOracle;
