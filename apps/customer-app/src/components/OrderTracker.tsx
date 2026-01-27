import React, { useState, useEffect } from 'react';
import { Line } from 'rc-progress';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import socketClient from '../lib/socketClient';

interface TimelineEvent {
  id: number;
  type: string;
  data: any;
  timestamp: string;
  user?: { name: string; role: string };
}

interface OrderEstimates {
  preparation: { estimated: number; min: number; max: number };
  delivery: { estimated: number; min: number; max: number };
  total: { estimated: number; min: number; max: number };
}

interface OrderData {
  orderId: string;
  currentStatus: string;
  estimates: OrderEstimates;
  timeline: TimelineEvent[];
  lastUpdated: string;
  currentStageStarted?: string;
}

interface OrderTrackerProps {
  orderId: string;
}

const stages = [
  { id: 'confirmed', label: 'تم تأكيد الطلب', icon: '✓', color: 'green' },
  { id: 'preparation', label: 'قيد التحضير', icon: '👨‍🍳', color: 'blue' },
  { id: 'ready', label: 'جاهز للتسليم', icon: '📦', color: 'yellow' },
  { id: 'delivery', label: 'قيد التوصيل', icon: '🚚', color: 'orange' },
  { id: 'delivered', label: 'تم التوصيل', icon: '🎉', color: 'purple' }
];

const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId }) => {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    fetchOrderData();
    setupWebSocket();
    const interval = setInterval(updateTimeRemaining, 60000);
    return () => {
      clearInterval(interval);
      socketClient.disconnect();
    };
    // eslint-disable-next-line
  }, [orderId]);

  const fetchOrderData = async () => {
    const response = await fetch(`/api/orders/${orderId}/tracking`);
    const data = await response.json();
    setOrderData(data);
    setCurrentStage(data.currentStatus);
    updateProgress(data.currentStatus);
    updateTimeRemaining(data);
  };

  const setupWebSocket = () => {
    const socket = socketClient.connect(orderId);
    socket.on('order:stage:updated', (data: any) => {
      setCurrentStage(data.stage);
      updateProgress(data.stage);
      fetchOrderData();
    });
    socket.on('order:status:updated', () => {
      fetchOrderData();
    });
  };

  const updateProgress = (stage: string) => {
    const stageIndex = stages.findIndex(s => s.id === stage);
    const progressValue = ((stageIndex + 1) / stages.length) * 100;
    setProgress(progressValue);
  };

  const updateTimeRemaining = (dataOverride?: OrderData) => {
    const data = dataOverride || orderData;
    if (data?.estimates) {
      const now = new Date();
      const orderTime = new Date(data.lastUpdated);
      const elapsed = now.getTime() - orderTime.getTime();
      const remaining = data.estimates.total.estimated * 60000 - elapsed;
      if (remaining > 0) {
        const minutes = Math.ceil(remaining / 60000);
        setTimeRemaining(`متبقي ${minutes} دقيقة`);
      } else {
        setTimeRemaining('متأخر قليلاً ⏰');
      }
    }
  };

  const getStageLabel = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.label : stageId;
  };

  const calculateTimeSince = (dateString: string) => {
    const now = new Date();
    const started = new Date(dateString);
    const diff = Math.floor((now.getTime() - started.getTime()) / 60000);
    return `${diff} دقيقة`;
  };

  const getEventTitle = (type: string) => {
    switch (type) {
      case 'stage_changed': return 'تغيير المرحلة';
      case 'status_changed': return 'تغيير الحالة';
      case 'note_added': return 'إضافة ملاحظة';
      default: return type;
    }
  };

  const openChat = (orderId: string) => {
    alert(`فتح محادثة دعم للطلب #${orderId}`);
  };

  return (
    <div className="order-tracker-container">
      <div className="tracker-header">
        <h2>تتبع الطلب #{orderId}</h2>
        <div className="progress-section">
          <div className="progress-bar">
            <Line percent={progress} strokeWidth={4} strokeColor="#4CAF50" />
          </div>
          <div className="time-info">
            <span className="time-remaining">{timeRemaining}</span>
            {orderData?.estimates && (
              <span className="total-time">
                الوقت الإجمالي المتوقع: {orderData.estimates.total.estimated} دقيقة
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="stages-timeline">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isCompleted = stages.findIndex(s => s.id === currentStage) > index;
          return (
            <div key={stage.id} className={`stage-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
              <div className="stage-icon" style={{ backgroundColor: stage.color }}>
                {stage.icon}
              </div>
              <div className="stage-info">
                <h4>{stage.label}</h4>
                {isActive && orderData?.currentStageStarted && (
                  <p>بدأت منذ {calculateTimeSince(orderData.currentStageStarted)}</p>
                )}
              </div>
              {isCompleted && (
                <div className="checkmark">✓</div>
              )}
            </div>
          );
        })}
      </div>
      {orderData?.timeline && orderData.timeline.length > 0 && (
        <div className="timeline-events">
          <h3>تفاصيل التحديثات</h3>
          {orderData.timeline.map(event => (
            <div key={event.id} className="timeline-event">
              <div className="event-time">
                {format(new Date(event.timestamp), 'hh:mm a', { locale: ar })}
              </div>
              <div className="event-content">
                <strong>{getEventTitle(event.type)}</strong>
                {event.user && (
                  <span className="event-user"> بواسطة {event.user.name}</span>
                )}
                {event.data?.notes && (
                  <p className="event-notes">ملاحظة: {event.data.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="contact-section">
        <p>لديك استفسار؟</p>
        <button className="contact-button" onClick={() => openChat(orderId)}>
          💬 محادثة الدعم
        </button>
      </div>
    </div>
  );
};

export default OrderTracker;
