import React, { useState } from 'react';
import { getState, updateQuantity, removeItem, clear } from '../../lib/cart/cart-store';
import { placeOrder } from '../../lib/api/order-api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState(() => getState());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const refresh = () => setCart(getState());

  const handleUpdate = (id: string, qty: number) => {
    try {
      updateQuantity(id, qty);
      refresh();
    } catch (e: any) {
      setError(e && e.message ? e.message : String(e));
    }
  };

  const handleRemove = (id: string) => {
    try {
      removeItem(id);
      refresh();
    } catch (e: any) {
      setError(e && e.message ? e.message : String(e));
    }
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setLoading(true);
    try {
      // Create array of product IDs, repeating by quantity
      const items: string[] = [];
      cart.items.forEach((it) => {
        for (let i = 0; i < it.quantity; i++) items.push(it.id);
      });
      const order = await placeOrder(items);
      clear();
      router.push(`/orders/${order.id}?status=${encodeURIComponent(order.status)}`);
    } catch (e: any) {
      setError(e && e.message ? e.message : String(e));
    } finally {
      setLoading(false);
      refresh();
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {cart.items.length === 0 && <div>Cart is empty</div>}
      <ul>
        {cart.items.map((it) => (
          <li key={it.id} style={{ marginBottom: 8 }}>
            {it.name} — ${it.price} x {it.quantity}{' '}
            <button onClick={() => handleUpdate(it.id, it.quantity + 1)}>+</button>{' '}
            <button onClick={() => handleUpdate(it.id, Math.max(0, it.quantity - 1))}>-</button>{' '}
            <button onClick={() => handleRemove(it.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 8 }}>
        <strong>Total: ${cart.total.toFixed(2)}</strong>
      </div>
      <div style={{ marginTop: 8 }}>
        <button onClick={handlePlaceOrder} disabled={loading || cart.items.length === 0}>Place Order</button>
      </div>
    </div>
  );
}
