import React, { useState } from 'react';
import { useCart } from '../lib/context/CartContext';
import { createOrder } from '../lib/api/order';
import { fetchPaymentMethods, pay, PaymentMethod } from '../lib/api/payment';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState<string | null>(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setOrderId(null);
    setPaymentResult(null);
    try {
      const order = await createOrder(cart);
      setOrderId(order.id);
      setSuccess(`تم إنشاء الطلب بنجاح! رقم الطلب: ${order.id}`);
      clearCart();
      // جلب طرق الدفع بعد إنشاء الطلب
      const methods = await fetchPaymentMethods();
      setPaymentMethods(methods);
    } catch (e) {
      setError('فشل في إتمام الطلب. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!orderId || !selectedMethod) return;
    setPaymentLoading(true);
    setPaymentResult(null);
    try {
      // في تطبيق حقيقي: اجمع بيانات البطاقة أو ApplePay إلخ
      const result = await pay(orderId, selectedMethod, {});
      setPaymentResult(result.success ? 'تم الدفع بنجاح!' : `فشل الدفع: ${result.message}`);
    } catch {
      setPaymentResult('فشل في تنفيذ الدفع.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>الدفع والتأكيد</h2>
      {cart.length === 0 && !orderId ? (
        <p>السلة فارغة.</p>
      ) : (
        <>
          {!orderId && (
            <>
              <ul>
                {cart.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.quantity} = {item.price * item.quantity} ريال
                  </li>
                ))}
              </ul>
              <div className="cart-total">الإجمالي: {total} ريال</div>
              <button className="main-btn" onClick={handleCheckout} disabled={loading}>
                {loading ? 'جاري تنفيذ الطلب...' : 'إتمام الطلب'}
              </button>
            </>
          )}
          {orderId && paymentMethods.length > 0 && (
            <div className="payment-section">
              <h3>اختر طريقة الدفع</h3>
              <label htmlFor="payment-method-select" className="visually-hidden">طريقة الدفع</label>
              <select
                id="payment-method-select"
                value={selectedMethod}
                onChange={e => setSelectedMethod(e.target.value)}
                aria-label="طريقة الدفع"
              >
                <option value="">اختر...</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
              <button className="main-btn" onClick={handlePayment} disabled={!selectedMethod || paymentLoading}>
                {paymentLoading ? 'جاري الدفع...' : 'ادفع الآن'}
              </button>
              {paymentResult && <div className="payment-msg">{paymentResult}</div>}
            </div>
          )}
        </>
      )}
      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}
    </div>
  );
};

export default CheckoutPage;
