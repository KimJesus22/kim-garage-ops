import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, ShieldCheck } from 'lucide-react';

const VehicleQR = ({ vehicle, onClose }) => {
    const qrRef = useRef();

    // Generate a pseudo-VIN if not present (for demo purposes)
    const vin = vehicle.vin || `VIN-${vehicle.brand.substring(0, 3).toUpperCase()}-${vehicle.year}-${vehicle.id.toString().padStart(6, '0')}`;

    const qrData = `
PROP: KimJesus22
UNIT: ${vehicle.brand} ${vehicle.model} (${vehicle.year})
VIN: ${vin}
KM: ${vehicle.mileage}
MANT: GarageOps
    `.trim();

    const downloadQR = () => {
        const canvas = qrRef.current.querySelector('canvas');
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `ID-${vehicle.brand}-${vehicle.model}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-cod-panel border border-cod-border w-full max-w-sm relative animate-in fade-in zoom-in duration-200 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 text-cod-text-dim hover:text-cod-orange transition-colors"
                >
                    <X size={24} />
                </button>

                {/* ID Card Container */}
                <div className="bg-white p-6 relative overflow-hidden" ref={qrRef}>
                    {/* Decorative Header */}
                    <div className="border-b-4 border-black mb-4 pb-2 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tighter leading-none">
                                ASSET TAG
                            </h2>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                PROPERTY OF KIMJESUS22
                            </p>
                        </div>
                        <ShieldCheck size={32} className="text-black" />
                    </div>

                    {/* QR Code Area */}
                    <div className="flex justify-center my-6">
                        <div className="p-2 border-2 border-black">
                            <QRCodeCanvas
                                value={qrData}
                                size={180}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="space-y-1 font-mono text-xs text-black">
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="font-bold">UNIT:</span>
                            <span className="uppercase">{vehicle.brand} {vehicle.model}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="font-bold">YEAR:</span>
                            <span>{vehicle.year}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="font-bold">VIN:</span>
                            <span className="uppercase">{vin}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">MANAGED BY:</span>
                            <span className="font-bold">GARAGE OPS</span>
                        </div>
                    </div>

                    {/* Footer Warning */}
                    <div className="mt-6 pt-2 border-t-2 border-black text-center">
                        <p className="text-[8px] font-bold text-red-600 uppercase">
                            AUTHORIZED PERSONNEL ONLY • DO NOT REMOVE
                        </p>
                    </div>

                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-gray-100 -z-10 rotate-45 pointer-events-none">
                        OPS
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-4 bg-cod-darker border-t border-cod-border flex justify-center">
                    <button
                        onClick={downloadQR}
                        className="btn-primary flex items-center gap-2 text-sm w-full justify-center"
                    >
                        <Download size={16} />
                        Descargar ID Táctica
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleQR;
