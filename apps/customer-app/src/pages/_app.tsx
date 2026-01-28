
import '../styles/base.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

import { CartProvider } from '../lib/context/CartContext';
import { AuthProvider } from '../lib/context/AuthContext';

function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1>Dallas Fast Food</h1>
          <p>Delicious Fast Food in Dallas</p>
        </div>
        <nav className="main-nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/menu" className="nav-link">Menu</Link>
          <Link href="/cart" className="nav-link">Cart</Link>
          <Link href="/profile" className="nav-link">Account</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
