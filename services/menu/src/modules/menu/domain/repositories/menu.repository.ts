import { Menu } from '../entities/menu.entity';

export interface MenuRepository {
  save(menu: Menu): Promise<void>;
  findById(id: string): Promise<Menu | null>;
}
