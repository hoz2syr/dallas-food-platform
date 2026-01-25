import { Order } from '../../../domain/entities/order.entity';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { client } from '../../../../../db/postgres.client';

export class PostgresOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    const text = `INSERT INTO orders (id, status, created_at) VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, created_at = EXCLUDED.created_at`;
    const values = [order.id, order.status, order.createdAt];
    await client.query(text, values as any);
  }

  async findById(id: string): Promise<Order | null> {
    const res = await client.query('SELECT id, status, created_at FROM orders WHERE id = $1', [id]);
    if (res.rowCount === 0) return null;
    const row = res.rows[0];
    // Rehydrate minimal Order aggregate (items are not persisted in this minimal schema)
    const order = new Order(row.id, []);
    // set private fields (infra-level adjustment)
    (order as any)._status = row.status;
    (order as any).createdAt = new Date(row.created_at);
    return order;
  }
}
