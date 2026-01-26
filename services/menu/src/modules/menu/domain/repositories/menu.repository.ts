import { Menu } from '../entities/menu.entity';

export interface MenuRepository {
  save(menu: Menu): Promise<void>;
  findById(id: string): Promise<Menu | null>;
  findAll(): Promise<Menu[]>;
  update(menu: Menu): Promise<void>;
  delete(id: string): Promise<void>;
}
