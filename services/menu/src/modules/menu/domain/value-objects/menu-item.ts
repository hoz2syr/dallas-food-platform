export class MenuItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;

  constructor(props: { id: string; name: string; price: number }) {
    const { id, name, price } = props;

    if (!id || id.trim() === '') {
      throw new Error('MenuItem id must be a non-empty string');
    }
    if (!name || name.trim() === '') {
      throw new Error('MenuItem name must be a non-empty string');
    }
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new Error('MenuItem price must be a non-negative number');
    }

    this.id = id;
    this.name = name;
    this.price = price;
  }
}
