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
