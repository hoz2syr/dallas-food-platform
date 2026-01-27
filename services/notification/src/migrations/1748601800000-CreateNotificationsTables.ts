import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateNotificationsTables1748601800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "notifications",
            columns: [
                { name: "id", type: "SERIAL", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "type", type: "VARCHAR", length: "100", isNullable: false },
                { name: "payload", type: "JSONB", isNullable: false },
                { name: "channels", type: "VARCHAR", isArray: true, isNullable: false, default: "'{in_app}'" },
                { name: "priority", type: "VARCHAR", length: "10", isNullable: false, default: "'medium'" },
                { name: "status", type: "VARCHAR", length: "10", isNullable: false, default: "'pending'" },
                { name: "recipient", type: "VARCHAR", length: "500", isNullable: false },
                { name: "subject", type: "VARCHAR", length: "255", isNullable: true },
                { name: "content", type: "TEXT", isNullable: true },
                { name: "metadata", type: "JSONB", isNullable: false, default: "'{}'" },
                { name: "scheduledFor", type: "TIMESTAMP", isNullable: true },
                { name: "sentAt", type: "TIMESTAMP", isNullable: true },
                { name: "deliveredAt", type: "TIMESTAMP", isNullable: true },
                { name: "readAt", type: "TIMESTAMP", isNullable: true },
                { name: "error", type: "TEXT", isNullable: true },
                { name: "createdAt", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" },
                { name: "userId", type: "INTEGER", isNullable: true },
                { name: "orderId", type: "INTEGER", isNullable: true }
            ]
        }), true);
        await queryRunner.createIndex("notifications", new TableIndex({ name: "IDX_notifications_userId", columnNames: ["userId"] }));
        await queryRunner.createIndex("notifications", new TableIndex({ name: "IDX_notifications_orderId", columnNames: ["orderId"] }));

        await queryRunner.createTable(new Table({
            name: "user_notification_preferences",
            columns: [
                { name: "id", type: "SERIAL", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "userId", type: "INTEGER", isNullable: false },
                { name: "notificationType", type: "VARCHAR", length: "100", isNullable: false },
                { name: "preferences", type: "JSONB", isNullable: false, default: "'{}'" },
                { name: "createdAt", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_notification_preferences");
        await queryRunner.dropIndex("notifications", "IDX_notifications_userId");
        await queryRunner.dropIndex("notifications", "IDX_notifications_orderId");
        await queryRunner.dropTable("notifications");
    }
}
