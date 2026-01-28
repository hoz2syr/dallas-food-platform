import { render, screen } from '@testing-library/react';
import OrderTrackingPage from '../src/pages/OrderTrackingPage';

describe('OrderTrackingPage', () => {
  it('should render tracking input', () => {
    render(<OrderTrackingPage />);
    expect(screen.getByPlaceholderText('أدخل رقم الطلب')).toBeInTheDocument();
  });
});
