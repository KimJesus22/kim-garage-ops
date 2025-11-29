import { createContext, useContext, useState, useEffect } from 'react';
import { useInventory } from './InventoryContext';
import { useVehicles } from './VehicleContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { inventory } = useInventory();
    const { vehicles } = useVehicles();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const newNotifications = [];

        // 1. Inventory Alerts (Low Stock)
        inventory.forEach(item => {
            if (item.stock <= 3) {
                newNotifications.push({
                    id: `inv-${item.id}`,
                    type: 'warning',
                    title: 'Stock Bajo',
                    message: `El producto ${item.name} tiene solo ${item.stock} unidades.`,
                    link: '/inventory',
                    timestamp: Date.now()
                });
            }
        });

        // 2. Vehicle Alerts (Service Due)
        vehicles.forEach(vehicle => {
            // Find last oil change
            const lastOilChange = vehicle.services?.find(s => s.type === 'Cambio de Aceite');
            if (lastOilChange) {
                const interval = vehicle.type === 'moto' ? 5000 : 10000;
                const nextServiceKm = lastOilChange.mileageAtService + interval;

                if (vehicle.mileage >= nextServiceKm) {
                    newNotifications.push({
                        id: `veh-${vehicle.id}-service`,
                        type: 'danger',
                        title: 'Servicio Vencido',
                        message: `El vehículo ${vehicle.brand} ${vehicle.model} requiere mantenimiento urgente.`,
                        link: '/garage',
                        timestamp: Date.now()
                    });
                } else if (vehicle.mileage >= nextServiceKm - 500) {
                    newNotifications.push({
                        id: `veh-${vehicle.id}-soon`,
                        type: 'warning',
                        title: 'Servicio Próximo',
                        message: `El vehículo ${vehicle.brand} ${vehicle.model} está próximo a servicio.`,
                        link: '/garage',
                        timestamp: Date.now()
                    });
                }
            }
        });

        // 3. Schedule Alerts (Today's Operations)
        const today = new Date().toISOString().split('T')[0];
        vehicles.forEach(vehicle => {
            const todaysServices = vehicle.services?.filter(s => s.date === today && s.status !== 'completed');
            if (todaysServices && todaysServices.length > 0) {
                todaysServices.forEach(service => {
                    newNotifications.push({
                        id: `sch-${service.id}`,
                        type: 'info',
                        title: 'Operación Hoy',
                        message: `${service.type} programado para ${vehicle.brand} ${vehicle.model}.`,
                        link: '/schedule',
                        timestamp: Date.now()
                    });
                });
            }
        });

        setNotifications(newNotifications);
    }, [inventory, vehicles]);

    return (
        <NotificationContext.Provider value={{ notifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
