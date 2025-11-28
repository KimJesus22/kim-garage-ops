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
        // Cargar vehículos desde localStorage
        const savedVehicles = localStorage.getItem('vehicles');
        if (savedVehicles) {
            return JSON.parse(savedVehicles);
        }

        // Datos de ejemplo iniciales
        return [
            {
                id: '1',
                type: 'auto',
                brand: 'Toyota',
                model: 'Corolla',
                year: 2020,
                mileage: 45000,
                photo: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=400&h=300&fit=crop',
                services: []
            },
            {
                id: '2',
                type: 'moto',
                brand: 'Yamaha',
                model: 'MT-07',
                year: 2021,
                mileage: 12000,
                photo: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&h=300&fit=crop',
                services: []
            }
        ];
    });

    // Guardar en localStorage cuando cambian los vehículos
    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    const addVehicle = (vehicle) => {
        const newVehicle = {
            ...vehicle,
            id: Date.now().toString(),
            services: []
        };
        setVehicles(prev => [...prev, newVehicle]);
    };

    const updateVehicle = (id, updates) => {
        setVehicles(prev =>
            prev.map(vehicle =>
                vehicle.id === id ? { ...vehicle, ...updates } : vehicle
            )
        );
    };

    const deleteVehicle = (id) => {
        setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    };

    const addService = (vehicleId, service) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return {
                    ...v,
                    services: [...(v.services || []), { ...service, id: Date.now().toString() }]
                };
            }
            return v;
        }));
    };

    const value = {
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addService
    };

    return (
        <VehicleContext.Provider value={value}>
            {children}
        </VehicleContext.Provider>
    );
};
