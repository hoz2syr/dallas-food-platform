
import React from 'react';
import { useCart } from '../lib/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>سلة التسوق</h2>
      {cart.length === 0 ? (
        <p>السلة فارغة.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <span>{item.name}</span>
                <span>{item.price} ريال</span>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.id, Number(e.target.value))}
                  className="cart-item-quantity"
                  aria-label={`كمية ${item.name}`}
                />
                <button onClick={() => removeFromCart(item.id)}>حذف</button>
              </li>
            ))}
          </ul>
          <div className="cart-total">الإجمالي: {total} ريال</div>
          <div className="cart-actions">
            <Link href="/checkout" className="main-btn">إتمام الطلب والدفع</Link>
            <button onClick={clearCart} className="cart-clear-btn">إفراغ السلة</button>
          </div>
        </>
      )}
    </div>
  );
}
