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
            },
            {
                id: '3',
                type: 'moto',
                brand: 'Vento',
                model: 'Lithium',
                year: 2024,
                mileage: 8500,
                photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.galgo.com%2Fmx%2Fmotos%2FMX645-vento-lithium-190&psig=AOvVaw1jHoCaH88zTEq3Lwnxzwvh&ust=1764438964151000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCND1gr-1lZEDFQAAAAAdAAAAABAE',
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
            services: [],
            fuelLogs: []
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

    const addFuelLog = (vehicleId, log) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return {
                    ...v,
                    fuelLogs: [...(v.fuelLogs || []), { ...log, id: Date.now().toString() }]
                };
            }
            return v;
        }));
    };

    const restoreData = (data) => {
        if (!Array.isArray(data)) {
            throw new Error('Formato de datos inválido: Se esperaba un arreglo.');
        }
        // Validación básica del primer elemento si existe
        if (data.length > 0 && (!data[0].id || !data[0].brand)) {
            throw new Error('Formato de datos inválido: Estructura de vehículo incorrecta.');
        }
        setVehicles(data);
    };

    const value = {
        vehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addService,
        addFuelLog,
        restoreData
    };

    return (
        <VehicleContext.Provider value={value}>
            {children}
        </VehicleContext.Provider>
    );
};
