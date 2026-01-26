import React from 'react';

export function OrderCard({ orderId, status, items }: { orderId: string; status: string; items: string[] }) {
  return (
    <div className="order-card">
      <div className="order-id">طلب #{orderId}</div>
      <div className="order-status">الحالة: {status}</div>
      <ul className="order-items">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
}
