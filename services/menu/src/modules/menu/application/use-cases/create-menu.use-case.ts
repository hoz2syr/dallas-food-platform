import { CreateMenuCommand } from '../commands/create-menu.command';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuItem } from '../../domain/value-objects/menu-item';
import { MenuRepository } from '../../domain/repositories/menu.repository';

export class CreateMenuUseCase {
  constructor(private readonly repository: MenuRepository) {}

  async execute(command: CreateMenuCommand): Promise<Menu> {
    const items = (command.items || []).map(i => new MenuItem({ id: i.id, name: i.name, price: i.price }));

    const menu = new Menu({
      id: command.menuId,
      name: command.name,
      items,
    });

    await this.repository.save(menu);

    return menu;
  }
}
