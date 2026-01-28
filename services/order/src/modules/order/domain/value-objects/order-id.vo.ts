// Value object example
export class OrderId {
  constructor(public readonly value: string) {
    if (!value) throw new Error('OrderId cannot be empty');
  }
}
