import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatters';

export const generateVehicleReport = (vehicle) => {
    const doc = new jsPDF();

    // --- Header ---
    doc.setFillColor(11, 14, 17); // cod-darker
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(74, 222, 128); // neon-green
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE MANTENIMIENTO', 105, 20, { align: 'center' });

    doc.setTextColor(226, 232, 240); // cod-text
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 105, 30, { align: 'center' });

    // --- Vehicle Info ---
    doc.setFontSize(14);
    doc.setTextColor(11, 14, 17);
    doc.text('INFORMACIÓN DEL VEHÍCULO', 14, 55);

    doc.setDrawColor(74, 222, 128);
    doc.line(14, 58, 100, 58);

    doc.setFontSize(10);
    doc.text(`Vehículo: ${vehicle.brand} ${vehicle.model}`, 14, 68);
    doc.text(`Año: ${vehicle.year}`, 14, 74);
    doc.text(`Tipo: ${vehicle.type.toUpperCase()}`, 14, 80);
    doc.text(`Kilometraje Actual: ${vehicle.mileage.toLocaleString()} km`, 14, 86);

    // --- Services Table ---
    if (vehicle.services && vehicle.services.length > 0) {
        const tableData = vehicle.services.map(service => [
            new Date(service.date).toLocaleDateString('es-MX'),
            service.type,
            service.description || '-',
            service.mileageAtService ? `${service.mileageAtService.toLocaleString()} km` : '-',
            formatCurrency(service.cost)
        ]);

        autoTable(doc, {
            startY: 100,
            head: [['Fecha', 'Tipo', 'Descripción', 'Kilometraje', 'Costo']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [21, 26, 33], // cod-panel
                textColor: [74, 222, 128], // neon-green
                fontStyle: 'bold',
                lineWidth: 0.1,
                lineColor: [42, 59, 71] // cod-border
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        // Total Cost
        const totalCost = vehicle.services.reduce((sum, s) => sum + (parseFloat(s.cost) || 0), 0);
        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`COSTO TOTAL MANTENIMIENTO: ${formatCurrency(totalCost)}`, 196, finalY, { align: 'right' });
    } else {
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text('No hay registros de mantenimiento para este vehículo.', 14, 100);
    }

    // --- Footer ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Sistema de Gestión de Flota - COD Style', 105, 290, { align: 'center' });
    }

    // Save
    doc.save(`Reporte_${vehicle.brand}_${vehicle.model}.pdf`);
};
