import { useEffect, useState } from 'react';
import socketClient from '../lib/socketClient';

interface OrderTrackingProps {
  orderId: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId }) => {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const socket = socketClient.connect(orderId);
    socket.on('order-status-updated', (data) => {
      setStatus(data.status);
      // يمكنك إضافة إشعار هنا
      // showNotification(`تم تحديث حالة الطلب إلى: ${data.status}`);
    });
    return () => {
      socketClient.disconnect();
    };
  }, [orderId]);

  return (
    <div>
      <h3>تتبع الطلب #{orderId}</h3>
      <p>الحالة الحالية: <strong>{status}</strong></p>
    </div>
  );
};

export default OrderTracking;
