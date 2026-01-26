import { Menu } from '../../domain/entities/menu.entity';
import { MenuRepository } from '../../domain/repositories/menu.repository';
import { client } from '../../../../../../services/menu/db/postgres.client';
import { MenuItem } from '../../domain/value-objects/menu-item';

export class PostgresMenuRepository implements MenuRepository {
  async save(menu: Menu): Promise<void> {
    const text = `INSERT INTO menus (id, name, created_at) VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, created_at = EXCLUDED.created_at`;
    const values = [menu.id, menu.name, menu.createdAt];
    await client.query(text, values as any);

    // Remove existing items and re-insert for this menu
    await client.query('DELETE FROM menu_items WHERE menu_id = $1', [menu.id]);
    for (const item of menu.items) {
      await client.query(
        'INSERT INTO menu_items (id, menu_id, name, price) VALUES ($1, $2, $3, $4)',
        [item.id, menu.id, item.name, item.price]
      );
    }
  }

  async findById(id: string): Promise<Menu | null> {
    const menuRes = await client.query('SELECT id, name, created_at FROM menus WHERE id = $1', [id]);
    if (menuRes.rowCount === 0) return null;
    const row = menuRes.rows[0];
    const itemsRes = await client.query('SELECT id, name, price, image FROM menu_items WHERE menu_id = $1', [id]);
    const items = itemsRes.rows.map(
      (it: any) => new MenuItem({ id: it.id, name: it.name, price: Number(it.price), image: it.image })
    );
    return new Menu({ id: row.id, name: row.name, items, createdAt: new Date(row.created_at) });
  }

  async findAll(): Promise<Menu[]> {
    const menusRes = await client.query('SELECT id, name, created_at FROM menus');
    const menus: Menu[] = [];
    for (const row of menusRes.rows) {
      const itemsRes = await client.query('SELECT id, name, price, image FROM menu_items WHERE menu_id = $1', [row.id]);
      const items = itemsRes.rows.map(
        (it: any) => new MenuItem({ id: it.id, name: it.name, price: Number(it.price), image: it.image })
      );
      menus.push(new Menu({ id: row.id, name: row.name, items, createdAt: new Date(row.created_at) }));
    }
    return menus;
  }

  async update(menu: Menu): Promise<void> {
    // Save is already upsert, so just call save
    await this.save(menu);
  }

  async delete(id: string): Promise<void> {
    await client.query('DELETE FROM menu_items WHERE menu_id = $1', [id]);
    await client.query('DELETE FROM menus WHERE id = $1', [id]);
  }
}
