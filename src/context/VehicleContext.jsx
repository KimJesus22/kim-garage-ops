import { createContext, useContext, useState, useEffect } from 'react';

const VehicleContext = createContext();

export const useVehicles = () => {
    const context = useContext(VehicleContext);
    if (!context) {
        throw new Error('useVehicles must be used within a VehicleProvider');
    }
    return context;
};

export const VehicleProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('vehicles');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    const addVehicle = (vehicle) => {
        setVehicles(prev => [...prev, { ...vehicle, id: Date.now(), services: [], fuelLogs: [] }]);
    };

    const updateVehicle = (id, updatedData) => {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedData } : v));
    };

    const deleteVehicle = (id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    const addService = (vehicleId, service) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return {
                    ...v,
                    services: [...(v.services || []), {
                        ...service,
                        id: Date.now(),
                        status: service.status || 'completed' // Default status
                    }]
                };
            }
            return v;
        }));
    };

    const updateServiceStatus = (vehicleId, serviceId, newStatus) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return {
                    ...v,
                    services: v.services.map(s =>
                        s.id === serviceId ? { ...s, status: newStatus } : s
                    )
                };
            }
            return v;
        }));
    };

    const addFuelLog = (vehicleId, log) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return {
                    ...v,
                    fuelLogs: [...(v.fuelLogs || []), { ...log, id: Date.now() }]
                };
            }
            return v;
        }));
    };

    const restoreData = (data) => {
        if (Array.isArray(data)) {
            setVehicles(data);
            return true;
        }
        return false;
    };

    return (
        <VehicleContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle, addService, updateServiceStatus, addFuelLog, restoreData }}>
            {children}
        </VehicleContext.Provider>
    );
};
