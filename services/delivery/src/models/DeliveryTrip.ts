import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DeliveryStatus } from '../types/delivery';

@Entity('delivery_trips')
export class DeliveryTrip {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer', nullable: false })
    orderId: number; // The order ID associated with the order service

    @Column({ type: 'varchar', length: 100 })
    deliveryAddress: string;

    @Column({ 
        type: 'enum', 
        enum: DeliveryStatus, 
        default: DeliveryStatus.PENDING 
    })
    status: DeliveryStatus; // PENDING, ASSIGNED, PICKED_UP, ON_ROUTE, DELIVERED, FAILED

    @Column({ type: 'integer', nullable: true })
    assignedDriverId?: number; // Can be linked to a Driver model in the future

    @Column({ type: 'varchar', length: 50, nullable: true })
    assignedDriverName?: string;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    pickupLat?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    pickupLng?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    destinationLat?: number;

    @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
    destinationLng?: number;

    @Column({ type: 'integer', nullable: true })
    estimatedDurationMinutes?: number; // Estimated trip duration

    @Column({ type: 'timestamp', nullable: true })
    pickedUpAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
