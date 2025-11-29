import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VehicleContext = createContext();

export const useVehicles = () => {
    const context = useContext(VehicleContext);
    if (!context) {
        throw new Error('useVehicles must be used within a VehicleProvider');
    }
    return context;
};

export const VehicleProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Supabase Operations ---

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            // Fetch vehicles with their services
            const { data, error } = await supabase
                .from('vehicles')
                .select(`
                    *,
                    services (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Sort services by date desc for each vehicle
            const processedData = (data || []).map(vehicle => ({
                ...vehicle,
                services: (vehicle.services || []).sort((a, b) => new Date(b.date) - new Date(a.date))
            }));

            setVehicles(processedData);
        } catch (error) {
            console.error('Error fetching vehicles:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchVehicles();
    }, []);

    const addVehicle = async (vehicle) => {
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .insert([{
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    mileage: vehicle.mileage,
                    type: vehicle.type,
                    photo: vehicle.photo,
                    plate: vehicle.plate,
                    status: 'active'
                }])
                .select()
                .single();

            if (error) throw error;

            setVehicles(prev => [{ ...data, services: [] }, ...prev]);
        } catch (error) {
            console.error('Error adding vehicle:', error.message);
        }
    };

    const updateVehicle = async (id, updatedData) => {
        try {
            const { error } = await supabase
                .from('vehicles')
                .update(updatedData)
                .eq('id', id);

            if (error) throw error;

            setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updatedData } : v));
        } catch (error) {
            console.error('Error updating vehicle:', error.message);
        }
    };

    const deleteVehicle = async (id) => {
        try {
            const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (error) {
            console.error('Error deleting vehicle:', error.message);
        }
    };

    const addService = async (vehicleId, service) => {
        try {
            const { data, error } = await supabase
                .from('services')
                .insert([{
                    vehicle_id: vehicleId,
                    type: service.type,
                    date: service.date,
                    cost: service.cost,
                    description: service.notes, // Mapping 'notes' to 'description'
                    mileage_at_service: service.mileageAtService, // Mapping camelCase to snake_case
                    status: service.status || 'completed',
                    parts_used: service.partsUsed // JSONB column
                }])
                .select()
                .single();

            if (error) throw error;

            // Update local state
            setVehicles(prev => prev.map(v => {
                if (v.id === vehicleId) {
                    return {
                        ...v,
                        services: [data, ...(v.services || [])].sort((a, b) => new Date(b.date) - new Date(a.date))
                    };
                }
                return v;
            }));
        } catch (error) {
            console.error('Error adding service:', error.message);
        }
    };

    const updateServiceStatus = async (vehicleId, serviceId, newStatus) => {
        try {
            const { error } = await supabase
                .from('services')
                .update({ status: newStatus })
                .eq('id', serviceId);

            if (error) throw error;

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
        } catch (error) {
            console.error('Error updating service status:', error.message);
        }
    };

    // Fuel Logs - Not yet in DB schema, keeping as placeholder or local-only if needed.
    // For now, I'll omit DB implementation for fuel logs as it wasn't in the provided schema.
    const addFuelLog = (vehicleId, log) => {
        console.warn('Fuel Logs not yet implemented in Supabase backend.');
    };

    // Restore Data - Not applicable for Supabase as it's the source of truth.
    const restoreData = () => {
        console.warn('restoreData is deprecated in Supabase mode. Use seeder to populate DB.');
        fetchVehicles(); // Just re-fetch
    };

    return (
        <VehicleContext.Provider value={{
            vehicles,
            loading,
            addVehicle,
            updateVehicle,
            deleteVehicle,
            addService,
            updateServiceStatus,
            addFuelLog,
            restoreData
        }}>
            {children}
        </VehicleContext.Provider>
    );
};
