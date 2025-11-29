import { VehicleProvider } from './context/VehicleContext';
import { InventoryProvider } from './context/InventoryContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Garage from './pages/Garage';
import Historial from './pages/Historial';
import Estadisticas from './pages/Estadisticas';
import Inventory from './pages/Inventory';
import Configuracion from './pages/Configuracion';
import ThemeSelector from './components/ThemeSelector';

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <VehicleProvider>
      <InventoryProvider>
        <div className="flex min-h-screen bg-cod-darker">
          {/* Sidebar (Hidden on Landing Page) */}
          {!isLanding && <Sidebar />}

          {/* Main Content */}
          <main className={`${!isLanding ? 'flex-1 ml-64 p-8' : 'w-full'} scrollbar-cod overflow-y-auto`}>
            <div className={`${!isLanding ? 'max-w-7xl mx-auto' : ''}`}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/garage" element={<Garage />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/estadisticas" element={<Estadisticas />} />
                <Route path="/configuracion" element={<Configuracion />} />
              </Routes>
            </div>
          </main>

          <ThemeSelector />
        </div>
      </InventoryProvider>
    </VehicleProvider>
  );
}

export default App;
