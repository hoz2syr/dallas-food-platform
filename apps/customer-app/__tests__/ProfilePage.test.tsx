import { render, screen } from '@testing-library/react';
import ProfilePage from '../src/pages/ProfilePage';

jest.mock('../src/lib/api/crm', () => ({
  fetchUserProfile: async () => ({
    id: 'user-1', name: 'Test User', email: 'test@example.com', loyaltyPoints: 100, addresses: ['Riyadh']
  })
}));

describe('ProfilePage', () => {
  it('should render user profile', async () => {
    render(<ProfilePage />);
    expect(await screen.findByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Riyadh')).toBeInTheDocument();
  });
});
