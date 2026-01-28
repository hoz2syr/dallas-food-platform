// lib/api/order.ts
// دوال استدعاء أوامر الطلب من Order Service

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: string;
  total: number;
  createdAt: string;
}

const ORDER_SERVICE_URL = process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:3001';

export async function createOrder(items: CartItem[]): Promise<Order> {
  const res = await fetch(`${ORDER_SERVICE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'x-api-key': process.env.NEXT_PUBLIC_ORDER_API_KEY || ''
    },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('فشل في إنشاء الطلب');
  return res.json();
}

export async function getOrder(orderId: string): Promise<Order> {
  const res = await fetch(`${ORDER_SERVICE_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error('فشل في جلب الطلب');
  return res.json();
}
