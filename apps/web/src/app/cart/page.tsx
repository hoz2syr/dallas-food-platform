"use client";
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
    <div className="cart-page" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Cart</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
      {cart.items.length === 0 && <div className="card" style={{ textAlign: 'center', padding: 32 }}>Cart is empty</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {cart.items.map((it) => (
          <div key={it.id} className="card fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 2 }}>{it.name}</div>
              <div className="small">${it.price} x {it.quantity}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline" onClick={() => handleUpdate(it.id, it.quantity + 1)}>+</button>
              <button className="btn btn-outline" onClick={() => handleUpdate(it.id, Math.max(0, it.quantity - 1))}>-</button>
              <button className="btn btn-accent" onClick={() => handleRemove(it.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontSize: '1.1rem', fontWeight: 600 }}>
        Total: <span style={{ color: 'var(--primary)' }}>${cart.total.toFixed(2)}</span>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn btn-primary scale-in" onClick={handlePlaceOrder} disabled={loading || cart.items.length === 0}>
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
