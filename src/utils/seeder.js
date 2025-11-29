import { supabase } from '../lib/supabase';

export const seedDatabase = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('Debes iniciar sesión para ejecutar el seeder.');
            return;
        }

        const userId = user.id;
        console.log('Iniciando Seeder para usuario:', userId);

        // 1. Inventory Data
        const inventoryItems = [
            { name: 'Aceite Sintético 10W-40', stock: 15, price: 180, unit: 'L', user_id: userId },
            { name: 'Filtro de Aceite Universal', stock: 8, price: 120, unit: 'pz', user_id: userId },
            { name: 'Bujía Iridium', stock: 24, price: 250, unit: 'pz', user_id: userId },
            { name: 'Balatas Cerámicas Delanteras', stock: 5, price: 850, unit: 'set', user_id: userId },
            { name: 'Líquido de Frenos DOT4', stock: 10, price: 150, unit: 'L', user_id: userId },
            { name: 'Anticongelante Concentrado', stock: 12, price: 200, unit: 'L', user_id: userId },
            { name: 'Kit Cadena Distribución', stock: 3, price: 1200, unit: 'set', user_id: userId },
            { name: 'Batería 12V Alto Rendimiento', stock: 4, price: 2800, unit: 'pz', user_id: userId },
            { name: 'Limpiador de Inyectores', stock: 20, price: 90, unit: 'bote', user_id: userId },
            { name: 'Filtro de Aire Deportivo', stock: 6, price: 450, unit: 'pz', user_id: userId }
        ];

        const { error: invError } = await supabase.from('inventory').insert(inventoryItems);
        if (invError) console.error('Error seeding inventory:', invError);
        else console.log('Inventario sembrado.');

        // 2. Vehicles Data
        const vehiclesData = [
            {
                brand: 'Vento',
                model: 'Lithium 150',
                year: 2023,
                type: 'moto',
                plate: 'VNT-2023',
                mileage: 12500,
                photo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop',
                status: 'active',
                user_id: userId
            },
            {
                brand: 'Nissan',
                model: 'Tsuru',
                year: 2010,
                type: 'auto',
                plate: 'LEGEND-01',
                mileage: 400000,
                photo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop',
                status: 'active',
                user_id: userId
            },
            {
                brand: 'Tesla',
                model: 'Cybertruck',
                year: 2024,
                type: 'auto',
                plate: 'MARS-X',
                mileage: 500,
                photo: 'https://images.unsplash.com/photo-1605218427368-35b861286977?q=80&w=1000&auto=format&fit=crop',
                status: 'active',
                user_id: userId
            }
        ];

        // Insert vehicles one by one to get IDs for services
        for (const v of vehiclesData) {
            const { data: vehicle, error: vError } = await supabase
                .from('vehicles')
                .insert([v])
                .select()
                .single();

            if (vError) {
                console.error('Error seeding vehicle:', vError);
                continue;
            }

            // Services for this vehicle
            let services = [];
            if (v.model === 'Lithium 150') {
                services = [
                    { type: 'Mantenimiento General', date: '2023-09-15', cost: 1200, status: 'completed', description: 'Servicio de los 1000km' },
                    { type: 'Cambio de Aceite', date: '2023-10-15', cost: 450, status: 'completed', description: 'Aceite Motul' },
                    { type: 'Frenos', date: '2023-11-01', cost: 600, status: 'completed', description: 'Ajuste de balatas traseras' },
                    { type: 'Eléctrico', date: '2023-11-20', cost: 300, status: 'completed', description: 'Cambio de foco principal' },
                    { type: 'Mantenimiento General', date: '2023-11-28', cost: 1500, status: 'in_progress', description: 'Servicio mayor en proceso' }
                ];
            } else if (v.model === 'Tsuru') {
                services = [
                    { type: 'Suspensión', date: '2023-07-20', cost: 3500, status: 'completed', description: 'Cambio de amortiguadores' },
                    { type: 'Mantenimiento General', date: '2023-08-20', cost: 1800, status: 'completed', description: 'Afinación completa' },
                    { type: 'Neumáticos', date: '2023-09-20', cost: 4200, status: 'completed', description: '4 Llantas nuevas' },
                    { type: 'Frenos', date: '2023-11-15', cost: 1200, status: 'completed', description: 'Rectificado de discos' }
                ];
            } else if (v.model === 'Cybertruck') {
                services = [
                    { type: 'Otro', date: '2023-11-27', cost: 0, status: 'pending', description: 'Actualización de Software v12.0' }
                ];
            }

            if (services.length > 0) {
                const servicesWithIds = services.map(s => ({
                    ...s,
                    vehicle_id: vehicle.id,
                    user_id: userId,
                    mileage_at_service: 0 // Default
                }));

                const { error: sError } = await supabase.from('services').insert(servicesWithIds);
                if (sError) console.error('Error seeding services:', sError);
            }
        }

        console.log('Base de datos poblada exitosamente.');
        alert('Base de datos poblada exitosamente. Recargando...');

        // Set Demo Flag for UI feedback
        sessionStorage.setItem('demo-mode', 'true');

        // Reload to fetch new data
        window.location.reload();

    } catch (error) {
        console.error('Seeder failed:', error);
        alert('Error al poblar la base de datos: ' + error.message);
    }
};
