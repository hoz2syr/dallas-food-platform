import { MenuItem } from '../value-objects/menu-item';
import {
  EmptyMenuItemsError,
  InvalidMenuNameError,
} from '../errors/menu-domain.error';

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
      throw new InvalidMenuNameError();
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new EmptyMenuItemsError();
    }

    this.id = id;
    this.name = name;
    this.items = items;
    this.createdAt = createdAt;
  }
}
