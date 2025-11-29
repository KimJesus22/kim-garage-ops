import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Unlock, AlertTriangle, Mail, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                // Navigation happens automatically via useEffect
            } else {
                await signUp(email, password);
                alert('Registro exitoso! Por favor inicia sesión.');
                setIsLogin(true); // Switch to login after signup
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
                <div className="bg-cod-panel border border-cod-border rounded-lg p-8 shadow-2xl backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-4 rounded-full border-2 border-cod-border bg-cod-dark mb-4">
                            <Shield size={40} className="text-cod-text" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-cod-text tracking-[0.2em]">GARAGE OPS</h1>
                        <p className="text-xs text-cod-text-dim uppercase tracking-widest mt-1">
                            {isLogin ? 'Secure Terminal Access' : 'New Operator Registration'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim" size={16} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-cod-dark border border-cod-border rounded-sm py-2 pl-10 pr-3 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                    placeholder="operator@garage.ops"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-cod-text-dim uppercase tracking-wider mb-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cod-text-dim" size={16} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-cod-dark border border-cod-border rounded-sm py-2 pl-10 pr-3 text-cod-text focus:border-neon-green focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="text-red-500 text-xs font-bold flex items-center gap-2 bg-red-500/10 p-2 rounded-sm border border-red-500/20"
                                >
                                    <AlertTriangle size={12} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-green text-cod-darker font-bold py-3 rounded-sm hover:bg-neon-green-dark transition-all uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-pulse">Procesando...</span>
                            ) : (
                                <>
                                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Login/Register */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-xs text-cod-text-dim hover:text-neon-green transition-colors uppercase tracking-wider flex items-center justify-center gap-2 mx-auto"
                        >
                            {isLogin ? (
                                <>
                                    <UserPlus size={14} /> Crear nueva cuenta
                                </>
                            ) : (
                                <>
                                    <LogIn size={14} /> Volver al login
                                </>
                            )}
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
