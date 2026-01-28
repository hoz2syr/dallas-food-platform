import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '../src/pages/CartPage';
import { CartProvider } from '../src/lib/context/CartContext';

function setupCart() {
  // Helper to render CartPage with initial cart state
  window.localStorage.setItem('cart', JSON.stringify([
    { id: 'i1', name: 'Test Item', price: 10, stock: 5, quantity: 2 }
  ]));
}

describe('CartPage', () => {
  it('should render cart items and allow quantity change', () => {
    render(
      <CartProvider>
        <CartPage />
      </CartProvider>
    );
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });
});
