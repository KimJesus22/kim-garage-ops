import PageTransition from '../components/PageTransition';
import Estadisticas from '../components/Estadisticas';
import TripSimulator from '../components/TripSimulator';

const Dashboard = () => {
    return (
        <PageTransition>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-display font-bold text-cod-text mb-2">CENTRO DE MANDO</h1>
                    <p className="text-cod-text-dim">Resumen operativo de la flota.</p>
                </div>

                {/* Estadísticas Generales */}
                <Estadisticas />

                {/* Simulador de Rutas */}
                <TripSimulator />
            </div>
        </PageTransition>
    );
};

export default Dashboard;
