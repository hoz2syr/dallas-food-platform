export interface PlaceOrderCommand {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}
