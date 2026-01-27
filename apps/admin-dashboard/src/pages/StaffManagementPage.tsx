import React from 'react';
import Protected from '../auth/Protected';

export default function StaffManagementPage() {
  return (
    <Protected allowed={['admin', 'manager']}>
      <div className="staff-management-page">
        <h2>إدارة الموظفين</h2>
        {/* قائمة الموظفين، إضافة/تعديل/حذف موظف */}
      </div>
    </Protected>
  );
}
