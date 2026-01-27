import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { text: string; color: string; bgColor: string }> = {
      pending: { text: 'قيد الانتظار', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      confirmed: { text: 'تم التأكيد', color: 'text-blue-700', bgColor: 'bg-blue-100' },
      preparing: { text: 'قيد التحضير', color: 'text-purple-700', bgColor: 'bg-purple-100' },
      ready: { text: 'جاهز للتسليم', color: 'text-green-700', bgColor: 'bg-green-100' },
      delivering: { text: 'قيد التوصيل', color: 'text-orange-700', bgColor: 'bg-orange-100' },
      delivered: { text: 'تم التسليم', color: 'text-teal-700', bgColor: 'bg-teal-100' },
      cancelled: { text: 'ملغي', color: 'text-red-700', bgColor: 'bg-red-100' },
    };
    return configs[status] || { text: status, color: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
      {config.text}
    </span>
  );
};
