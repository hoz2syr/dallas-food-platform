// Simple service to convert an address to coordinates
// You can use OpenStreetMap Nominatim for free during development
export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    // For development simplicity, return default coordinates in Dallas
    // In production, use a service like Google Maps Geocoding or OpenStreetMap
    console.log(`📍 [Geocoding] Simulating geocode for: ${address}`);
    // Dallas city center coordinates (default for development)
    return {
        lat: 32.7767 + (Math.random() * 0.05 - 0.025), // Add some randomness for testing
        lng: -96.7970 + (Math.random() * 0.05 - 0.025)
    };
    // Real implementation example:
    // const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    // const data = await response.json();
    // if (data && data[0]) {
    //     return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    // }
    // return null;
}
