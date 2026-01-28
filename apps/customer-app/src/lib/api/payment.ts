// lib/api/payment.ts
// دوال استدعاء الدفع من Payment Service

export interface PaymentMethod {
  id: string;
  name: string;
  type: string; // card, applepay, mada, etc
}

export interface PaymentResult {
  success: boolean;
  message: string;
  paymentId?: string;
}

const PAYMENT_SERVICE_URL = process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 'http://localhost:3003';

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const res = await fetch(`${PAYMENT_SERVICE_URL}/methods`);
  if (!res.ok) throw new Error('فشل في جلب طرق الدفع');
  return res.json();
}

export async function pay(orderId: string, methodId: string, details: any): Promise<PaymentResult> {
  const res = await fetch(`${PAYMENT_SERVICE_URL}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, methodId, details }),
  });
  if (!res.ok) throw new Error('فشل في تنفيذ الدفع');
  return res.json();
}
