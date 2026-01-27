// roles.ts
export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

// مثال مستخدم وهمي (يجب استبداله بتكامل فعلي مع API أو Auth)
export const mockUser: User = {
  id: '1',
  name: 'مدير النظام',
  role: 'admin',
};
