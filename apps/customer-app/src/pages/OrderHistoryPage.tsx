
import React, { useEffect, useState } from 'react';
import { fetchOrderHistory, OrderHistoryItem } from '../lib/api/crm';

export default function OrderHistoryPage() {
  // في التطبيق الفعلي: userId من المصادقة
  const userId = 'user-1';
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderHistory(userId)
      .then(setOrders)
      .catch(() => setError('فشل في جلب سجل الطلبات'));
  }, [userId]);

  return (
    <div className="order-history-page">
      <h2>الطلبات السابقة</h2>
      {error && <div className="error-msg">{error}</div>}
      {orders.length === 0 && !error ? (
        <p>لا يوجد طلبات سابقة.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              رقم الطلب: {order.id} | التاريخ: {order.createdAt} | الإجمالي: {order.total} ريال | الحالة: {order.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
