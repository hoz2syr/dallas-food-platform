import React from 'react';

export function MainButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="main-btn" {...props}>{children}</button>
  );
}
