import { useState } from 'react';
import { Download, Upload, Settings, AlertTriangle, CheckCircle, FileJson } from 'lucide-react';
import { useVehicles } from '../context/VehicleContext';

const Configuracion = () => {
    const { vehicles, restoreData } = useVehicles();
    const [message, setMessage] = useState(null);

    const handleExport = () => {
        try {
            const dataStr = JSON.stringify(vehicles, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'kim-garage-backup.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setMessage({ type: 'success', text: 'Datos exportados correctamente.' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al exportar datos.' });
        }
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                restoreData(json);
                setMessage({ type: 'success', text: 'Datos restaurados correctamente.' });
            } catch (error) {
                setMessage({ type: 'error', text: error.message || 'Error al leer el archivo.' });
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-display font-bold text-cod-text mb-2 flex items-center gap-3">
                    <Settings size={32} className="text-neon-green" />
                    Configuración
                </h1>
                <p className="text-cod-text-dim uppercase tracking-wide text-sm">
                    Sistema y Gestión de Datos
                </p>
            </div>

            {/* Notification Area */}
            {message && (
                <div className={`p-4 rounded-sm border flex items-center gap-3 animate-pulse
                    ${message.type === 'success'
                        ? 'bg-neon-green/10 border-neon-green text-neon-green'
                        : 'bg-cod-orange/10 border-cod-orange text-cod-orange'
                    }
                `}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                    <span className="font-semibold">{message.text}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Section */}
                <div className="card-cod group hover:border-neon-green/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-cod-panel rounded-sm text-neon-green">
                            <Download size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-cod-text">Exportar Datos</h3>
                            <p className="text-xs text-cod-text-dim uppercase tracking-wide">Copia de Seguridad</p>
                        </div>
                    </div>

                    <p className="text-cod-text-dim text-sm mb-6">
                        Descarga un archivo JSON con todos los vehículos y registros de mantenimiento actuales.
                        Guárdalo en un lugar seguro.
                    </p>

                    <button
                        onClick={handleExport}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                        <FileJson size={18} />
                        Descargar Backup (.json)
                    </button>
                </div>

                {/* Import Section */}
                <div className="card-cod group hover:border-cod-orange/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-cod-panel rounded-sm text-cod-orange">
                            <Upload size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-cod-text">Restaurar Datos</h3>
                            <p className="text-xs text-cod-text-dim uppercase tracking-wide">Recuperación de Sistema</p>
                        </div>
                    </div>

                    <p className="text-cod-text-dim text-sm mb-6">
                        Sube un archivo de respaldo (.json) para restaurar tus datos.
                        <span className="text-cod-orange block mt-1 font-bold">
                            ⚠️ Esto reemplazará todos los datos actuales.
                        </span>
                    </p>

                    <label className="w-full btn-secondary flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden">
                        <Upload size={18} />
                        <span>Seleccionar Archivo</span>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>
                </div>
            </div>

            {/* System Info */}
            <div className="card-cod mt-8">
                <h3 className="text-lg font-display font-bold text-cod-text mb-4 uppercase tracking-wide border-b border-cod-border pb-2">
                    Información del Sistema
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-cod-text-dim block">Versión de App</span>
                        <span className="text-neon-green font-mono">v1.2.0 (COD Edition)</span>
                    </div>
                    <div>
                        <span className="text-cod-text-dim block">Almacenamiento Local</span>
                        <span className="text-cod-text font-mono">Activo</span>
                    </div>
                    <div>
                        <span className="text-cod-text-dim block">Vehículos Registrados</span>
                        <span className="text-cod-text font-mono">{vehicles.length}</span>
                    </div>
                    <div>
                        <span className="text-cod-text-dim block">Estado de Sincronización</span>
                        <span className="text-cod-text-dim italic">Local (Offline)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configuracion;
