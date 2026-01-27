export interface Order {
  id: string;
  customerName: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: string;
  estimatedDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
}
