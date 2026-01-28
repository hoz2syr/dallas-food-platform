// lib/api/crm.ts
// دوال استدعاء بيانات المستخدم والطلبات السابقة من CRM Service

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  loyaltyPoints?: number;
  addresses?: string[];
}

export interface OrderHistoryItem {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

const CRM_SERVICE_URL = process.env.NEXT_PUBLIC_CRM_SERVICE_URL || 'http://localhost:3004';

export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const res = await fetch(`${CRM_SERVICE_URL}/users/${userId}`);
  if (!res.ok) throw new Error('فشل في جلب بيانات المستخدم');
  return res.json();
}

export async function fetchOrderHistory(userId: string): Promise<OrderHistoryItem[]> {
  const res = await fetch(`${CRM_SERVICE_URL}/users/${userId}/orders`);
  if (!res.ok) throw new Error('فشل في جلب سجل الطلبات');
  return res.json();
}
