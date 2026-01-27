export enum DeliveryStatus {
    PENDING = 'pending',
    ASSIGNED = 'assigned',
    PICKED_UP = 'picked_up',
    ON_ROUTE = 'on_route',
    DELIVERED = 'delivered',
    FAILED = 'failed'
}

export interface DeliveryAssignmentEvent {
    orderId: number;
    customerName: string;
    deliveryAddress: string;
    items: Array<{name: string, quantity: number}>;
    restaurantLocation: { lat: number; lng: number };
    estimatedPrepTimeMinutes: number;
}
