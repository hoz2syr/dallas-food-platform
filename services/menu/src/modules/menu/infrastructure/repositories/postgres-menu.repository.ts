import { Menu } from '../../domain/entities/menu.entity';
import { MenuRepository } from '../../domain/repositories/menu.repository';
import { client } from '../../../../../../services/menu/db/postgres.client';
import { MenuItem } from '../../domain/value-objects/menu-item';

export class PostgresMenuRepository implements MenuRepository {
  async save(menu: Menu): Promise<void> {
    const text = `INSERT INTO menus (id, name, items, created_at) VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, items = EXCLUDED.items, created_at = EXCLUDED.created_at`;
    const items = menu.items.map(i => ({ id: i.id, name: i.name, price: i.price }));
    const values = [menu.id, menu.name, JSON.stringify(items), menu.createdAt];
    await client.query(text, values as any);
  }

  async findById(id: string): Promise<Menu | null> {
    const res = await client.query('SELECT id, name, items, created_at FROM menus WHERE id = $1', [id]);
    if (res.rowCount === 0) return null;
    const row = res.rows[0];
    const itemsData: Array<{ id: string; name: string; price: number }> = row.items;
    const items = (Array.isArray(itemsData) ? itemsData : JSON.parse(itemsData || '[]')).map(
      it => new MenuItem({ id: it.id, name: it.name, price: it.price })
    );
    const menu = new Menu({ id: row.id, name: row.name, items, createdAt: new Date(row.created_at) });
    return menu;
  }
}
