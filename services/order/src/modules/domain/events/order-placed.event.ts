export class OrderPlacedEvent {
  readonly orderId: string;
  readonly occurredAt: Date;

  constructor(orderId: string) {
    this.orderId = orderId;
    this.occurredAt = new Date();
  }
}
