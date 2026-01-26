import React from 'react';

export function Table({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <table className="main-table" {...props}>{children}</table>
  );
}
