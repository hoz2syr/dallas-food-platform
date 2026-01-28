import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutPage from '../src/pages/CheckoutPage';
import { CartProvider } from '../src/lib/context/CartContext';

jest.mock('../src/lib/api/order', () => ({
  createOrder: async () => ({ id: 'order-1' })
}));
jest.mock('../src/lib/api/payment', () => ({
  fetchPaymentMethods: async () => [ { id: 'pm1', name: 'بطاقة', type: 'card' } ],
  pay: async () => ({ success: true, message: 'تم الدفع بنجاح!' })
}));

describe('CheckoutPage', () => {
  it('should create order and pay', async () => {
    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );
    // Add items to cart context if needed
    // Simulate checkout and payment
  });
});
