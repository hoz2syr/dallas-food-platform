"use client";

import React, { useState } from 'react';
import { getState, clear } from '../../lib/cart/cart-store';
import { placeOrder } from '../../lib/api/order-api';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('ASAP');
  const [payment, setPayment] = useState<'card'|'wallet'|'cash'>('card');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cart = getState();

  const onConfirm = async () => {
    setLoading(true);
    try {
      const order = await placeOrder(cart.items.map(i => i.id));
      clear();
      router.push(`/order/${order.id}`);
    } catch (e) {
      alert('Failed to place order');
    } finally { setLoading(false); }
  };

  return (
    <div className="checkout-root" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Checkout</h2>
      {/* Step 1: Review Order */}
      <div className={step === 1 ? "card fade-in-up checkout-step checkout-step--active" : "card checkout-step"} style={{ marginBottom: 24 }}>
        <h3>Review Order</h3>
        {cart.items.map(it => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>{it.name} x{it.quantity}</div>
            <div>${(it.price * it.quantity).toFixed(2)}</div>
          </div>
        ))}
        <div style={{ fontWeight: 600, color: 'var(--primary)', marginTop: 12 }}>Total: ${cart.total.toFixed(2)}</div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setStep(2)}>Next: Delivery</button>
      </div>

      {/* Step 2: Delivery Details */}
      <div className={step === 2 ? "card fade-in-up checkout-step checkout-step--active" : "card checkout-step"} style={{ marginBottom: 24 }}>
        <h3>Delivery Details</h3>
        <label htmlFor="checkout-address" style={{ fontWeight: 500 }}>Address</label>
        <input id="checkout-address" value={address} onChange={e=>setAddress(e.target.value)} className="checkout-input" placeholder="Enter your address" style={{ marginBottom: 12, marginTop: 4, padding: 8, borderRadius: 6, border: '1px solid #e9ecef', width: '100%' }} />
        <label htmlFor="checkout-time" style={{ fontWeight: 500 }}>Pickup / Delivery Time</label>
        <select id="checkout-time" value={time} onChange={e=>setTime(e.target.value)} className="checkout-select" style={{ marginBottom: 12, marginTop: 4, padding: 8, borderRadius: 6, border: '1px solid #e9ecef', width: '100%' }}>
          <option>ASAP</option>
          <option>In 30 minutes</option>
          <option>In 60 minutes</option>
        </select>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-outline" onClick={()=>setStep(1)}>Back</button>
          <button className="btn btn-primary" onClick={()=>setStep(3)}>Next: Payment</button>
        </div>
      </div>

      {/* Step 3: Payment */}
      <div className={step === 3 ? "card fade-in-up checkout-step checkout-step--active" : "card checkout-step"}>
        <h3>Payment</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <label><input type="radio" checked={payment==='card'} onChange={()=>setPayment('card')} /> Credit/Debit Card</label>
          <label><input type="radio" checked={payment==='wallet'} onChange={()=>setPayment('wallet')} /> Wallet</label>
          <label><input type="radio" checked={payment==='cash'} onChange={()=>setPayment('cash')} /> Cash on Delivery</label>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="btn btn-outline" onClick={()=>setStep(2)}>Back</button>
          <button className="btn btn-accent scale-in" onClick={onConfirm} disabled={loading}>{loading ? 'Placing...' : 'Confirm Order'}</button>
        </div>
      </div>
    </div>
  );
}
