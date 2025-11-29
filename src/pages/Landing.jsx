import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wifi, FileText, Activity, ChevronRight } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-cod-darker flex flex-col items-center justify-center relative overflow-hidden">
            {/* Technical Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cod-darker/50 to-cod-darker pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="z-10 text-center max-w-4xl px-4"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-6 flex justify-center">
                    <span className="px-3 py-1 bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-mono tracking-[0.2em] uppercase rounded-sm">
                        System v2.0.4 Ready
                    </span>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    variants={itemVariants}
                    className="text-7xl md:text-9xl font-display font-bold text-cod-text mb-2 tracking-tighter"
                    style={{ textShadow: '0 0 40px rgba(74, 222, 128, 0.1)' }}
                >
                    GARAGE <span className="text-neon-green">OPS</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-cod-text-dim font-light tracking-wide mb-12 uppercase"
                >
                    Gestión Táctica de Mantenimiento Vehicular
                </motion.p>

                {/* CTA Button */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="group relative px-8 py-4 bg-neon-green text-cod-darker font-bold text-lg uppercase tracking-widest overflow-hidden rounded-sm transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.4)] hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Inicializar Sistema
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                    </button>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-cod-border/30 pt-12"
                >
                    <div className="flex flex-col items-center gap-3 group">
                        <div className="p-4 bg-cod-panel rounded-full border border-cod-border group-hover:border-neon-green/50 transition-colors">
                            <Wifi className="text-cod-text-dim group-hover:text-neon-green transition-colors" size={24} />
                        </div>
                        <h3 className="text-cod-text font-bold uppercase tracking-wider text-sm">Offline First</h3>
                        <p className="text-cod-text-dim text-xs max-w-[200px]">Operatividad garantizada sin conexión a la red.</p>
                    </div>

                    <div className="flex flex-col items-center gap-3 group">
                        <div className="p-4 bg-cod-panel rounded-full border border-cod-border group-hover:border-neon-green/50 transition-colors">
                            <FileText className="text-cod-text-dim group-hover:text-neon-green transition-colors" size={24} />
                        </div>
                        <h3 className="text-cod-text font-bold uppercase tracking-wider text-sm">Reportes PDF</h3>
                        <p className="text-cod-text-dim text-xs max-w-[200px]">Generación instantánea de bitácoras de servicio.</p>
                    </div>

                    <div className="flex flex-col items-center gap-3 group">
                        <div className="p-4 bg-cod-panel rounded-full border border-cod-border group-hover:border-neon-green/50 transition-colors">
                            <Activity className="text-cod-text-dim group-hover:text-neon-green transition-colors" size={24} />
                        </div>
                        <h3 className="text-cod-text font-bold uppercase tracking-wider text-sm">Alertas Predictivas</h3>
                        <p className="text-cod-text-dim text-xs max-w-[200px]">Monitoreo constante del estado de la flota.</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Footer Status */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-cod-text-dim/30 text-[10px] uppercase tracking-[0.3em]">
                    Secure Connection Established • Encrypted via TLS 1.3
                </p>
            </div>
        </div>
    );
};

export default Landing;
