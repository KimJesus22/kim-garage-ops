import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <--- 1. CAMBIO: Importar la función directamente

export const generateVehicleReport = (vehicle) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('KIM-GARAGE-OPS // REPORTE TÁCTICO', margin, margin);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const dateStr = new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.text(dateStr, pageWidth - margin, margin, { align: 'right' });

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 5, pageWidth - margin, margin + 5);

    // --- Vehicle Info ---
    doc.setFont('courier', 'normal');
    doc.setFontSize(11);

    const startY = margin + 15;
    const lineHeight = 7;

    doc.text(`VEHÍCULO: ${vehicle.brand.toUpperCase()} ${vehicle.model.toUpperCase()}`, margin, startY);
    doc.text(`AÑO:      ${vehicle.year}`, margin, startY + lineHeight);
    doc.text(`TIPO:     ${vehicle.type.toUpperCase()}`, margin, startY + lineHeight * 2);
    doc.text(`KMS:      ${vehicle.mileage.toLocaleString()} km`, margin, startY + lineHeight * 3);
    doc.text(`ID:       ${vehicle.id}`, margin, startY + lineHeight * 4);

    // --- Services Table ---
    const tableStartY = startY + lineHeight * 6;

    const tableColumn = ["FECHA", "SERVICIO", "COSTO", "KILOMETRAJE"];
    const tableRows = [];

    if (vehicle.services && vehicle.services.length > 0) {
        const sortedServices = [...vehicle.services].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedServices.forEach(service => {
            const serviceData = [
                service.date,
                service.type + (service.description ? ` - ${service.description}` : ''),
                `$${service.cost.toLocaleString()}`,
                `${service.mileageAtService.toLocaleString()} km`
            ];
            tableRows.push(serviceData);
        });
    } else {
        tableRows.push(["-", "Sin registros de mantenimiento", "-", "-"]);
    }

    // <--- 2. CAMBIO: Usar la función importada pasando 'doc' como primer argumento
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: tableStartY,
        theme: 'grid',
        headStyles: {
            fillColor: [40, 40, 40],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            font: 'helvetica',
            fontSize: 10,
            cellPadding: 3
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        }
    });

    // --- Footer ---
    const footerText = 'Generado por Kim-Garage-Ops System - Ingeniería de Sistemas';
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // --- Save ---
    const fileName = `Reporte_${vehicle.model.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
};
