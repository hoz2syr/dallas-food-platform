export class MenuItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly stock: number;

  constructor(props: { id: string; name: string; price: number; stock?: number }) {
    const { id, name, price, stock = 0 } = props;

    if (!id || id.trim() === '') {
      throw new Error('MenuItem id must be a non-empty string');
    }
    if (!name || name.trim() === '') {
      throw new Error('MenuItem name must be a non-empty string');
    }
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new Error('MenuItem price must be a non-negative number');
    }
    if (typeof stock !== 'number' || Number.isNaN(stock) || stock < 0) {
      throw new Error('MenuItem stock must be a non-negative number');
    }

    this.id = id;
    this.name = name;
    this.price = price;
    this.stock = stock;
  }
}
