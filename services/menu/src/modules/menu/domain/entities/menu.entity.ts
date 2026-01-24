import { MenuItem } from '../value-objects/menu-item';

export class Menu {
  readonly id: string;
  readonly name: string;
  readonly items: MenuItem[];
  readonly createdAt: Date;

  constructor(props: {
    id: string;
    name: string;
    items?: MenuItem[];
    createdAt?: Date;
  }) {
    const { id, name, items = [], createdAt = new Date() } = props;

    if (!id || id.trim() === '') {
      throw new Error('Menu id must be a non-empty string');
    }
    if (!name || name.trim() === '') {
      throw new Error('Menu name must be a non-empty string');
    }
    if (!Array.isArray(items)) {
      throw new Error('Menu items must be an array');
    }

    this.id = id;
    this.name = name;
    this.items = items;
    this.createdAt = createdAt;
  }
}
