import React from 'react';

export function RevenueChart({ data, label } : { data: { month: string; value: number }[], label: string }) {
  if (!data?.length) return null;
  const max = Math.max(...data.map(d => d.value));
  return (
    <svg width={340} height={140} style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #0001', margin: '16px 0' }}>
      <text x={170} y={18} fontSize={15} textAnchor="middle" fill="#222">{label}</text>
      {data.map((d, i) => {
        const barHeight = (d.value / max) * 80;
        return (
          <g key={d.month}>
            <rect x={i * 45 + 35} y={110 - barHeight} width={28} height={barHeight} fill="#38b000" rx={4} />
            <text x={i * 45 + 49} y={130} fontSize={12} textAnchor="middle">{d.month}</text>
            <text x={i * 45 + 49} y={110 - barHeight - 6} fontSize={11} textAnchor="middle" fill="#222">{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}
