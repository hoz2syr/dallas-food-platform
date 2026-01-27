import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDeliveryTripsTable1748601700000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "delivery_trips",
            columns: [
                { name: "id", type: "SERIAL", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "orderId", type: "INTEGER", isNullable: false },
                { name: "deliveryAddress", type: "VARCHAR", length: "100", isNullable: false },
                { name: "status", type: "VARCHAR", length: "20", default: "'pending'" },
                { name: "assignedDriverId", type: "INTEGER", isNullable: true },
                { name: "assignedDriverName", type: "VARCHAR", length: "50", isNullable: true },
                { name: "pickupLat", type: "DECIMAL", precision: 10, scale: 7, isNullable: true },
                { name: "pickupLng", type: "DECIMAL", precision: 10, scale: 7, isNullable: true },
                { name: "destinationLat", type: "DECIMAL", precision: 10, scale: 7, isNullable: true },
                { name: "destinationLng", type: "DECIMAL", precision: 10, scale: 7, isNullable: true },
                { name: "estimatedDurationMinutes", type: "INTEGER", isNullable: true },
                { name: "pickedUpAt", type: "TIMESTAMP", isNullable: true },
                { name: "deliveredAt", type: "TIMESTAMP", isNullable: true },
                { name: "createdAt", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" },
                { name: "updatedAt", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" }
            ]
        }), true);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_delivery_trips_orderId ON delivery_trips(orderId);`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_delivery_trips_status ON delivery_trips(status);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_delivery_trips_status;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_delivery_trips_orderId;`);
        await queryRunner.dropTable("delivery_trips");
    }
}
