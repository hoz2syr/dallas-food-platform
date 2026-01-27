import React, { useEffect, useState, useCallback } from 'react';
import { Table } from '../components/Table';
import { WebSocketClient } from '../lib/websocket';
import { Order } from '../components/Orders/types';
import { OrderStatusBadge } from '../components/Orders/OrderStatusBadge';
import { OrderActions } from '../components/Orders/OrderActions';
import '../styles/orders.css';
import { useToast } from '../components/ToastContext';

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'total'>('createdAt');
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [filter, sortBy]);

  useEffect(() => {
    const socket = WebSocketClient.connect();
    socket.on('order:updated', (updatedOrder: Order) => {
      setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order));
      showToast(`تم تحديث الطلب #${updatedOrder.id}`);
    });
    socket.on('order:created', (newOrder: Order) => {
      setOrders(prev => [newOrder, ...prev]);
      showToast(`طلب جديد #${newOrder.id}`);
    });
    return () => { socket.disconnect(); };
  }, [showToast]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ filter, sortBy, limit: '50' }).toString();
      const response = await fetch(`/api/orders?${query}`);
      if (!response.ok) throw new Error(`فشل في جلب الطلبات: ${response.status}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      showToast('فشل في جلب الطلبات', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy, showToast]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        showToast(`تم تحديث حالة الطلب #${orderId}`);
      }
    } catch (error) {
      showToast('فشل في تحديث الحالة', 'error');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'createdAt') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.total - a.total;
  });

  return (
    <div className="orders-management-page p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الطلبات</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => fetchOrders()}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            🔄 تحديث
          </button>
        </div>
      </div>

      {/* مرشحات وترتيب */}
      <div className="filters-section mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">تصفية حسب الحالة</label>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">جميع الطلبات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="preparing">قيد التحضير</option>
              <option value="ready">جاهز للتسليم</option>
              <option value="delivering">قيد التوصيل</option>
              <option value="delivered">تم التسليم</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ترتيب حسب</label>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2 border rounded"
            >
              <option value="createdAt">أحدث الطلبات</option>
              <option value="total">أعلى قيمة</option>
            </select>
          </div>
        </div>
      </div>

      {/* عرض النتائج */}
      <div className="stats mb-6 flex gap-4">
        <div className="stat-card">
          <div className="stat-number">{orders.length}</div>
          <div className="stat-label">إجمالي الطلبات</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {orders.filter(o => o.status === 'delivering').length}
          </div>
          <div className="stat-label">قيد التوصيل</div>
        </div>
      </div>

      {loading && (
        <div className="loading text-center p-8">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      )}

      {error && (
        <div className="error p-4 bg-red-50 text-red-700 rounded-lg mb-4">
          ⚠️ {error}
          <button 
            onClick={() => fetchOrders()}
            className="mr-4 text-sm underline"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <Table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-right">#</th>
                <th className="p-3 text-right">العميل</th>
                <th className="p-3 text-right">العنوان</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">الإجمالي</th>
                <th className="p-3 text-right">الوقت المتبقي</th>
                <th className="p-3 text-right">تاريخ الإنشاء</th>
                <th className="p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 border-b"
                  onClick={() => window.location.href = `/orders/${order.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="p-3 font-semibold">#{order.id.slice(-6)}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate">{order.deliveryAddress}</td>
                  <td className="p-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-3 font-semibold">{order.total.toFixed(2)} ر.س</td>
                  <td className="p-3">
                    {order.status === 'delivering' ? (
                      <div className="text-orange-600">
                        {order.estimatedDeliveryTime} دقيقة
                      </div>
                    ) : '-'}
                  </td>
                  <td className="p-3 text-gray-600">
                    {new Date(order.createdAt).toLocaleString('ar-EG', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <OrderActions 
                      order={order}
                      onStatusChange={updateOrderStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {sortedOrders.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              📭 لا توجد طلبات تطابق معايير التصفية
            </div>
          )}
        </>
      )}
    </div>
  );
}
