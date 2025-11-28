import { useState } from 'react';
import { VehicleProvider } from './context/VehicleContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Garage from './pages/Garage';
import Historial from './pages/Historial';
import Estadisticas from './pages/Estadisticas';

import Configuracion from './pages/Configuracion';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'garage':
        return <Garage />;
      case 'historial':
        return <Historial />;
      case 'estadisticas':
        return <Estadisticas />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <VehicleProvider>
      <div className="flex min-h-screen bg-cod-darker">
        {/* Sidebar */}
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8 scrollbar-cod overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </VehicleProvider>
  );
}

export default App;
