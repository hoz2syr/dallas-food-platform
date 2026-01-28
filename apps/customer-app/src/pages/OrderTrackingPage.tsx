
import React, { useState } from 'react';
import OrderTracker from '../components/OrderTracker';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [showTracker, setShowTracker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTracker(true);
  };

  return (
    <div className="order-tracking-page">
      <h2>تتبع الطلب</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="أدخل رقم الطلب"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <button type="submit">تتبع</button>
      </form>
      {showTracker && orderId && <OrderTracker orderId={orderId} />}
    </div>
  );
}
