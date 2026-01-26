import { MenuRepository } from '../../domain/repositories/menu.repository';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuItem } from '../../domain/value-objects/menu-item';

export class ListMenusUseCase {
  constructor(private readonly repository: MenuRepository) {}

  async execute(): Promise<Menu[]> {
    return this.repository.findAll();
  }
}

export class UpdateMenuUseCase {
  constructor(private readonly repository: MenuRepository) {}

  async execute(menu: Menu): Promise<void> {
    await this.repository.update(menu);
  }
}

export class DeleteMenuUseCase {
  constructor(private readonly repository: MenuRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
