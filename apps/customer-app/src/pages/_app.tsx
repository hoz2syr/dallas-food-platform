import '../styles/base.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import ThemeToggle from '../components/ThemeToggle';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
