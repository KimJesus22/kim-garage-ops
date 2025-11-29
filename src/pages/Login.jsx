import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Unlock, AlertTriangle, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleNumberClick = (num) => {
        if (pin.length < 4 && !isProcessing && !success) {
            setPin(prev => prev + num);
            setError(false);
        }
    };

    const handleDelete = () => {
        if (!isProcessing && !success) {
            setPin(prev => prev.slice(0, -1));
            setError(false);
        }
    };

    const handleSubmit = async () => {
        if (pin.length !== 4) return;

        setIsProcessing(true);
        try {
            await login(pin);
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            setError(true);
            setPin('');
            setIsProcessing(false);
        }
    };

    // Auto-submit when 4 digits are entered
    useEffect(() => {
        if (pin.length === 4) {
            handleSubmit();
        }
    }, [pin]);

    return (
        <div className="min-h-screen bg-cod-darker flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-cod-darker/90"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className={`
                    bg-cod-panel border-2 rounded-lg p-8 shadow-2xl backdrop-blur-sm transition-colors duration-300
                    ${error ? 'border-red-500 shadow-red-500/20' : success ? 'border-neon-green shadow-neon-green/20' : 'border-cod-border'}
                `}>
                    {/* Header / Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.8, 1, 0.8]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`p-4 rounded-full border-2 mb-4 ${success ? 'bg-neon-green/10 border-neon-green' : 'bg-cod-dark border-cod-border'}`}
                        >
                            {success ? (
                                <Unlock size={40} className="text-neon-green" />
                            ) : (
                                <Shield size={40} className="text-cod-text" />
                            )}
                        </motion.div>
                        <h1 className="text-2xl font-display font-bold text-cod-text tracking-[0.2em]">GARAGE OPS</h1>
                        <p className="text-xs text-cod-text-dim uppercase tracking-widest mt-1">Secure Terminal Access</p>
                    </div>

                    {/* PIN Display */}
                    <div className="mb-8 relative">
                        <motion.div
                            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className={`
                                h-16 bg-cod-dark border rounded-sm flex items-center justify-center gap-4
                                ${error ? 'border-red-500 text-red-500' : success ? 'border-neon-green text-neon-green' : 'border-cod-border text-cod-text'}
                            `}
                        >
                            {[0, 1, 2, 3].map((i) => (
                                <div key={i} className="w-4 h-4 rounded-full flex items-center justify-center">
                                    {pin[i] ? (
                                        <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : success ? 'bg-neon-green' : 'bg-cod-text'}`} />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-cod-text-dim/20" />
                                    )}
                                </div>
                            ))}
                        </motion.div>

                        {/* Status Message */}
                        <div className="absolute -bottom-6 left-0 right-0 text-center h-4">
                            <AnimatePresence mode='wait'>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs font-bold text-red-500 uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <AlertTriangle size={12} /> Invalid Credentials
                                    </motion.p>
                                )}
                                {success && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs font-bold text-neon-green uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <Unlock size={12} /> Access Granted
                                    </motion.p>
                                )}
                                {isProcessing && !success && !error && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs font-bold text-cod-text-dim uppercase tracking-widest animate-pulse"
                                    >
                                        Verifying Identity...
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Keypad */}
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button
                                key={num}
                                onClick={() => handleNumberClick(num.toString())}
                                disabled={isProcessing || success}
                                className="h-14 bg-cod-dark border border-cod-border rounded-sm text-xl font-bold text-cod-text hover:bg-cod-panel hover:border-neon-green/50 hover:text-neon-green transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="flex items-center justify-center opacity-50">
                            <Lock size={16} className="text-cod-text-dim" />
                        </div>
                        <button
                            onClick={() => handleNumberClick('0')}
                            disabled={isProcessing || success}
                            className="h-14 bg-cod-dark border border-cod-border rounded-sm text-xl font-bold text-cod-text hover:bg-cod-panel hover:border-neon-green/50 hover:text-neon-green transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isProcessing || success}
                            className="h-14 bg-cod-dark/50 border border-cod-border rounded-sm flex items-center justify-center text-cod-text-dim hover:text-red-400 hover:border-red-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Delete size={20} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-[10px] text-cod-text-dim uppercase tracking-[0.3em] opacity-50">
                        Restricted Area • Authorized Personnel Only
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
