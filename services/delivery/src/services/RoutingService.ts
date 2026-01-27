export async function calculateRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
): Promise<{ distance: number; duration: number }> {
    // حساب بسيط للمسافة والوقت للتنمية
    // في الإنتاج، استخدم خدمة مثل Google Directions API أو OSRM
    // صيغة هافرساين لحساب المسافة بين إحداثيين (بالكيلومترات)
    const R = 6371; // نصف قطر الأرض بالكيلومترات
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = R * c;
    // افتراض سرعة متوسطة 30 كم/ساعة في المدينة
    const durationSeconds = (distanceKm / 30) * 3600;
    // إضافة بعض الوقت الإضافي للازدحام والتوقف
    const estimatedDuration = durationSeconds * (1 + Math.random() * 0.3);
    return {
        distance: distanceKm * 1000, // بالمتر
        duration: estimatedDuration // بالثواني
    };
}
