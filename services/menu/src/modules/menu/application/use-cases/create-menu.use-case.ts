import { CreateMenuCommand } from '../commands/create-menu.command';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuItem } from '../../domain/value-objects/menu-item';

export class CreateMenuUseCase {
  execute(command: CreateMenuCommand): Menu {
    const items = (command.items || []).map(i => new MenuItem({ id: i.id, name: i.name, price: i.price }));

    const menu = new Menu({
      id: command.menuId,
      name: command.name,
      items,
    });

    return menu;
  }
}
