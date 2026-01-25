import { httpFetch } from './http-client';
import { Order } from '../../types/api/order.types';
import { HttpError } from '../../types/api/error.types';

async function handleResponse(res: Response) {
  const text = await res.text();
  let parsed: any = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch (_e) {
    // leave as text
  }

  if (!res.ok) {
    throw new HttpError(res.status, parsed);
  }

  return parsed;
}

export async function placeOrder(items: string[]): Promise<Order> {
  const orderId = `o-${Date.now()}`;
  const res = await httpFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({ orderId, items }),
  });

  const data = await handleResponse(res);
  return data as Order;
}
