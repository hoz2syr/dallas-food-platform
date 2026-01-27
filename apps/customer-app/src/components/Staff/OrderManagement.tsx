import React, { useState, useEffect } from 'react';
import socketClient from '../../lib/socketClient';

interface Order {
  id: string;
  status: string;
  stage: string;
  createdAt: string;
}

const OrderManagement: React.FC = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchActiveOrders();
    const interval = setInterval(fetchActiveOrders, 30000);
    const socket = socketClient.connect();
    socket.on('order:new', fetchActiveOrders);
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [filter]);

  const fetchActiveOrders = async () => {
    const response = await fetch(`/api/staff/orders?filter=${filter}`);
    const data = await response.json();
    setActiveOrders(data.orders || []);
  };

  const updateOrderStage = async (orderId: string, newStage: string) => {
    await fetch(`/api/staff/orders/${orderId}/stage`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage })
    });
    fetchActiveOrders();
  };

  return (
    <div className="order-management">
      <div className="filters">
        <button onClick={() => setFilter('pending')}>في الانتظار</button>
        <button onClick={() => setFilter('preparation')}>قيد التحضير</button>
        <button onClick={() => setFilter('ready')}>جاهزة للتوصيل</button>
        <button onClick={() => setFilter('delivery')}>قيد التوصيل</button>
      </div>
      <div className="orders-grid">
        {activeOrders.map(order => (
          <div key={order.id} className="order-card">
            <div>#{order.id}</div>
            <div>الحالة: {order.status}</div>
            <div>المرحلة: {order.stage}</div>
            <div>تاريخ الإنشاء: {new Date(order.createdAt).toLocaleString('ar-EG')}</div>
            <div>
              <button onClick={() => updateOrderStage(order.id, 'preparation')}>تحضير</button>
              <button onClick={() => updateOrderStage(order.id, 'ready')}>جاهز</button>
              <button onClick={() => updateOrderStage(order.id, 'delivery')}>توصيل</button>
              <button onClick={() => updateOrderStage(order.id, 'delivered')}>تم التوصيل</button>
            </div>
          </div>
        ))}
      </div>
      <div className="stats">
        <div className="stat-card">
          <h4>طلبات اليوم</h4>
          <p>{activeOrders.length}</p>
        </div>
        {/* يمكن إضافة المزيد من الإحصائيات */}
      </div>
    </div>
  );
};

export default OrderManagement;
