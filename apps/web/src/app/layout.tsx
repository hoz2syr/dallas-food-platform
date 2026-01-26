import React from 'react';
import '../styles/base.css';
import { LangProvider } from '../lib/lang/lang-context';
import LangSwitcher from '../lib/lang/lang-switcher';
import Search from '../components/search/Search';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <LangProvider>
          <header className="app-header">
            <nav className="app-nav">
              <a href="/">Home</a>
              <a href="/menu">Menu</a>
              <a href="/cart">Cart</a>
            </nav>
            <div className="header-controls">
              <Search />
              <LangSwitcher />
            </div>
          </header>
          <main>{children}</main>
        </LangProvider>
      </body>
    </html>
  );
}
