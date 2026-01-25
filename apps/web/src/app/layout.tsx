import React from 'react';
import '../styles/base.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <header className="app-header">
          <nav className="app-nav">
            <a href="/">Home</a>
            <a href="/menu">Menu</a>
            <a href="/cart">Cart</a>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
