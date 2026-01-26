import React from 'react';

export function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
