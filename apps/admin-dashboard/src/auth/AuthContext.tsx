import React, { createContext, useContext } from 'react';
import { User, mockUser } from '../auth/roles';

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // في التطبيق الفعلي: اجلب المستخدم من API أو Auth
  const user = mockUser;
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
