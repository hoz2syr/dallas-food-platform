import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../auth/roles';

interface ProtectedProps {
  allowed: UserRole[];
  children: React.ReactNode;
}

export default function Protected({ allowed, children }: ProtectedProps) {
  const { user } = useAuth();
  if (!user) return <div>يجب تسجيل الدخول</div>;
  if (!allowed.includes(user.role)) return <div>غير مصرح لك بالوصول لهذه الصفحة</div>;
  return <>{children}</>;
}
