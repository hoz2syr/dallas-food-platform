export async function calculateRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
): Promise<{ distance: number; duration: number }> {
    // Simple calculation for distance and time (for development)
    // In production, use a service like Google Directions API or OSRM
    // Haversine formula to calculate distance between two coordinates (in kilometers)
    const R = 6371; // Earth's radius in kilometers
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    // Assume average city speed of 30 km/h
    const durationSeconds = (distanceKm / 30) * 3600;
    // Add extra time for traffic and stops
    const estimatedDuration = durationSeconds * (1 + Math.random() * 0.3);
    return {
        distance: distanceKm * 1000, // in meters
        duration: estimatedDuration // in seconds
    };
}
