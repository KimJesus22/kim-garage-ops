import { VehicleProvider } from './context/VehicleContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Garage from './pages/Garage';
import Historial from './pages/Historial';
import Navbar from './components/Navbar';
import ThemeSelector from './components/ThemeSelector';

function App() {
  return (
    <VehicleProvider>
      <Router>
        <div className="min-h-screen bg-cod-darker text-cod-text pb-20 md:pb-0">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/historial" element={<Historial />} />
            </Routes>
          </main>
          <ThemeSelector />
        </div>
      </Router>
    </VehicleProvider>
  );
}

export default App;
