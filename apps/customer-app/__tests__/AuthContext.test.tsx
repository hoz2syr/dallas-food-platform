import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/lib/context/AuthContext';
import React from 'react';

function TestLogin() {
  const { user, login } = useAuth();
  React.useEffect(() => {
    login('test@example.com', 'password').catch(() => {});
  }, [login]);
  return <div>{user ? user.email : 'no user'}</div>;
}

describe('AuthContext', () => {
  it('should login and provide user', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'u1', name: 'Test', email: 'test@example.com', token: 'jwt-token' })
    });
    render(
      <AuthProvider>
        <TestLogin />
      </AuthProvider>
    );
    expect(await screen.findByText('test@example.com')).toBeInTheDocument();
  });
});
