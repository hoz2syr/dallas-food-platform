"use client";

import React, { useEffect, useState } from 'react';
import { getState, addItem, removeItem, updateQuantity, clear } from '../../lib/cart/cart-store';
import Link from 'next/link';

export default function CartWidget() {
  const [cart, setCart] = useState(getState());

  useEffect(() => {
    // simple polling to reflect changes from non-reactive store
    const t = setInterval(() => setCart(getState()), 300);
    return () => clearInterval(t);
  }, []);

  const onRemove = (id: string) => {
    try { removeItem(id); setCart(getState()); } catch (e) {}
  };

  const onInc = (id: string) => {
    try { const it = getState().items.find(i => i.id === id); if (it) updateQuantity(id, it.quantity + 1); setCart(getState()); } catch (e) {}
  };

  const onDec = (id: string) => {
    try { const it = getState().items.find(i => i.id === id); if (it) updateQuantity(id, Math.max(0, it.quantity -1)); setCart(getState()); } catch (e) {}
  };

  if (cart.items.length === 0) return (
    <div className="cart-widget cart-widget--empty">
      <div>Cart is empty</div>
      <Link href="/menu"><a className="cart-open">Browse menu</a></Link>
    </div>
  );

  return (
    <div className="cart-widget">
      <h4>Cart</h4>
      <div className="cart-items">
        {cart.items.map(it => (
          <div key={it.id} className="cart-item">
            <div className="cart-item__meta">
              <div className="cart-item__name">{it.name}</div>
              <div className="cart-item__price">${it.price}</div>
            </div>
            <div className="cart-item__controls">
              <button onClick={() => onDec(it.id)}>-</button>
              <span className="cart-qty">{it.quantity}</span>
              <button onClick={() => onInc(it.id)}>+</button>
              <button className="cart-remove" onClick={() => onRemove(it.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-total">Total: ${cart.total.toFixed(2)}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Link href="/checkout"><a className="cart-checkout">Checkout</a></Link>
        <button onClick={() => { clear(); setCart(getState()); }} className="cart-clear">Clear</button>
      </div>
    </div>
  );
}
