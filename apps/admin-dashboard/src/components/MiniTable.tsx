import React from 'react';
import './MiniTable.css';

export function MiniTable({ rows }: { rows: any[] }) {
  if (!rows?.length) return <div>لا توجد بيانات</div>;
  return (
    <table className="main-table mini-table">
      <thead>
        <tr>
          <th>رقم الطلب</th>
          <th>العميل</th>
          <th>المجموع</th>
          <th>الحالة</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.customer}</td>
            <td>{row.total} ر.س</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
