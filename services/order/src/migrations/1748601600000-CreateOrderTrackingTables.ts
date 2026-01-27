import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateOrderTrackingTables1748601600000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. تحديث جدول الطلبات بإضافة الأعمدة الجديدة
        await queryRunner.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS current_stage VARCHAR(50) DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS estimated_prep_time INTEGER,
            ADD COLUMN IF NOT EXISTS estimated_delivery_time INTEGER,
            ADD COLUMN IF NOT EXISTS stage_started_at TIMESTAMP;
        `);

        // 2. إنشاء جدول order_stages
        await queryRunner.createTable(new Table({
            name: "order_stages",
            columns: [
                { name: "id", type: "SERIAL", isPrimary: true },
                { name: "order_id", type: "uuid", isNullable: false },
                { name: "stage_name", type: "VARCHAR", length: "50", isNullable: false },
                { name: "status", type: "VARCHAR", length: "20", default: "'pending'" },
                { name: "started_at", type: "TIMESTAMP", isNullable: true },
                { name: "completed_at", type: "TIMESTAMP", isNullable: true },
                { name: "duration_minutes", type: "INTEGER", isNullable: true },
                { name: "assigned_to", type: "INTEGER", isNullable: true },
                { name: "notes", type: "TEXT", isNullable: true },
                { name: "created_at", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" },
                { name: "updated_at", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // 3. إنشاء جدول order_timeline
        await queryRunner.createTable(new Table({
            name: "order_timeline",
            columns: [
                { name: "id", type: "SERIAL", isPrimary: true },
                { name: "order_id", type: "uuid", isNullable: false },
                { name: "event_type", type: "VARCHAR", length: "50", isNullable: false },
                { name: "event_data", type: "JSONB", isNullable: false },
                { name: "created_by", type: "INTEGER", isNullable: true },
                { name: "created_at", type: "TIMESTAMP", default: "CURRENT_TIMESTAMP" }
            ]
        }), true);

        // 4. إضافة الفهارس والمفاتيح الخارجية
        await queryRunner.createForeignKey("order_stages", new TableForeignKey({
            columnNames: ["order_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "orders",
            onDelete: "CASCADE"
        }));
        await queryRunner.createForeignKey("order_timeline", new TableForeignKey({
            columnNames: ["order_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "orders",
            onDelete: "CASCADE"
        }));

        // 5. إضافة فهارس للأداء
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_order_stages_order_id ON order_stages(order_id);
            CREATE INDEX IF NOT EXISTS idx_order_stages_status ON order_stages(status);
            CREATE INDEX IF NOT EXISTS idx_order_timeline_order_id ON order_timeline(order_id);
            CREATE INDEX IF NOT EXISTS idx_order_timeline_created_at ON order_timeline(created_at DESC);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // إزالة الفهارس أولاً
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_order_timeline_created_at;
            DROP INDEX IF EXISTS idx_order_timeline_order_id;
            DROP INDEX IF EXISTS idx_order_stages_status;
            DROP INDEX IF EXISTS idx_order_stages_order_id;
        `);
        // إزالة الجداول
        await queryRunner.dropTable("order_timeline");
        await queryRunner.dropTable("order_stages");
        // إزالة الأعمدة المضافة من جدول orders
        await queryRunner.query(`
            ALTER TABLE orders 
            DROP COLUMN IF EXISTS stage_started_at,
            DROP COLUMN IF EXISTS estimated_delivery_time,
            DROP COLUMN IF EXISTS estimated_prep_time,
            DROP COLUMN IF EXISTS current_stage;
        `);
    }
}
