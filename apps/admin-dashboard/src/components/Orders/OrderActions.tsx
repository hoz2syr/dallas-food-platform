import React from 'react';
import { Order } from './types';

interface OrderActionsProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order, onStatusChange }) => {
  const getNextStatusOptions = (currentStatus: string) => {
    const transitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready'],
      ready: ['delivering'],
      delivering: ['delivered'],
      delivered: [],
      cancelled: []
    };
    return transitions[currentStatus] || [];
  };

  const options = getNextStatusOptions(order.status);

  if (options.length === 0) return null;

  return (
    <select 
      value=""
      onChange={(e) => {
        if (e.target.value) {
          onStatusChange(order.id, e.target.value as Order['status']);
        }
      }}
      className="p-2 border rounded text-sm"
    >
      <option value="">تغيير الحالة</option>
      {options.map(status => (
        <option key={status} value={status}>
          {status === 'confirmed' && '✅ تأكيد الطلب'}
          {status === 'preparing' && '👨‍🍳 بدء التحضير'}
          {status === 'ready' && '📦 جاهز للتوصيل'}
          {status === 'delivering' && '🚚 بدء التوصيل'}
          {status === 'delivered' && '🏠 تم التسليم'}
          {status === 'cancelled' && '❌ إلغاء الطلب'}
        </option>
      ))}
    </select>
  );
};
