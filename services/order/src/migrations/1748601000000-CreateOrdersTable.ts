import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1748601000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "customerId" varchar NOT NULL,
        "customerName" varchar NOT NULL,
        "deliveryAddress" text NOT NULL,
        "totalAmount" decimal(10,2) NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "items" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_orders_status" ON "orders" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_orders_status";');
    await queryRunner.query('DROP TABLE "orders";');
  }
}
