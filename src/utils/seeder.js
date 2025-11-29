export const seedDatabase = () => {
    const timestamp = Date.now();
    const day = 86400000;

    // 1. Inventory Data
    const inventory = [
        { id: 1, name: 'Aceite Sintético 10W-40', stock: 15, price: 180, unit: 'L' },
        { id: 2, name: 'Filtro de Aceite Universal', stock: 8, price: 120, unit: 'pz' },
        { id: 3, name: 'Bujía Iridium', stock: 24, price: 250, unit: 'pz' },
        { id: 4, name: 'Balatas Cerámicas Delanteras', stock: 5, price: 850, unit: 'set' },
        { id: 5, name: 'Líquido de Frenos DOT4', stock: 10, price: 150, unit: 'L' },
        { id: 6, name: 'Anticongelante Concentrado', stock: 12, price: 200, unit: 'L' },
        { id: 7, name: 'Kit Cadena Distribución', stock: 3, price: 1200, unit: 'set' },
        { id: 8, name: 'Batería 12V Alto Rendimiento', stock: 4, price: 2800, unit: 'pz' },
        { id: 9, name: 'Limpiador de Inyectores', stock: 20, price: 90, unit: 'bote' },
        { id: 10, name: 'Filtro de Aire Deportivo', stock: 6, price: 450, unit: 'pz' }
    ];

    // 2. Vehicles Data
    const vehicles = [
        {
            id: 'demo-vehicle-1',
            brand: 'Vento',
            model: 'Lithium 150',
            name: 'Vento Lithium 150',
            year: 2023,
            type: 'moto',
            plate: 'VNT-2023',
            mileage: 12500,
            photo: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop', // Generic moto
            status: 'active',
            services: [
                { id: 'demo-service-1-1', type: 'Mantenimiento General', date: '2023-09-15', cost: 1200, status: 'completed', notes: 'Servicio de los 1000km' },
                { id: 'demo-service-1-2', type: 'Cambio de Aceite', date: '2023-10-15', cost: 450, status: 'completed', notes: 'Aceite Motul' },
                { id: 'demo-service-1-3', type: 'Frenos', date: '2023-11-01', cost: 600, status: 'completed', notes: 'Ajuste de balatas traseras' },
                { id: 'demo-service-1-4', type: 'Eléctrico', date: '2023-11-20', cost: 300, status: 'completed', notes: 'Cambio de foco principal' },
                { id: 'demo-service-1-5', type: 'Mantenimiento General', date: '2023-11-28', cost: 1500, status: 'in_progress', notes: 'Servicio mayor en proceso' }
            ],
            fuelLogs: []
        },
        {
            id: 'demo-vehicle-2',
            brand: 'Nissan',
            model: 'Tsuru',
            name: 'Nissan Tsuru "El Inmortal"',
            year: 2010,
            type: 'auto',
            plate: 'LEGEND-01',
            mileage: 400000,
            photo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop', // Generic white car
            status: 'active',
            services: [
                { id: 'demo-service-2-1', type: 'Suspensión', date: '2023-07-20', cost: 3500, status: 'completed', notes: 'Cambio de amortiguadores' },
                { id: 'demo-service-2-2', type: 'Mantenimiento General', date: '2023-08-20', cost: 1800, status: 'completed', notes: 'Afinación completa' },
                { id: 'demo-service-2-3', type: 'Neumáticos', date: '2023-09-20', cost: 4200, status: 'completed', notes: '4 Llantas nuevas' },
                { id: 'demo-service-2-4', type: 'Frenos', date: '2023-11-15', cost: 1200, status: 'completed', notes: 'Rectificado de discos' }
            ],
            fuelLogs: []
        },
        {
            id: 'demo-vehicle-3',
            brand: 'Tesla',
            model: 'Cybertruck',
            name: 'Tesla Cybertruck',
            year: 2024,
            type: 'auto',
            plate: 'MARS-X',
            mileage: 500,
            photo: 'https://images.unsplash.com/photo-1605218427368-35b861286977?q=80&w=1000&auto=format&fit=crop', // Futuristic car
            status: 'active',
            services: [
                { id: 'demo-service-3-1', type: 'Otro', date: '2023-11-27', cost: 0, status: 'pending', notes: 'Actualización de Software v12.0' }
            ],
            fuelLogs: []
        }
    ];

    // 3. Templates Data
    const templates = [
        { id: 1, name: 'Afinación Tsuru', laborCost: 800, items: [{ id: 1, name: 'Aceite', quantity: 4, unit: 'L' }, { id: 2, name: 'Filtro', quantity: 1, unit: 'pz' }] },
        { id: 2, name: 'Servicio Moto 150cc', laborCost: 400, items: [{ id: 1, name: 'Aceite', quantity: 1, unit: 'L' }, { id: 3, name: 'Bujía', quantity: 1, unit: 'pz' }] }
    ];

    // Save to LocalStorage
    localStorage.setItem('garage-inventory', JSON.stringify(inventory));
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    localStorage.setItem('garage-templates', JSON.stringify(templates));

    // Set Demo Flag
    sessionStorage.setItem('demo-mode', 'true');

    // Force Reload
    window.location.reload();
};
