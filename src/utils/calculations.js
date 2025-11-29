export const calculateCostPerKm = (vehicle) => {
    if (!vehicle || !vehicle.mileage || vehicle.mileage === 0) return 0;

    let totalCost = 0;
    if (vehicle.services && vehicle.services.length > 0) {
        totalCost = vehicle.services.reduce((sum, service) => sum + (parseFloat(service.cost) || 0), 0);
    }

    return totalCost / vehicle.mileage;
};

export const calculateFuelEfficiency = (fuelLogs) => {
    if (!fuelLogs || fuelLogs.length < 2) return { current: 0, average: 0 };

    // Sort logs by mileage (ascending) just in case
    const sortedLogs = [...fuelLogs].sort((a, b) => a.mileage - b.mileage);

    let totalEfficiency = 0;
    let count = 0;
    let currentEfficiency = 0;

    for (let i = 1; i < sortedLogs.length; i++) {
        const currentLog = sortedLogs[i];
        const previousLog = sortedLogs[i - 1];

        const distance = currentLog.mileage - previousLog.mileage;
        const liters = parseFloat(currentLog.liters);

        if (distance > 0 && liters > 0) {
            const efficiency = distance / liters;
            totalEfficiency += efficiency;
            count++;

            // The last calculated efficiency is the "current" one
            if (i === sortedLogs.length - 1) {
                currentEfficiency = efficiency;
            }
        }
    }

    const average = count > 0 ? totalEfficiency / count : 0;

    return {
        current: currentEfficiency,
        average: average
    };
};
