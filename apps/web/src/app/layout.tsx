import React from 'react';
import '@fontsource/bodoni-moda/700.css';
import '@fontsource/bodoni-moda/600.css';
import '@fontsource/raleway/400.css';
import '@fontsource/raleway/600.css';
import '../styles/base.css';
import '../styles/home.css';
import Providers from '../components/layout/Providers';
import Header from '../components/layout/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}