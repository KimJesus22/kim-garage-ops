import { formatCurrency } from './formatters';

export const exportToCSV = (vehicles) => {
    if (!vehicles || !vehicles.length) {
        console.warn('No data to export');
        return;
    }

    // 1. Flatten Data: One row per service
    const flattenedData = vehicles.flatMap(vehicle => {
        const services = vehicle.services || [];
        return services.map(service => {
            // Format Parts: "1x Aceite | 2x Bujía"
            const partsStr = service.parts
                ? service.parts.map(p => `${p.quantity}x ${p.name}`).join(' | ')
                : '';

            return {
                Fecha: new Date(service.date).toLocaleDateString('es-MX'),
                Vehiculo: `${vehicle.brand} ${vehicle.model}`,
                Tipo: vehicle.type,
                Descripcion: service.type, // Mapping 'type' to 'Descripcion' as per request context (Service Type)
                Refacciones: partsStr,
                Costo: service.cost, // Keeping raw number for Excel, or could format. Let's keep raw for calculation potential.
                Kilometraje: service.mileageAtService || 0
            };
        });
    });

    if (flattenedData.length === 0) {
        alert('No hay servicios registrados para exportar.');
        return;
    }

    // 2. Get Headers
    const headers = Object.keys(flattenedData[0]);

    // 3. Convert to CSV
    const csvRows = [
        headers.join(','), // Header
        ...flattenedData.map(row => {
            return headers.map(header => {
                let cell = row[header] === null || row[header] === undefined ? '' : row[header];

                // Escape quotes
                const cellStr = String(cell).replace(/"/g, '""');

                // Wrap in quotes if contains comma, newline or quote
                if (cellStr.search(/("|,|\n)/g) >= 0) {
                    return `"${cellStr}"`;
                }
                return cellStr;
            }).join(',');
        })
    ];

    const csvContent = csvRows.join('\n');

    // 4. Create Blob with BOM for Excel (Universal support for accents)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // 5. Generate Filename
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `GarageOps_Reporte_${dateStr}.csv`;

    // 6. Trigger Download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
