import React from 'react';

export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="card" {...props}>{children}</div>
  );
}
