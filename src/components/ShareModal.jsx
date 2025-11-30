import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Globe, Lock, Share2 } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const ShareModal = ({ vehicle, onClose }) => {
    const { togglePublicLink } = useVehicles();
    const [isPublic, setIsPublic] = useState(!!vehicle.share_token);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = vehicle.share_token
        ? `${window.location.origin}/showroom/${vehicle.share_token}`
        : '';

    const handleToggle = async () => {
        setLoading(true);
        try {
            await togglePublicLink(vehicle.id);
            setIsPublic(!isPublic);
        } catch (error) {
            console.error('Error toggling share:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cod-panel border border-cod-border w-full max-w-md rounded-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-cod-border bg-cod-darker/50">
                    <h2 className="text-xl font-display font-bold text-cod-text flex items-center gap-2">
                        <Share2 size={20} className="text-neon-green" />
                        COMPARTIR UNIDAD
                    </h2>
                    <button onClick={onClose} className="text-cod-text-dim hover:text-cod-text transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between p-4 bg-cod-dark rounded-sm border border-cod-border">
                        <div>
                            <h3 className="font-bold text-cod-text">Estado Público</h3>
                            <p className="text-xs text-cod-text-dim">
                                {isPublic ? 'Visible para cualquiera con el link' : 'Solo visible para ti'}
                            </p>
                        </div>
                        <button
                            onClick={handleToggle}
                            disabled={loading}
                            className={`
                                relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none
                                ${isPublic ? 'bg-neon-green' : 'bg-cod-border'}
                            `}
                        >
                            <span
                                className={`
                                    absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out
                                    ${isPublic ? 'translate-x-6' : 'translate-x-0'}
                                `}
                            />
                        </button>
                    </div>

                    {isPublic ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            {/* QR Code */}
                            <div className="flex justify-center">
                                <div className="p-4 bg-white rounded-sm">
                                    <QRCodeSVG value={shareUrl} size={180} />
                                </div>
                            </div>

                            {/* Link Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-cod-text-dim uppercase tracking-wider">
                                    Enlace Público
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        className="input-cod w-full text-xs font-mono text-neon-green bg-cod-darker"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="btn-secondary px-3 flex items-center justify-center"
                                        title="Copiar"
                                    >
                                        {copied ? <span className="text-neon-green font-bold">OK</span> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-cod-text-dim justify-center bg-cod-dark/50 p-2 rounded">
                                <Globe size={14} />
                                <span>Cualquiera con este enlace puede ver el historial.</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-cod-text-dim space-y-3">
                            <Lock size={48} className="mx-auto opacity-20" />
                            <p>La unidad es privada.</p>
                            <p className="text-sm">Activa el interruptor para generar un enlace compartible.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
