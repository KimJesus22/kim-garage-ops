import { VehicleProvider } from './context/VehicleContext';
import { InventoryProvider } from './context/InventoryContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SoundProvider } from './context/SoundContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Garage from './pages/Garage';
import Historial from './pages/Historial';
import Estadisticas from './pages/Estadisticas';
import Inventory from './pages/Inventory';
import Loadouts from './pages/Loadouts';
import Schedule from './pages/Schedule';
import Kanban from './pages/Kanban';
import Configuracion from './pages/Configuracion';
import ThemeSelector from './components/ThemeSelector';
import CommandPalette from './components/CommandPalette';

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Check for Demo Mode flag
  useEffect(() => {
    if (sessionStorage.getItem('demo-mode') === 'true') {
      // Create a temporary toast element
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-yellow-500/90 text-black px-6 py-4 rounded shadow-lg z-[100] font-bold flex items-center gap-3 animate-in slide-in-from-top duration-500';
      toast.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
        <div>
          <p class="uppercase tracking-wider text-sm">⚠ MODO DEMO ACTIVADO</p>
          <p class="text-xs font-normal opacity-90">Datos simulados cargados correctamente</p>
        </div>
      `;
      document.body.appendChild(toast);

      // Remove flag so it doesn't show on every reload (optional, but good UX)
      sessionStorage.removeItem('demo-mode');

      // Remove toast after 5 seconds
      setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => toast.remove(), 500);
      }, 5000);
    }
  }, []);

  return (
    <AuthProvider>
      <SoundProvider>
        <VehicleProvider>
          <InventoryProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <div className="flex h-screen bg-cod-darker text-cod-text font-sans selection:bg-neon-green selection:text-cod-darker overflow-hidden">
                      <Sidebar />
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-cod-border scrollbar-track-cod-darker">
                          <div className="max-w-7xl mx-auto w-full">
                            <CommandPalette />
                            <Routes>
                              <Route path="/" element={<Landing />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/garage" element={<Garage />} />
                              <Route path="/schedule" element={<Schedule />} />
                              <Route path="/loadouts" element={<Loadouts />} />
                              <Route path="/inventory" element={<Inventory />} />
                              <Route path="/kanban" element={<Kanban />} />
                              <Route path="/historial" element={<Historial />} />
                              <Route path="/configuracion" element={<Configuracion />} />
                            </Routes>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
              </Routes>
            </NotificationProvider>
          </InventoryProvider>
        </VehicleProvider>
      </SoundProvider>
    </AuthProvider>
  );
}

export default App;
