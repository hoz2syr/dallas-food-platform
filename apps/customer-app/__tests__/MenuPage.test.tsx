import { render, screen, fireEvent } from '@testing-library/react';
import MenuPage from '../src/pages/MenuPage';
import { CartProvider } from '../src/lib/context/CartContext';

// Mock fetchMenus to return static data
jest.mock('../src/lib/api/menu', () => ({
  fetchMenus: async () => [
    { id: 'm1', name: 'Test Menu', items: [ { id: 'i1', name: 'Test Item', price: 10, stock: 5 } ] }
  ]
}));

describe('MenuPage', () => {
  it('should render menu and allow adding to cart', async () => {
    render(
      <CartProvider>
        <MenuPage />
      </CartProvider>
    );
    expect(await screen.findByText('Test Menu')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    const addBtn = screen.getByText('أضف للسلة');
    fireEvent.click(addBtn);
    // No error should occur
  });
});
