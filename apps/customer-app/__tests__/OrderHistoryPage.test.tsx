import { render, screen } from '@testing-library/react';
import OrderHistoryPage from '../src/pages/OrderHistoryPage';

jest.mock('../src/lib/api/crm', () => ({
  fetchOrderHistory: async () => [
    { id: 'o1', createdAt: '2026-01-01', total: 100, status: 'تم التوصيل' }
  ]
}));

describe('OrderHistoryPage', () => {
  it('should render order history', async () => {
    render(<OrderHistoryPage />);
    expect(await screen.findByText('رقم الطلب: o1')).toBeInTheDocument();
    expect(screen.getByText('2026-01-01')).toBeInTheDocument();
    expect(screen.getByText('100 ريال')).toBeInTheDocument();
    expect(screen.getByText('تم التوصيل')).toBeInTheDocument();
  });
});
