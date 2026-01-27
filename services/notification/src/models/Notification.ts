import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum NotificationChannel {
    IN_APP = 'in_app',
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    SLACK = 'slack',
    TELEGRAM = 'telegram'
}

export enum NotificationPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent'
}

export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    READ = 'read',
    FAILED = 'failed'
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    type: string;

    @Column({ type: 'jsonb', nullable: false })
    payload: Record<string, any>;

    @Column({ type: 'enum', enum: NotificationChannel, array: true, default: [NotificationChannel.IN_APP] })
    channels: NotificationChannel[];

    @Column({ type: 'enum', enum: NotificationPriority, default: NotificationPriority.MEDIUM })
    priority: NotificationPriority;

    @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
    status: NotificationStatus;

    @Column({ type: 'varchar', length: 500 })
    recipient: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    subject?: string;

    @Column({ type: 'text', nullable: true })
    content?: string;

    @Column({ type: 'jsonb', default: {} })
    metadata: {
        service: string;
        eventId: string;
        retryCount: number;
        sentToChannels: string[];
    };

    @Column({ type: 'timestamp', nullable: true })
    scheduledFor?: Date;

    @Column({ type: 'timestamp', nullable: true })
    sentAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    deliveredAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    readAt?: Date;

    @Column({ type: 'text', nullable: true })
    error?: string;

    @CreateDateColumn()
    createdAt: Date;

    @Index()
    @Column({ type: 'integer', nullable: true })
    userId?: number;

    @Index()
    @Column({ type: 'integer', nullable: true })
    orderId?: number;
}

@Entity('user_notification_preferences')
export class UserNotificationPreference {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    userId: number;

    @Column({ type: 'varchar', length: 100 })
    notificationType: string;

    @Column({ type: 'jsonb', default: {} })
    preferences: {
        email: boolean;
        sms: boolean;
        push: boolean;
        in_app: boolean;
        telegram: boolean;
        quiet_hours?: { start: string; end: string };
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
