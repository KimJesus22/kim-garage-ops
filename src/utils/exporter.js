export const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
        console.warn('No data to export');
        return;
    }

    // 1. Get Headers from the first object
    const headers = Object.keys(data[0]);

    // 2. Convert to CSV string
    const csvContent = [
        headers.join(','), // Header row
        ...data.map(row => {
            return headers.map(header => {
                let cell = row[header] === null || row[header] === undefined ? '' : row[header];

                // Convert arrays to string (e.g. parts list)
                if (Array.isArray(cell)) {
                    cell = cell.join(' | ');
                }

                // Escape quotes and wrap in quotes if necessary
                cell = cell.toString().replace(/"/g, '""');
                if (cell.search(/("|,|\n)/g) >= 0) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(',');
        })
    ].join('\n');

    // 3. Create Blob and Download Link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
