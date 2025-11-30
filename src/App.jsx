import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { VehicleProvider } from './context/VehicleContext';
import { InventoryProvider } from './context/InventoryContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { SoundProvider } from './context/SoundContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Garage from './pages/Garage';
import Historial from './pages/Historial';
import Inventory from './pages/Inventory';
import Schedule from './pages/Schedule';
import Kanban from './pages/Kanban';
import Configuracion from './pages/Configuracion';
import Estadisticas from './components/Estadisticas';
import Showroom from './pages/Showroom';

function App() {
  useEffect(() => {
    // Expose seeder to window for console usage
    import('./utils/seeder').then(module => {
      window.seedDatabase = module.seedDatabase;
    });
  }, []);

  return (
    <SoundProvider>
      <AuthProvider>
        <VehicleProvider>
          <InventoryProvider>
            <NotificationProvider>
              <Router>
                <div className="flex min-h-screen bg-cod-darker text-cod-text font-sans selection:bg-neon-green selection:text-cod-darker">
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      className: 'bg-cod-panel border border-cod-border text-cod-text',
                      style: {
                        background: '#1a1a1a',
                        color: '#e0e0e0',
                        border: '1px solid #333',
                      },
                    }}
                  />
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/showroom/:token" element={<Showroom />} />

                    <Route path="/*" element={
                      <ProtectedRoute>
                        <div className="flex w-full">
                          <Sidebar />
                          <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                            <Routes>
                              <Route path="/" element={<Navigate to="/dashboard" replace />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/garage" element={<Garage />} />
                              <Route path="/inventory" element={<Inventory />} />
                              <Route path="/schedule" element={<Schedule />} />
                              <Route path="/kanban" element={<Kanban />} />
                              <Route path="/history" element={<Historial />} />
                              <Route path="/history" element={<Historial />} />
                              <Route path="/estadisticas" element={<Estadisticas />} />
                              <Route path="/configuracion" element={<Configuracion />} />
                            </Routes>
                          </main>
                        </div>
                      </ProtectedRoute>
                    } />
                  </Routes>
                </div>
              </Router>
            </NotificationProvider>
          </InventoryProvider>
        </VehicleProvider>
      </AuthProvider>
    </SoundProvider>
  );
}

export default App;
