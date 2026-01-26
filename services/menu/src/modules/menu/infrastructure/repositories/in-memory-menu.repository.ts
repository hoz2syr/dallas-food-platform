import { Menu } from '../../domain/entities/menu.entity';
import { MenuRepository } from '../../domain/repositories/menu.repository';

export class InMemoryMenuRepository implements MenuRepository {
  private readonly store: Map<string, Menu> = new Map();

  async save(menu: Menu): Promise<void> {
    this.store.set(menu.id, menu);
  }

  async findById(id: string): Promise<Menu | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(): Promise<Menu[]> {
    return Array.from(this.store.values());
  }

  async update(menu: Menu): Promise<void> {
    if (!this.store.has(menu.id)) throw new Error('Menu not found');
    this.store.set(menu.id, menu);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
import { Menu } from '../../../domain/entities/menu.entity';
import { MenuRepository } from '../../../domain/repositories/menu.repository';

export class InMemoryMenuRepository implements MenuRepository {
  private store: Map<string, Menu> = new Map();

  async save(menu: Menu): Promise<void> {
    this.store.set(menu.id, menu);
  }

  async findById(id: string): Promise<Menu | null> {
    const found = this.store.get(id) || null;
    return found;
  }
}
