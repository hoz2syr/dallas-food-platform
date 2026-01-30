import React from 'react';
import Link from 'next/link';
import './Sidebar.css';

const navItems = [
  { href: '/DashboardOverviewPage', label: 'الرئيسية' },
  { href: '/OrdersManagementPage', label: 'الطلبات' },
  { href: '/PaymentsPage', label: 'المدفوعات' },
  { href: '/MenuManagementPage', label: 'القائمة' },
  { href: '/InventoryManagementPage', label: 'المخزون' },
  { href: '/AnalyticsPage', label: 'التقارير' },
  { href: '/PromotionsPage', label: 'العروض' },
  { href: '/CRMPage', label: 'العملاء' },
  { href: '/StaffManagementPage', label: 'الموظفون' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">لوحة الإدارة</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
