import { differenceInDays, addDays } from 'date-fns';

/**
 * Calculates the predicted next service date based on usage history.
 * @param {Object} vehicle - The vehicle object containing current mileage.
 * @param {Array} services - List of service records.
 * @returns {Object|null} - Prediction object { date, confidence, avgKmPerDay } or null if insufficient data.
 */
export const calculateNextServiceDate = (vehicle, services) => {
    if (!vehicle || !services || services.length < 2) return null;

    // Filter valid services with mileage and date
    const validServices = services
        .filter(s => s.mileage_at_service && s.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort ascending (oldest first)

    if (validServices.length < 2) return null;

    const firstService = validServices[0];
    const lastService = validServices[validServices.length - 1];

    const deltaKm = lastService.mileage_at_service - firstService.mileage_at_service;
    const deltaDays = differenceInDays(new Date(lastService.date), new Date(firstService.date));

    // Avoid division by zero or negative usage
    if (deltaDays <= 0 || deltaKm <= 0) return null;

    const avgKmPerDay = deltaKm / deltaDays;

    // Determine service interval (default to 10,000 km if not specified or implied)
    // We could make this configurable per vehicle type
    const interval = vehicle.type === 'moto' ? 5000 : 10000;

    // Calculate remaining km for next service relative to the LAST service
    // Ideally, next service is at LastServiceKm + Interval
    const nextServiceTargetKm = lastService.mileage_at_service + interval;
    const remainingKm = nextServiceTargetKm - vehicle.mileage;

    // If remaining km is negative, service is overdue, but we still predict based on usage
    // However, for the date prediction, we want to know when we hit that target.
    // If we are already past it, the date will be in the past.

    const daysLeft = remainingKm / avgKmPerDay;
    const predictedDate = addDays(new Date(), daysLeft);

    // Calculate confidence based on data points and consistency (simplified)
    // More data points = higher confidence
    const confidence = Math.min(validServices.length * 20, 100); // 5 services = 100%

    return {
        date: predictedDate,
        confidence,
        avgKmPerDay,
        nextServiceKm: nextServiceTargetKm
    };
};
