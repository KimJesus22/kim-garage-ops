export const calculateCostPerKm = (vehicle) => {
    if (!vehicle || !vehicle.mileage || vehicle.mileage === 0) return 0;

    let totalCost = 0;
    if (vehicle.services && vehicle.services.length > 0) {
        totalCost = vehicle.services.reduce((sum, service) => sum + (parseFloat(service.cost) || 0), 0);
    }

    return totalCost / vehicle.mileage;
};
