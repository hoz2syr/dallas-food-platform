import React, { useState } from 'react';

export default function PaymentsPage() {
  const [form, setForm] = useState({
    orderId: '',
    userId: '',
    amount: '',
    currency: 'SAR',
    paymentMethod: 'card',
  });
  type PaymentResult = {
    transactionId: string;
    amount: number;
    currency: string;
    // Add more fields here if needed, or remove this comment if not
  };
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل في معالجة الدفع');
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 420, margin: '0 auto'}}>
      <h2>معالجة دفعة جديدة</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
        <input name="orderId" placeholder="رقم الطلب" value={form.orderId} onChange={handleChange} required />
        <input name="userId" placeholder="رقم المستخدم" value={form.userId} onChange={handleChange} required />
        <input name="amount" placeholder="المبلغ" value={form.amount} onChange={handleChange} required type="number" min="1" />
        <label htmlFor="currency-select">العملة</label>
        <select
          id="currency-select"
          name="currency"
          value={form.currency}
          onChange={handleChange}
        >
          <option value="SAR">ريال سعودي</option>
          <option value="USD">دولار</option>
          <option value="EUR">يورو</option>
        </select>
        <label htmlFor="payment-method-select">طريقة الدفع</label>
        <select
          id="payment-method-select"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
        >
          <option value="card">بطاقة (Stripe)</option>
          <option value="wallet">محفظة (PayPal)</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? 'جاري المعالجة...' : 'تنفيذ الدفع'}</button>
      </form>
      {error && <div style={{color:'#e53935',marginTop:10}}>{error}</div>}
      {result && (
        <div style={{background:'#e0ffe0',marginTop:10,padding:10,borderRadius:8}}>
          <div>تمت العملية بنجاح!</div>
          <div>معرّف العملية: {result.transactionId}</div>
          <div>المبلغ: {result.amount} {result.currency}</div>
        </div>
      )}
    </div>
  );
}
